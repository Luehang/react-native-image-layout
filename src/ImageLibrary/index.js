/* @flow */

import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Platform,
  StyleSheet,
  View
} from "react-native";
import ImageViewer from "./ImageViewer";
import Masonry from "./../Masonry";

class ImageBrowser extends React.Component {
  // TODO: fix iOS page vertical swipe on close flickering bug
  // TODO: fix iOS page vertical swipe on close animations
  // TODO: fix iOS page horizontal swipe flickering images
  // TODO: fix Android masonry not rendering some images
  _imageMeasurers: { [imageId: string]: () => void }
  _imageSizeMeasurers: { [imageId: string]: () => void }

  static propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired
      }).isRequired
    ).isRequired,

    // Masonry props
    columns: PropTypes.number,
    masonryListViewProps: PropTypes.object,
    spacing: PropTypes.number,
    sorted: PropTypes.bool,
    // TODO: add masonry header and footer that
    // flows with the ListView
    // renderMasonryHeader: PropTypes.func,
    // renderMasonryFooter: PropTypes.func,
    imageContainerStyle: PropTypes.object,
    renderIndividualMasonryHeader: PropTypes.func,
    renderIndividualMasonryFooter: PropTypes.func,

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
    renderPageFooter: PropTypes.func,
  }

  static defaultProps = {
    columns: 2,
    masonryListViewProps: {},
    spacing: 1,
    sorted: false,
    imageContainerStyle: {},
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
      imageId: undefined
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

  _findImageIndex = (uri) => {
		return this.state.resolvedData.findIndex(
			(data) => data.uri.toLowerCase() === uri.toLowerCase()
		);
  }

  _setImageData = (data) => {
    this.setState({ resolvedData: data });
  }

  openImageViewer = (imageId, index) => {
    this.setState({ displayImageViewer: true, imageId, galleryInitialIndex: index });
  }

  closeImageViewer = () => {
    this.setState({ displayImageViewer: false, imageId: undefined });
  }

  onChangePhoto = (imageId, galleryIndex) => {
    this.setState({
      imageId,
      galleryIndex
    });
  }

  render() {
    return (
      <View style={styles.container} {...this.props}>
        <Masonry
          bricks={this.props.images}
          columns={this.props.columns}

          masonryListViewProps={this.props.masonryListViewProps}
          sorted={this.props.sorted}
          // TODO: add masonry header and footer that
          // flows with the ListView
          // renderMasonryHeader={this.props.renderMasonryHeader}
          // renderMasonryFooter={this.props.renderMasonryFooter}
          imageContainerStyle={this.props.imageContainerStyle}
          renderIndividualMasonryHeader={this.props.renderIndividualMasonryHeader}
          renderIndividualMasonryFooter={this.props.renderIndividualMasonryFooter}

          onPressImage={this.openImageViewer}
          displayImageViewer={this.state.displayImageViewer}
          displayedImageId={this.state.imageId}
          findImageIndex={this._findImageIndex}
          setImageData={this._setImageData}
        />
        {this.state.displayImageViewer &&
          this.state.imageId &&
          (
            <Modal
              visible={true}
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
                onPageSelected={this.props.onPageSelected}
                onPageScrollStateChanged={this.props.onPageScrollStateChanged}
                onPageScroll={this.props.onPageScroll}
                pageScrollViewStyle={this.props.pageScrollViewStyle}
                onPageSingleTapConfirmed={this.props.onPageSingleTapConfirmed}
                onPageLongPress={this.props.onPageLongPress}
                renderPageHeader={this.props.renderPageHeader}
                renderPageFooter={this.props.renderPageFooter}
              />
            </Modal>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default ImageBrowser;
