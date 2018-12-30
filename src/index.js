import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Platform,
  View
} from "react-native";
import ImageViewer from "./ImageViewer";
import Masonry from "./MasonryList";

class ImageLayout extends React.PureComponent {
  // TODO: full animations for Android
  _imageMeasurers: { [imageId: string]: () => void }
  _imageSizeMeasurers: { [imageId: string]: () => void }

  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.object.isRequired
    ).isRequired,

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

  static defaultProps = {
    images: [],
		columns: 2,
		spacing: 1,
		initialColToRender: null,
		initialNumInColsToRender: 1,
		sorted: false,
		imageContainerStyle: {},
    onEndReachedThreshold: 25,
    sensitivePageScroll: false,
    removeClippedSubviewsPager: true
  }

  static childContextTypes = {
    onSourceContext: PropTypes.func.isRequired
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
    this._imageMeasurers = {};
    this._imageSizeMeasurers = {};
  }

  getChildContext() {
    return { onSourceContext: this._onSourceContext };
  }

  _onSourceContext = (
    imageId,
    cellMeasurer,
    imageMeasurer
  ) => {
    this._imageMeasurers[imageId] = cellMeasurer;
    this._imageSizeMeasurers[imageId] = imageMeasurer;
  }

  _getSourceContext = (imageId) => {
    return {
      measurer: this._imageMeasurers[imageId],
      imageSizeMeasurer: this._imageSizeMeasurers[imageId]
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
        <Masonry
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

          onPressImage={this.openImageViewer}
          displayImageViewer={this.state.displayImageViewer}
          displayedImageId={this.state.imageId}
          setImageData={this._setImageData}
        />
        {
          this.props.renderMainFooter &&
            this.props.renderMainFooter()
        }
        {this.state.displayImageViewer &&
          this.state.imageId &&
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
                getSourceContext={this._getSourceContext}
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
                removeClippedSubviewsPager={this.props.removeClippedSubviewsPager}
              />
            </Modal>
          )}
      </View>
    );
  }
}

export default ImageLayout;
