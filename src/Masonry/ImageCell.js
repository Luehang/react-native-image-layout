import React from "react";
import {
	Image,
	Easing,
	Animated,
	TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";

class ImageCell extends React.Component {
	_imageRef;
	_readyToMeasure;

	static propTypes = {
		data: PropTypes.object.isRequired,
		imageId: PropTypes.string.isRequired,
		source: PropTypes.any.isRequired,
		onPressImage: PropTypes.func.isRequired,
		shouldHideDisplayedImage: PropTypes.bool.isRequired,
		findImageIndex: PropTypes.func.isRequired,
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

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.shouldHideDisplayedImage !== nextProps.shouldHideDisplayedImage ||
			this.state.imageLoaded !== nextState.imageLoaded
		) {
			return true;
		}
		return false;
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
							y: imgPageY + this.props.data.gutter
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

	_onPressImage = (uri) => {
		// Wait for the image to load before reacting to press events
		if (this.state.imageLoaded) {
			const index = this.props.findImageIndex(uri);
			this.props.onPressImage(this.props.imageId, index);
		}
	}

	render() {
		const {
			data, imageId, source, findImageIndex, imageContainerStyle,
			renderIndividualMasonryHeader, renderIndividualMasonryFooter
		} = this.props;
		const header = (renderIndividualMasonryHeader)
			? renderIndividualMasonryHeader(data, findImageIndex(data.uri))
			: null;
		const footer = (renderIndividualMasonryFooter)
			? renderIndividualMasonryFooter(data, findImageIndex(data.uri))
			: null;
		return (
			<TouchableOpacity
				key={imageId}
				style={{margin: data.gutter / 2, marginTop: data.gutter}}
				onPress={() => this._onPressImage(source.uri)}
			>
				{header}
				<Animated.Image
					ref={(ref) => {
						this._imageRef = ref;
					}}
					onLayout={() => {
						this._readyToMeasure = true;
					}}
					onLoad={() => {
						this.setState({ imageLoaded: true });
					}}
					source={source}
					resizeMode="cover"
					style={[
						{
							width: data.width,
							height: data.height,
							backgroundColor: "lightgrey",
							...imageContainerStyle
						},
						{ opacity: this.state.opacity }
					]}
				/>
				{footer}
			</TouchableOpacity>
		);
	}
}

export default ImageCell;
