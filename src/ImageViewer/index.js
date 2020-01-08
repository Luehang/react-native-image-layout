import React from "react";
import {
  Easing, Platform, Animated, Image,
  Dimensions
} from "react-native";
import GallerySwiper from "react-native-gallery-swiper";
import SmartGallery from "react-native-smart-gallery";
import PropTypes from "prop-types";
import DefaultHeader from "./DefaultHeader";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";

import type { ImageMeasurements } from "./../utils";

export default class ImageViewer extends React.PureComponent {
  static propTypes = {
    images: PropTypes.array.isRequired,
    imageId: PropTypes.string.isRequired,
    galleryInitialIndex: PropTypes.number.isRequired,
    galleryIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onChangePhoto: PropTypes.func.isRequired,
    getSourceContext: PropTypes.func.isRequired,

    // Gallery props
    imagePageComponent: PropTypes.func,
    errorPageComponent: PropTypes.func,
    pagesFlatListProps: PropTypes.object,
    pageMargin: PropTypes.number,
    sensitivePageScroll: PropTypes.bool,
    onPageSelected: PropTypes.func,
    onPageScrollStateChanged: PropTypes.func,
    onPageScroll: PropTypes.func,
    pageScrollViewStyle: PropTypes.object,
    onPageSingleTapConfirmed: PropTypes.func,
    onPageLongPress: PropTypes.func,
    renderPageHeader: PropTypes.func,
    renderPageFooter: PropTypes.func,

    onDoubleTapConfirmed: PropTypes.func,
    onDoubleTapStartReached: PropTypes.func,
    onDoubleTapEndReached: PropTypes.func,
    onPinchTransforming: PropTypes.func,
    onPinchStartReached: PropTypes.func,
    onPinchEndReached: PropTypes.func,
    enableScale: PropTypes.bool,
    enableTranslate: PropTypes.bool,
    resizeMode: PropTypes.string,
    enableResistance: PropTypes.bool,
    resistantStrHorizontal: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
      PropTypes.string
    ]),
    resistantStrVertical: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.number,
      PropTypes.string
    ]),
    onViewTransformed: PropTypes.func,
    onTransformGestureReleased: PropTypes.func,
    maxScale: PropTypes.bool,
    maxOverScrollDistance: PropTypes.number,
    enableVerticalExit: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      width: new Animated.Value(Dimensions.get("window").width),
      height: new Animated.Value(Dimensions.get("window").height),
      openProgress: new Animated.Value(0),
      dismissProgress: null,
      dismissScrollProgress: new Animated.Value(Dimensions.get("window").height),
      initialImageMeasurements: null,
      openImageMeasurements: null
    };
  }

  componentDidMount() {
    this._measurePhotoSize();
  }

  componentDidUpdate(prevProps) {
    this.state.openProgress &&
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.poly(3)),
        useNativeDriver: true
      }).start(() => this.setState({ openProgress: null }));
    // Measure photo on horizontal scroll change
    if (prevProps.imageId !== this.props.imageId) {
      // TOOD: add opacity effect
      this.setState(
        {
          initialImageMeasurements: null,
          openImageMeasurements: null
        },
        () => this._measurePhotoSize()
      );
    }
  }

  _getTransitionProgress = () => {
    const gestureDismissProgress =
      this.state.dismissScrollProgress &&
      Platform.OS === "ios" &&
      this.state.dismissScrollProgress.interpolate({
        inputRange: [
          0,
          this.state.height.__getValue(),
          this.state.height.__getValue() * 2
        ],
        outputRange: [0.02, 1, 0.02]
      });
    return (
      this.state.openProgress || gestureDismissProgress || new Animated.Value(1)
    );
  }

  _measurePhotoSize = async () => {
    const { measurer, imageSizeMeasurer } = this.props.getSourceContext(
      this.props.imageId
    );
    const imageSize: {
      width: number,
      height: number
    } = await imageSizeMeasurer();
    const imageAspectRatio: number = imageSize.width / imageSize.height;
    const height: number = this.state.height.__getValue();
    const width: number = this.state.width.__getValue();
    const screenAspectRatio: number = width / height;
    let finalWidth: number = width;
    let finalHeight: number = width / imageAspectRatio;
    if (imageAspectRatio - screenAspectRatio < 0) {
      finalHeight = height;
      finalWidth = height * imageAspectRatio;
    }
    const finalX: number = (width - finalWidth) / 2;
    const finalY: number = (height - finalHeight) / 2;
    const openImageMeasurements: ImageMeasurements = {
      width: finalWidth,
      height: finalHeight,
      x: finalX,
      y: finalY,
      scale: finalWidth / width
    };
    // Measure initial photo size
    const initialImageMeasurements: ImageMeasurements = await measurer();
    this.setState({
      initialImageMeasurements,
      openImageMeasurements
    });
  }

  _handleVerticalSwipe = (transform) => {
    const { scale, translateY: y } = transform;
		if (scale === 1 && (y < -150 || y > 150)) {
      this.props.onClose();
		}
	}

  _renderIOSVerticalScrollView(
    width: Animated.Value,
    height: Animated.Value,
    imageSource: ?ImageSource,
    openImageMeasurements: ?ImageMeasurements,
    transitionProgress: any
  ) {
    const { renderPageHeader, renderPageFooter, images, onClose } = this.props;
    return (
      <Animated.View
        style={{
          width: width.__getValue(),
          height: height.__getValue(),
          opacity: transitionProgress.interpolate({
            inputRange: [0.998, 0.999],
            outputRange: [0, 1]
          })
        }}
      >
        {
          renderPageHeader
            ? <PageHeader
              renderPageHeader={renderPageHeader}
              image={imageSource}
              galleryIndex={imageSource.index}
              onClose={onClose}
            />
            : <DefaultHeader
              onClose={onClose}
            />
        }
        <GallerySwiper
          style={{ flex: 1, backgroundColor: "black" }}
          images={images}
          initialPage={this.props.galleryInitialIndex}
          initialNumToRender={this.props.images.length}
          errorComponent={this.props.errorPageComponent}
          flatListProps={this.props.pagesFlatListProps}
          pageMargin={this.props.pageMargin}
          sensitiveScroll={this.props.sensitivePageScroll}
          onPageScrollStateChanged={this.props.onPageScrollStateChanged}
          onPageScroll={this.props.onPageScroll}
          scrollViewStyle={this.props.pageScrollViewStyle}
          onSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
          onLongPress={this.props.onPageLongPress}
          openImageMeasurements={openImageMeasurements}
          imageComponent={(imageProps, imageDimensions, index) => {
            if (!this.props.imagePageComponent) {
              return <Image {...imageProps} />;
            } else {
              return this.props.imagePageComponent(imageProps, imageDimensions, index);
            }
          }}
          onPageSelected={(index) => {
            this.props.onChangePhoto(images[index].id, index);
            if (index !== this.props.galleryInitialIndex) {
              this.setState(
                {
                  initialImageMeasurements: null,
                  openImageMeasurements: null
                }
              );
            }
            this.props.onPageSelected &&
              this.props.onPageSelected(index);
          }}
          onPinchTransforming={(transform, i) => {
            if (this.props.onPinchTransforming) {
              this.props.onPinchTransforming(transform, i);
            }
          }}
          onPinchStartReached={(transform, i) => {
            if (this.props.onPinchStartReached) {
              this.props.onPinchStartReached(transform, i);
            }
          }}
          onDoubleTapStartReached={(transform, i) => {
            if (this.props.onDoubleTapStartReached) {
              this.props.onDoubleTapStartReached(transform, i);
            }
          }}
          onDoubleTapEndReached={(transform, i) => {
            if (this.props.onDoubleTapEndReached) {
              this.props.onDoubleTapEndReached(transform, i);
            }
          }}
          onDoubleTapConfirmed={this.props.onDoubleTapConfirmed}
          onPinchEndReach={this.props.onPinchEndReach}
          enableScale={this.props.enableScale}
          enableTranslate={this.props.enableTranslate}
          resizeMode={this.props.resizeMode}
          enableResistance={this.props.enableResistance}
          resistantStrHorizontal={this.props.resistantStrHorizontal}
          resistantStrVertical={this.props.resistantStrVertical}
          onViewTransformed={this.props.onViewTransformed}
          onTransformGestureReleased={(transform, i) => {
            if (this.props.enableVerticalExit) {
              this._handleVerticalSwipe(transform);
            }
            if (this.props.onTransformGestureReleased) {
              this.props.onTransformGestureReleased(transform, i);
            }
          }}
          maxScale={this.props.maxScale}
          maxOverScrollDistance={this.props.maxOverScrollDistance}
        />
        {
          renderPageFooter &&
          <PageFooter
            renderPageFooter={renderPageFooter}
            image={imageSource}
            galleryIndex={imageSource.index}
            onClose={onClose}
          />
        }
      </Animated.View>
    );
  }

  _renderAndroidVerticalView(
    width: Animated.Value,
    height: Animated.Value,
    imageSource: ?ImageSource,
    transitionProgress: any
  ) {
    const { renderPageHeader, renderPageFooter, images, onClose } = this.props;
    return (
      <Animated.View
        style={{
          width: width.__getValue(),
          height: height.__getValue(),
          opacity: transitionProgress.interpolate({
            inputRange: [0.998, 0.999],
            outputRange: [0, 1]
          })
        }}
      >
        {
          renderPageHeader
            ? <PageHeader
              renderPageHeader={renderPageHeader}
              image={imageSource}
              galleryIndex={imageSource.index}
              onClose={onClose}
            />
            : <DefaultHeader
              onClose={onClose}
            />
        }
        <SmartGallery
          images={images}
          index={this.props.galleryInitialIndex}
          errorComponent={this.props.errorPageComponent}
          pageMargin={this.props.pageMargin}
          sensitiveScroll={this.props.sensitivePageScroll}
          onPageScrollStateChanged={this.props.onPageScrollStateChanged}
          onPageScroll={this.props.onPageScroll}
          scrollViewStyle={this.props.pageScrollViewStyle}
          onSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
          onLongPress={this.props.onPageLongPress}
          removeClippedSubviews={this.props.removeClippedSubviewsPager}
          renderItem={(imageProps, imageDimensions, index) => {
            if (!this.props.imagePageComponent) {
              return <Image {...imageProps} />;
            } else {
              return this.props.imagePageComponent(imageProps, imageDimensions, index);
            }
          }}
          onPageSelected={(index) => {
            this.props.onChangePhoto(images[index].id, index);
            if (index !== this.props.galleryInitialIndex) {
              this.setState(
                {
                  initialImageMeasurements: null,
                  openImageMeasurements: null
                }
              );
            }
            this.props.onPageSelected &&
              this.props.onPageSelected(index);
          }}
          onDoubleTapConfirmed={this.props.onDoubleTapConfirmed}
          onDoubleTapStartReached={this.props.onDoubleTapStartReached}
          onDoubleTapEndReached={this.props.onDoubleTapEndReached}
          onPinchTransforming={this.props.onPinchTransforming}
          onPinchStartReached={this.props.onPinchStartReached}
          onPinchEndReached={this.props.onPinchEndReached}
          enableScale={this.props.enableScale}
          enableTranslate={this.props.enableTranslate}
          resizeMode={this.props.resizeMode}
          enableResistance={this.props.enableResistance}
          resistantStrHorizontal={this.props.resistantStrHorizontal}
          resistantStrVertical={this.props.resistantStrVertical}
          onViewTransformed={this.props.onViewTransformed}
          onTransformGestureReleased={(transform, i) => {
            if (this.props.enableVerticalExit) {
              this._handleVerticalSwipe(transform);
            }
            if (this.props.onTransformGestureReleased) {
              this.props.onTransformGestureReleased(transform, i);
            }
          }}
          maxScale={this.props.maxScale}
          maxOverScrollDistance={this.props.maxOverScrollDistance}
        />
        {
          renderPageFooter &&
          <PageFooter
            renderPageFooter={renderPageFooter}
            image={imageSource}
            galleryIndex={imageSource.index}
            onClose={onClose}
          />
        }
      </Animated.View>
    );
  }

  render() {
    const {
      width,
      height,
      openImageMeasurements,
    } = this.state;
    const imageSource = this.props.images[this.props.galleryIndex];
    const transitionProgress: any = this._getTransitionProgress();
    if (Platform.OS === "ios") {
      return this._renderIOSVerticalScrollView(
        width,
        height,
        imageSource,
        openImageMeasurements,
        transitionProgress
      );
    }
    return (
      this._renderAndroidVerticalView(
        width,
        height,
        imageSource,
        transitionProgress
      )
    );
  }
}
