import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Platform,
  View
} from "react-native";
import MasonryList from "react-native-masonry-list";
import ImageViewer from "./ImageViewer";

class ImageLayout extends React.PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.object.isRequired
    ).isRequired,
    onEndReached: PropTypes.func,
    onEndReachedThreshold: PropTypes.number,

    // Masonry props
    columns: PropTypes.number,
    spacing: PropTypes.number,
    initialColToRender: PropTypes.number,
    initialNumInColsToRender: PropTypes.number,
    sorted: PropTypes.bool,
    masonryFlatListColProps: PropTypes.object,
    renderMainHeader: PropTypes.func,
    renderMainFooter: PropTypes.func,
		onLongPressImage: PropTypes.func,
    imageContainerStyle: PropTypes.object,
    renderIndividualMasonryHeader: PropTypes.func,
    renderIndividualMasonryFooter: PropTypes.func,
    rerender: PropTypes.bool,

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
    onSwipeUpReleased: PropTypes.func,
    onSwipeDownReleased: PropTypes.func,
    maxScale: PropTypes.bool,
    maxOverScrollDistance: PropTypes.number,
    enableVerticalExit: PropTypes.bool
  }

  static defaultProps = {
    images: [],
		columns: 2,
		spacing: 1,
		initialColToRender: null,
		initialNumInColsToRender: 1,
		sorted: false,
		imageContainerStyle: {},
    onEndReachedThreshold: 0.8,
    sensitivePageScroll: false,
    enableVerticalExit: true
  }

  constructor(props) {
    super(props);
    this.state = {
      resolvedData: [],
      displayImageViewer: false,
      galleryInitialIndex: 0,
      galleryIndex: 0,
      imageId: ""
    };
  }

  _setImageData = (data) => {
    this.setState({ resolvedData: data });
  }

  openImageViewer = (imageId, index) => {
    this.setState({ displayImageViewer: true, imageId, galleryInitialIndex: index });
  }

  onChangePhoto = (imageId, galleryIndex) => {
    this.setState({
      imageId,
      galleryIndex
    });
  }

  closeImageViewer = () => {
    this.setState({ displayImageViewer: false, imageId: "" });
  }

  render() {
    return (
      <View style={{flex: 1}} {...this.props}>
        {
          this.props.renderMainHeader &&
            this.props.renderMainHeader()
        }
        <MasonryList
          images={this.props.images}
          columns={this.props.columns}
          spacing={this.props.spacing}
          // TODO: add masonry header and footer that
          // flows with the FlatList
          // renderMasonryHeader={this.props.renderMasonryHeader}
          // renderMasonryFooter={this.props.renderMasonryFooter}
          initialColToRender={this.props.initialColToRender}
					initialNumInColsToRender={this.props.initialNumInColsToRender}
          sorted={this.props.sorted}
          onLongPressImage={this.props.onLongPressImage}
          imageContainerStyle={this.props.imageContainerStyle}
          renderIndividualMasonryHeader={this.props.renderIndividualMasonryHeader}
          renderIndividualMasonryFooter={this.props.renderIndividualMasonryFooter}
          masonryFlatListColProps={this.props.masonryFlatListColProps}
          rerender={this.props.rerender}
          onImageResolved={(resolvedImage) => {
            resolvedImage.id = Math.random().toString(36).substring(7);
            return resolvedImage;
          }}
          onImagesResolveEnd={(resolvedImages) => {
            const resolvedData = resolvedImages.reduce((acc, curr) => acc.concat(curr)).sort(function (a, b) {
              return a.index - b.index;
            });
            this.setState({
              resolvedData: resolvedData
            });
          }}
          onPressImage={(data, i) => this.openImageViewer(data.id, i)}
          onEndReached={this.props.onEndReached}
          onEndReachedThreshold={this.props.onEndReachedThreshold}
        />
        {
          this.props.renderMainFooter &&
            this.props.renderMainFooter()
        }
        {this.state.displayImageViewer &&
          this.state.imageId ?
          (
            <Modal
              visible={this.state.displayImageViewer && this.state.imageId ? true : false}
              transparent={true}
              animationType={Platform.OS === "ios" ? "none" : "fade"}
              onRequestClose={this.closeImageViewer}>
              <ImageViewer
                images={this.state.resolvedData}
                imageId={this.state.imageId}
                galleryInitialIndex={this.state.galleryInitialIndex}
                galleryIndex={this.state.galleryIndex}
                onClose={this.closeImageViewer}
                onChangePhoto={this.onChangePhoto}
                displayImageViewer={this.state.displayImageViewer}

                imagePageComponent={this.props.imagePageComponent}
                errorPageComponent={this.props.errorPageComponent}
                pagesFlatListProps={this.props.pagesFlatListProps}
                pageMargin={this.props.pageMargin}
                sensitivePageScroll={this.props.sensitivePageScroll}
                onPageSelected={this.props.onPageSelected}
                onPageScrollStateChanged={this.props.onPageScrollStateChanged}
                onPageScroll={this.props.onPageScroll}
                pageScrollViewStyle={this.props.pageScrollViewStyle}
                onPageSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
                onPageLongPress={this.props.onPageLongPress}
                renderPageHeader={this.props.renderPageHeader}
                renderPageFooter={this.props.renderPageFooter}
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
                onTransformGestureReleased={this.props.onTransformGestureReleased}
                onSwipeUpReleased={this.props.onSwipeUpReleased}
                onSwipeDownReleased={this.props.onSwipeDownReleased}
                maxScale={this.props.maxScale}
                maxOverScrollDistance={this.props.maxOverScrollDistance}
                enableVerticalExit={this.props.enableVerticalExit}
                onEndReached={this.props.onEndReached}
                onEndReachedThreshold={this.props.onEndReachedThreshold}
              />
            </Modal>
          ) : null}
      </View>
    );
  }
}

export default ImageLayout;
