/* @flow */

import React from "react";
import { Easing, Platform, Animated, Image, View, StyleSheet, Dimensions } from "react-native";
import PropTypes from "prop-types";
import ViewerBackground from "./ViewerBackground";
import ScrollSpacerView from "./ScrollSpacerView";
// import ImageHorizontalContainer from "./ImageHorizontalContainer";
import ImageTransitionView from "./ImageTransitionView";
// import { getImageMeasurements } from "./Utils";

import type { ImageMeasurements } from "./Utils";

import Gallery from "./../Gallery";

class Footer extends React.Component {
  static propTypes = {
    renderPageFooter: PropTypes.func,
    images: PropTypes.array.isRequired,
    galleryIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
		if (this.props.galleryIndex !== nextProps.galleryIndex) {
			return true;
    }
		return false;
  }

  render() {
    const { renderPageFooter, images, galleryIndex, onClose } = this.props;
    const footer = renderPageFooter
      ? renderPageFooter(images[galleryIndex], galleryIndex, onClose)
      : undefined;
    return (
      <View style={{ bottom: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
        { footer }
      </View>
    );
  }
}

class Header extends React.Component {
  static propTypes = {
    renderPageHeader: PropTypes.func,
    images: PropTypes.array.isRequired,
    galleryIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
		if (this.props.galleryIndex !== nextProps.galleryIndex) {
			return true;
    }
		return false;
  }

  render() {
    const { renderPageHeader, images, galleryIndex, onClose } = this.props;
    const header = this.props.renderPageHeader
      ? renderPageHeader(images[galleryIndex], galleryIndex, onClose)
      : undefined;
    return (
      <View style={{ top: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
        { header }
      </View>
    );
  }
}

class ImageViewer extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    imageId: PropTypes.string.isRequired,
    galleryInitialIndex: PropTypes.number.isRequired,
    galleryIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onChangePhoto: PropTypes.func.isRequired,
    getSourceContext: PropTypes.func.isRequired,
    displayImageViewer: PropTypes.bool.isRequired,

    // Gallery props
    imagePageComponent: PropTypes.func,
    errorPageComponent: PropTypes.func,
    pagesFlatListProps: PropTypes.object,
    pageMargin: PropTypes.number,
    onPageSelected: PropTypes.func,
    onPageScrollStateChanged: PropTypes.func,
    onPageScroll: PropTypes.func,
    pageScrollViewStyle: PropTypes.object,
    onPageSingleTapConfirmed: PropTypes.func,
    onPageLongPress: PropTypes.func,
    renderPageHeader: PropTypes.func,
    renderPageFooter: PropTypes.func
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
      openImageMeasurements: null,
      imageWidth: 0,
      imageHeight: 0,
    };
  }

  componentDidMount() {
    this._measurePhotoSize();
  }

  componentWillReceiveProps(nextProps) {
    // Measure photo on horizontal scroll change
    if (this.props.imageId !== nextProps.imageId) {
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

  componentDidUpdate(prevProps, prevState) {
    this.state.openProgress &&
      Animated.timing(this.state.openProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.poly(3)),
        useNativeDriver: true
      }).start(() => this.setState({ openProgress: null }));
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
    // Measure opened photo size
    const image = this.props.images.find(
      (img) => img.id === this.props.imageId
    );
    if (!image) {
      throw new Error(
        `Fatal error, impossible to find image with id: ${this.props.imageId}`
      );
    }
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
      openImageMeasurements,
      imageHeight: imageSize.height,
      imageWidth: imageSize.width
    });
  }

  _handleRef = (ref: any) => {
    if (ref) {
      // Hack to enable scroll when the ref callback is called
      setTimeout(() => {
        ref &&
          ref.getNode().scrollResponderScrollTo({
            y: this.state.height.__getValue(),
            animated: false
          });
      }, 0);
    }
  }

  _onScroll = (e: Object) => {
    const yOffset = e.nativeEvent.contentOffset.y;
    const heightValue = this.state.height.__getValue();
    if (yOffset <= 0 || yOffset >= 2 * heightValue) {
      this.props.onClose();
    }
  }

  _renderVerticalScrollView(
    width: Animated.Value,
    height: Animated.Value,
    imageSource: ?ImageSource,
    openImageMeasurements: ?ImageMeasurements,
    openProgress: any,
    transitionProgress: any
  ) {
    const { renderPageHeader, renderPageFooter, images, galleryIndex, onClose } = this.props;
    if (Platform.OS === "ios") {
      return (
        <Animated.ScrollView
          ref={this._handleRef}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: this.state.dismissScrollProgress }
                }
              }
            ],
            { useNativeDriver: true, listener: this._onScroll }
          )}
          scrollEventThrottle={1}
          pagingEnabled={true}
          showsVerticalScrollIndicator={false}
        >
          <ScrollSpacerView width={width} height={height} />
          <Animated.View
            style={{
              width: width.__getValue(),
              height: height.__getValue(),
              flexDirection: "row",
              alignItems: "center",
              opacity: transitionProgress.interpolate({
                inputRange: [0.998, 0.999],
                outputRange: [0, 1]
              })
            }}
          >
            <Animated.View
              resizeMode="contain"
              style={{
                width: width.__getValue(),
                height: height.__getValue(),
                opacity: transitionProgress.interpolate({
                  inputRange: [0.998, 0.999],
                  outputRange: [0, 1]
                })
              }}
            >
              <Gallery
                style={{ flex: 1, backgroundColor: "transparent" }}
                images={this.props.images}
                initialPage={this.props.galleryInitialIndex}
                errorComponent={this.props.errorPageComponent}
                flatListProps={this.props.pagesFlatListProps}
                pageMargin={this.props.pageMargin}
                onPageScrollStateChanged={this.props.onPageScrollStateChanged}
                onPageScroll={this.props.onPageScroll}
                scrollViewStyle={this.props.pageScrollViewStyle}
                onSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
                onLongPress={this.props.onPageLongPress}
                openImageMeasurements={openImageMeasurements}
                imageComponent={(imageProps, imageDimensions) => {
                  if (!this.props.imagePageComponent) {
                    return (
                      <Image
                        {...imageProps}
                      />
                    );
                  } else {
                    return (
                      this.props.imagePageComponent(imageProps, imageDimensions)
                    );
                  }
                }}
                onPageSelected={(index) => {
                  this.props.onChangePhoto(this.props.images[index].id, index);
                  if (index !== this.props.galleryInitialIndex) {
                    this.setState(
                      {
                        initialImageMeasurements: null,
                        openImageMeasurements: null
                      }
                    );
                  }
                  this.props.onPageSelected
                    ? this.props.onPageSelected(index)
                    : null;
                }}
              />
              <Header
                renderPageHeader={renderPageHeader}
                images={images}
                galleryIndex={galleryIndex}
                onClose={onClose}
              />
              <Footer
                renderPageFooter={renderPageFooter}
                images={images}
                galleryIndex={galleryIndex}
                onClose={onClose}
              />
            </Animated.View>
          </Animated.View>

          {/* <ImageHorizontalContainer
            images={this.props.images}
            imageId={this.props.imageId}
            uri={imageSource ? imageSource.uri : ""}
            width={width.__getValue()}
            height={height.__getValue()}

            imageWidth={openImageMeasurements ? openImageMeasurements.width : 0}
            imageHeight={
              openImageMeasurements ? openImageMeasurements.height : 0
            }
            realImageWidth={this.state.imageWidth}
            realImageHeight={this.state.imageHeight}
            openProgress={openProgress}
            dismissProgress={dismissProgress}
            transitionProgress={transitionProgress}
            dismissScrollProgress={this.state.dismissScrollProgress}
            onChangePhoto={this.props.onChangePhoto}
            openImageMeasurements={openImageMeasurements || {}}
            onPressImage={this._onPressImage}
          /> */}
          <ScrollSpacerView width={width} height={height} />
        </Animated.ScrollView>
      );
    }
    return (
      <Animated.View
        style={{
          width: width.__getValue(),
          height: height.__getValue(),
          flexDirection: "row",
          alignItems: "center",
          opacity: transitionProgress.interpolate({
            inputRange: [0.998, 0.999],
            outputRange: [0, 1]
          })
        }}
      >
        <Animated.View
          resizeMode="contain"
          style={{
            width: width.__getValue(),
            height: height.__getValue(),
            opacity: transitionProgress.interpolate({
              inputRange: [0.998, 0.999],
              outputRange: [0, 1]
            })
          }}
        >
          <Header
            renderPageHeader={renderPageHeader}
            images={images}
            galleryIndex={galleryIndex}
            onClose={onClose}
          />
          <Gallery
            style={{ flex: 1, backgroundColor: "transparent" }}
            images={this.props.images}
            initialPage={this.props.galleryInitialIndex}
            errorComponent={this.props.errorPageComponent}
            flatListProps={this.props.pagesFlatListProps}
            pageMargin={this.props.pageMargin}
            onPageScrollStateChanged={this.props.onPageScrollStateChanged}
            onPageScroll={this.props.onPageScroll}
            scrollViewStyle={this.props.pageScrollViewStyle}
            onSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
            onLongPress={this.props.onPageLongPress}
            imageComponent={(imageProps, imageDimensions) => {
              if (!this.props.imagePageComponent) {
                return (
                  <Image
                    {...imageProps}
                  />
                );
              } else {
                return (
                  this.props.imagePageComponent(imageProps, imageDimensions)
                );
              }
            }}
            onPageSelected={(index) => {
              this.props.onChangePhoto(this.props.images[index].id, index);
              if (index !== this.props.galleryInitialIndex) {
                this.setState(
                  {
                    initialImageMeasurements: null,
                    openImageMeasurements: null
                  }
                );
              }
              this.props.onPageSelected
                ? this.props.onPageSelected(index)
                : null;
            }}
          />
          <Footer
            renderPageFooter={renderPageFooter}
            images={images}
            galleryIndex={galleryIndex}
            onClose={onClose}
          />
        </Animated.View>
      </Animated.View>

      // <ImageHorizontalContainer
      //   images={this.props.images}
      //   imageId={this.props.imageId}
      //   uri={imageSource ? imageSource.uri : ""}
      //   width={width.__getValue()}
      //   height={height.__getValue()}
      //   imageWidth={openImageMeasurements ? openImageMeasurements.width : 0}
      //   imageHeight={openImageMeasurements ? openImageMeasurements.height : 0}
      //   realImageWidth={this.state.imageWidth}
      //   realImageHeight={this.state.imageHeight}
      //   openProgress={openProgress}
      //   dismissProgress={dismissProgress}
      //   transitionProgress={transitionProgress}
      //   dismissScrollProgress={this.state.dismissScrollProgress}
      //   onChangePhoto={this.props.onChangePhoto}
      //   openImageMeasurements={openImageMeasurements || {}}
      //   onPressImage={this._onPressImage}
      // />
    );
  }

  render() {
    const {
      width,
      height,
      imageWidth,
      imageHeight,
      openProgress,
      openImageMeasurements,
      initialImageMeasurements
    } = this.state;
    const imageSource: ?ImageSource = this.props.images.find(
      (img: ImageSource) => img.id === this.props.imageId
    );
    const transitionProgress: any = this._getTransitionProgress();
    return (
      <Animated.View
        style={styles.topContainer}
        onLayout={Animated.event([
          { nativeEvent: { layout: { width, height } } }
        ])}
      >
        <Animated.View
          style={[styles.topContainer, { opacity: openProgress || 1 }]}
        >
          <ViewerBackground
            opacityProgress={this.state.dismissScrollProgress}
            inputRange={[0, height.__getValue(), height.__getValue() * 2]}
            outputRange={[0.02, 1, 0.02]}
          />
          {this._renderVerticalScrollView(
            width,
            height,
            imageSource,
            openImageMeasurements,
            openProgress,
            transitionProgress
          )}
        </Animated.View>
        {initialImageMeasurements &&
          openImageMeasurements &&
          (
            <ImageTransitionView
              source={{ uri: imageSource && imageSource.uri }}
              transitionProgress={transitionProgress}
              dismissScrollProgress={this.state.dismissScrollProgress}
              initialImageMeasurements={initialImageMeasurements}
              openImageMeasurements={openImageMeasurements}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              width={width.__getValue()}
              height={height.__getValue()}
            />
          )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});

export default ImageViewer;
