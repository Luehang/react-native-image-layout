import React from "react";
import {
  Easing, Platform, Animated, Image,
  StyleSheet, Dimensions
} from "react-native";
import GallerySwiper from "react-native-gallery-swiper";
import PropTypes from "prop-types";
import ViewerBackground from "./ViewerBackground";
import ScrollSpacerView from "./ScrollSpacerView";
import ImageTransitionView from "./ImageTransitionView";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";

import type { ImageMeasurements } from "./Utils";

export default class ImageViewer extends React.PureComponent {
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
    sensitivePageScroll: PropTypes.bool,
    onPageSelected: PropTypes.func,
    onPageScrollStateChanged: PropTypes.func,
    onPageScroll: PropTypes.func,
    pageScrollViewStyle: PropTypes.object,
    onPageSingleTapConfirmed: PropTypes.func,
    onPageLongPress: PropTypes.func,
    renderPageHeader: PropTypes.func,
    renderPageFooter: PropTypes.func,
    removeClippedSubviewsPager: PropTypes.bool
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
    if (yOffset <= 50 || yOffset >= 2 * heightValue - 50) {
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
            {
              renderPageHeader &&
              <PageHeader
                renderPageHeader={renderPageHeader}
                image={imageSource}
                galleryIndex={imageSource.index}
                onClose={onClose}
              />
            }
            <GallerySwiper
              style={{ flex: 1, backgroundColor: "transparent" }}
              images={images}
              initialPage={this.props.galleryInitialIndex}
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
              removeClippedSubviews={this.props.removeClippedSubviewsPager}
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
        </Animated.View>
        <ScrollSpacerView width={width} height={height} />
      </Animated.ScrollView>
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
          renderPageHeader &&
          <PageHeader
            renderPageHeader={renderPageHeader}
            image={imageSource}
            galleryIndex={imageSource.index}
            onClose={onClose}
          />
        }
        <GallerySwiper
          style={{ flex: 1, backgroundColor: "black" }}
          images={images}
          initialPage={this.props.galleryInitialIndex}
          errorComponent={this.props.errorPageComponent}
          initialNumToRender={images.length + 1}
          flatListProps={this.props.pagesFlatListProps}
          pageMargin={this.props.pageMargin}
          sensitiveScroll={this.props.sensitivePageScroll}
          onPageScrollStateChanged={this.props.onPageScrollStateChanged}
          onPageScroll={this.props.onPageScroll}
          scrollViewStyle={this.props.pageScrollViewStyle}
          onSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
          onLongPress={this.props.onPageLongPress}
          removeClippedSubviews={this.props.removeClippedSubviewsPager}
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
      openProgress,
      openImageMeasurements,
      initialImageMeasurements
    } = this.state;
    const imageSource = this.props.images[this.props.galleryIndex];
    const transitionProgress: any = this._getTransitionProgress();
    if (Platform.OS === "ios") {
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
            {this._renderIOSVerticalScrollView(
              width,
              height,
              imageSource,
              openImageMeasurements,
              transitionProgress
            )}
          </Animated.View>
          {initialImageMeasurements &&
            openImageMeasurements &&
            (
              <ImageTransitionView
                source={imageSource && imageSource.source}
                transitionProgress={transitionProgress}
                dismissScrollProgress={this.state.dismissScrollProgress}
                initialImageMeasurements={initialImageMeasurements}
                openImageMeasurements={openImageMeasurements}
                imageWidth={imageSource.dimensions.width}
                imageHeight={imageSource.dimensions.height}
                width={width.__getValue()}
                height={height.__getValue()}
              />
            )}
        </Animated.View>
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
