import React from "react";
import { View, FlatList, Platform } from "react-native";
import PropTypes from "prop-types";

import ImageCell from "./ImageCell";

// Takes props and returns a masonry column
export default class Column extends React.PureComponent {
	static propTypes = {
		data: PropTypes.array,
		columns: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		parentDimensions: PropTypes.object,
		columnKey: PropTypes.string,
		imageContainerStyle: PropTypes.object,
		spacing: PropTypes.number,
		backgroundColor: PropTypes.string,
		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,
		displayImageViewer: PropTypes.bool.isRequired,
		displayedImageId: PropTypes.string,

		renderIndividualMasonryHeader: PropTypes.func,
		renderIndividualMasonryFooter: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {
			images: [],
			columnWidth: 0
		};
	}

	componentWillMount() {
		this.setState({
			images: this._resizeImages(this.props.data, this.props.parentDimensions, this.props.columns)
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			images: this._resizeImages(nextProps.data, nextProps.parentDimensions, nextProps.columns)
		});
	}

	// Transforms an array of images with dimensions scaled according to the
	// column it is within
	// _resizeImages :: Data, parentDimensions. nColumns -> ResizedImage
	_resizeImages (data, parentDimensions, nColumns) {
		return Object.keys(data).map((key) => {
			const image = data[key];
			const imageSizedForColumn =
				this._resizeByColumns(data[key].dimensions, parentDimensions, nColumns);
			// Return a image object that width will be equivilent to
			// the column dimension, while retaining original image properties
			return {
				...image,
				...imageSizedForColumn
			};
		});
	}

	// Resize image while maintain aspect ratio
	// _resizeByColumns :: ImgDimensions , parentDimensions, nColumns  -> AdjustedDimensions
	_resizeByColumns (imgDimensions = { width: 0, height: 0 }, parentDimensions, nColumns = 2) {
		const {
			// height,
			width
		} = parentDimensions;

		// The gutter is 1% of the available view width
		const gutterBase = width / 100;
		const gutterSize = gutterBase * this.props.spacing;

		// Column gutters are shared between right and left image
		const columnWidth = (width / nColumns) - (gutterSize / 2);

		if (this.state.columnWidth !== columnWidth) {
			this.setState({
				columnWidth
			});
		}

		const divider = imgDimensions.width / columnWidth;

		const newWidth = imgDimensions.width / divider;
		const newHeight = imgDimensions.height / divider;

		return { width: newWidth, height: newHeight, gutter: gutterSize };
	}

	// Renders the "bricks" within the columns
	// _renderBrick :: images -> [TouchableTag || ImageTag...]
	_renderBrick = ({item, index}) => {
		// Example Data Structure
		// {
		//   "item": {
		//     "uri": "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg",
		//     "source": {},
		//     "column": 0,
		//     "dimensions": {
		//       "width": 625,
		//       "height": 415
		//     },
		//     "width": 180.675,
		//     "height": 119.96820000000001,
		//     "gutter": 3.65
		//   },
		//   "index": 9
		// }
		const {
			renderIndividualMasonryHeader, renderIndividualMasonryFooter,
			imageContainerStyle, onPressImage, onLongPressImage
		} = this.props;
		const props = {
			renderIndividualMasonryHeader, renderIndividualMasonryFooter,
			imageContainerStyle
		};

		return (
			<ImageCell
				{...props}

				data={item}
				imageId={item.id}
				source={item.source}
				onPressImage={onPressImage}
				onLongPressImage={onLongPressImage}
				shouldHideDisplayedImage={
					this.props.displayImageViewer
					&& this.props.displayedImageId === item.id
				}
			/>
		);
	}

	// _keyExtractor :: item -> id
	_keyExtractor = (item, index) => ("IMAGE-CELL-" + index.toString() + "---" + (item.id ? item.id : "0"));

	render() {
		return (
			<View
				style={{
					width: this.state.columnWidth,
					overflow: "hidden",
					flex: 1,
					backgroundColor: this.props.backgroundColor,
					flexDirection: "column"
				}}>
				<FlatList
					key={this.props.columnKey}
					data={this.state.images}
					keyExtractor={this._keyExtractor}
					initialNumToRender={this.props.initialNumInColsToRender}
					removeClippedSubviews={Platform.OS === "ios"}
					renderItem={this._renderBrick}
				/>
			</View>
		);
	}
}
