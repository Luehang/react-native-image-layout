import React from "react";
import {
	Image,
	Easing,
	Animated,
	TouchableOpacity
} from "react-native";
import Injector from "./Injector";
import PropTypes from "prop-types";

export default class ImageCell extends React.PureComponent {
	_imageRef;
	_readyToMeasure;

	static propTypes = {
		data: PropTypes.object.isRequired,
		imageId: PropTypes.string.isRequired,
		source: PropTypes.any.isRequired,
		onPressImage: PropTypes.func.isRequired,
		shouldHideDisplayedImage: PropTypes.bool.isRequired,
		renderIndividualMasonryHeader: PropTypes.func,
		renderIndividualMasonryFooter: PropTypes.func,
		imageContainerStyle: PropTypes.object
	}

	static contextTypes = {
		onSourceContext: PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.state = {
			opacity: new Animated.Value(1),
			imageLoaded: false
		};
		this._readyToMeasure = false;
	}

	componentWillMount() {
		this.context.onSourceContext(
			this.props.imageId,
			this.measurePhoto,
			this.measureImageSize
		);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.imageLoaded === false && this.state.imageLoaded) {
			Animated.timing(this.state.opacity, {
				toValue: 1,
				duration: 300,
				easing: Easing.inOut(Easing.ease)
			}).start();
		} else {
			if (this.props.shouldHideDisplayedImage) {
				this.state.opacity.setValue(0);
			} else {
				this.state.opacity.setValue(1);
			}
		}
	}

	measurePhoto = async () => {
		if (!this._imageRef || !this._readyToMeasure) {
			/* eslint-disable no-console */
			console.warn("measurePhoto: Trying to measure image without ref or layout");
		}
		return new Promise((resolve, reject) => {
			this._imageRef
				.getNode()
				.measure(
					(
						imgX,
						imgY,
						imgWidth,
						imgHeight,
						imgPageX,
						imgPageY
					) => {
						resolve({
							width: imgWidth,
							height: imgHeight,
							x: imgPageX,
							y: imgPageY + this.props.data.masonryDimensions.gutter
						});
					},
					reject
				);
		});
	}

	measureImageSize = async () => {
		if (!this.state.imageLoaded) {
			/* eslint-disable no-console */
			console.warn("measureImageSize: Undefined image size");
		}
		if (this.props.data && this.props.data.dimensions) {
			return {
				width: this.props.data.dimensions.width,
				height: this.props.data.dimensions.height
			};
		}
		return new Promise((resolve, reject) => {
			Image.getSize(
				this.props.source.uri,
				(width, height) => {
					resolve({ width, height });
				},
				(error) => {
					/* eslint-disable no-console */
					console.error(
						"measureImageSize: Error trying to get image size",
						JSON.stringify(error.message)
					);
					reject(error);
				}
			);
		});
	}

	_onPressImage = (index) => {
		// Wait for the image to load before reacting to press events
		if (this.state.imageLoaded) {
			this.props.onPressImage(this.props.imageId, index);
		}
	}

	_onLongPressImage = ({item, index}) => {
		// Wait for the image to load before reacting to press events
		if (this.state.imageLoaded) {
			this.props.onLongPressImage &&
				this.props.onLongPressImage({item, index});
		}
	}

	render() {
		const {
			data, imageId, source, imageContainerStyle,
			renderIndividualMasonryHeader, renderIndividualMasonryFooter
		} = this.props;
		const header = (renderIndividualMasonryHeader)
			? renderIndividualMasonryHeader(data, data.index)
			: null;
		const footer = (renderIndividualMasonryFooter)
			? renderIndividualMasonryFooter(data, data.index)
			: null;
		const imageProps = {
			ref: (ref) => {
				this._imageRef = ref;
			},
			onLayout: () => {
				this._readyToMeasure = true;
			},
			onLoad: () => {
				this.setState({ imageLoaded: true });
			},
			source: source,
			resizeMode: "cover",
			style: [
				{
					width: data.masonryDimensions.width,
					height: data.masonryDimensions.height,
					...imageContainerStyle
				},
				{ opacity: this.state.opacity }
			]
		};
		return (
			<TouchableOpacity
				key={imageId}
				style={{margin: data.masonryDimensions.gutter / 2}}
				onPress={() => this._onPressImage(data.index)}
				onLongPress={() =>
					this._onLongPressImage({item: data, index: data.index})
				}
			>
				{header}
				<Injector
					defaultComponent={Animated.Image}
					defaultProps={imageProps}
				/>
				{footer}
			</TouchableOpacity>
		);
	}
}
