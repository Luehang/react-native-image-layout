import React from "react";
import PropTypes from "prop-types";
import {
	Image,
	Easing,
	Animated,
	TouchableOpacity
} from "react-native";

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
		renderIndividualMasonryFooter: PropTypes.func
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
							y: imgPageY + this.props.gutter
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
		if (this.props.dimensions) {
			return {
				width: this.props.dimensions.width,
				height: this.props.dimensions.height
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
		const header = (this.props.renderIndividualMasonryHeader)
			? this.props.renderIndividualMasonryHeader(this.props.data, this.props.findImageIndex(this.props.data.uri))
			: null;
		const footer = (this.props.renderIndividualMasonryFooter)
			? this.props.renderIndividualMasonryFooter(this.props.data, this.props.findImageIndex(this.props.data.uri))
			: null;
		return (
			<TouchableOpacity
				key={this.props.imageId}
				onPress={() => this._onPressImage(this.props.source.uri)}
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
					source={this.props.source}
					resizeMode="cover"
					style={[
						{
							width: this.props.width,
							height: this.props.height,
							// marginTop: this.props.gutter,
							backgroundColor: "lightgrey",
							margin: this.props.gutter / 2,
							...this.props.imageContainerStyle
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
