import { View, FlatList, Dimensions, Platform } from "react-native";
import React from "react";
import PropTypes from "prop-types";

import { resolveImage, resolveLocal } from "./model";
import Column from "./Column";

export default class MasonryList extends React.Component {
	_mounted = false;
	_resolvedData = [];

	static propTypes = {
		images: PropTypes.array.isRequired,
		columns: PropTypes.number,
		spacing: PropTypes.number,
		initialColToRender: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		sorted: PropTypes.bool,
		imageContainerStyle: PropTypes.object,
		renderIndividualMasonryHeader: PropTypes.func,
		renderIndividualMasonryFooter: PropTypes.func,
		masonryFlatListColProps: PropTypes.object,

		onPressImage: PropTypes.func,
		onLongPressImage: PropTypes.func,
		displayImageViewer: PropTypes.bool.isRequired,
		displayedImageId: PropTypes.string,
		setImageData: PropTypes.func.isRequired,

		onEndReachedThreshold: PropTypes.number,
	};

	constructor(props) {
		super(props);
		this.state = {
			dimensions: {},
			initialOrientation: true,
			_sortedData: []
		};
		// Assuming that rotation is binary (vertical|landscape)
		Dimensions.addEventListener("change", (window) => this.setState(state => ({ initialOrientation: !state.initialOrientation })));
	}

	componentWillMount() {
		this._mounted = true;
		this.resolveImages(this.props.images, this.props.columns);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	resolveImages = (images, columns) => {
		const firstRenderNum = this.props.initialColToRender * this.props.initialNumInColsToRender;
		const _resolvedData = new Array(images.length);
		let unsortedIndex = 0;
		let renderIndex = 0;
		let _batchOne = [];

		let columnHeightTotals = [];
		let columnCounting = 1;
		let columnHighestHeight = null;
		function _assignColumns(image, nColumns) {
			const columnIndex = columnCounting - 1;
			const { height } = image.dimensions;

			if (!columnHeightTotals[columnCounting - 1]) {
				columnHeightTotals[columnCounting - 1] = height;
			} else {
				columnHeightTotals[columnCounting - 1] = columnHeightTotals[columnCounting - 1] + height;
			}

			if (!columnHighestHeight) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			} else if (columnHighestHeight <= columnHeightTotals[columnCounting - 1]) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			}

			return columnIndex;
		}

		images
			.map((image) => {
				const source = image.source
					? image.source : image.uri
					? { uri: image.uri } : image.URI
					? { uri: image.URI } : image.url
					? { uri: image.url } : image.URL
					? { uri: image.URL } : undefined;

				if (source) {
					image.source = source;
				} else {
					// eslint-disable-next-line no-console
					console.warn(
						"react-native-image-layout",
						"Please provide a valid image field in " +
						"data images. Ex. source, uri, URI, url, URL"
					);
				}

				return image;
			})
			.map((image) => {
				if (!image.id) {
					image.id = idGenerator();
				}
				return image;
			})
			.map((image) => {
				const uri = image.source && image.source.uri
					? image.source.uri : image.uri
					? image.uri : image.URI
					? image.URI : image.url
					? image.url : image.URL
					? image.URL : undefined;

				if (image.dimensions && image.dimensions.width && image.dimensions.height) {
					return resolveLocal(image);
				}

				if (uri) {
					return resolveImage(image);
				} else {
					// eslint-disable-next-line no-console
					console.warn(
						"react-native-image-layout",
						"Please provide dimensions for your local images."
					);
				}
			})
			.map((resolveTask, index) => {
				if (resolveTask && resolveTask.fork) {
					resolveTask.fork(
						// eslint-disable-next-line handle-callback-err, no-console
						(err) => console.warn("react-native-image-layout", "Image failed to load."),
						(resolvedImage) => {
							if (this.props.sorted) {
								resolvedImage.index = index;
							} else {
								resolvedImage.index = unsortedIndex;
								unsortedIndex++;
							}

							resolvedImage.column = _assignColumns(resolvedImage, columns);

							_resolvedData.splice(resolvedImage.index, 1, resolvedImage);

							if (firstRenderNum - 1 > renderIndex) {
								const sortedData = _insertIntoColumn(resolvedImage, _batchOne, this.props.sorted);
								_batchOne = sortedData;
								renderIndex++;
							} else if (firstRenderNum - 1 === renderIndex) {
								const sortedData = _insertIntoColumn(resolvedImage, _batchOne, this.props.sorted);
								_batchOne = sortedData;
								this.setState({_sortedData: _batchOne});
								renderIndex++;
							} else if (firstRenderNum - 1 < renderIndex) {
								_batchOne = _insertIntoColumn(resolvedImage, _batchOne, this.props.sorted);
								renderIndex++;
							}

							if (images.length === renderIndex) {
								this.props.setImageData(_resolvedData);
								this.setState({_sortedData: _batchOne});
								renderIndex++;
							}
						}
					);
				}
			});
	}

	_setParentDimensions(event) {
		const {width, height} = event.nativeEvent.layout;

		if (this._mounted) {
			this.setState({
				dimensions: {
					width,
					height
				}
			});
		}
	}

	_onCallEndReach = () => {
		this.props.masonryFlatListColProps &&
		this.props.masonryFlatListColProps.onEndReached &&
			this.props.masonryFlatListColProps.onEndReached();
	}

	render() {
		return (
			<View style={{flex: 1}} onLayout={(event) => this._setParentDimensions(event)}>
				<FlatList
					style={{padding: (this.state.dimensions.width / 100) * this.props.spacing / 2, backgroundColor: "#fff"}}
					contentContainerStyle={{
						justifyContent: "space-between",
						flexDirection: "row",
						width: "100%"
					}}
					removeClippedSubviews={Platform.OS === "ios"}
					onEndReachedThreshold={this.props.onEndReachedThreshold}
					{...this.props.masonryFlatListColProps}
					onEndReached={this._onCallEndReach}
					initialNumToRender={this.props.initialColToRender}
					keyExtractor={(item, index) => "COLUMN-" + index.toString()}
					data={this.state._sortedData}
					renderItem={({item, index}) => {
						return (
							<Column
								data={item}
								columns={this.props.columns}
								initialNumInColsToRender={this.props.initialNumInColsToRender}
								parentDimensions={this.state.dimensions}
								imageContainerStyle={this.props.imageContainerStyle}
								spacing={this.props.spacing}
								key={`MASONRY-COLUMN-${index}`}

								onPressImage={this.props.onPressImage}
								onLongPressImage={this.props.onLongPressImage}
								displayImageViewer={this.props.displayImageViewer}
								displayedImageId={this.props.displayedImageId}

								renderIndividualMasonryHeader={this.props.renderIndividualMasonryHeader}
								renderIndividualMasonryFooter={this.props.renderIndividualMasonryFooter}
							/>
						);
					}}
				/>
			</View>
		);
	}
}

// Random unique id generator
export const idGenerator = () => Math.random().toString(36).substr(2, 9);

// Returns a copy of the dataSet with resolvedImage in correct place
export function _insertIntoColumn (resolvedImage, dataSet, sorted) {
	let dataCopy = dataSet;
	const columnIndex = resolvedImage.column;
	const column = dataSet[columnIndex];

	if (column) {
		column.push(resolvedImage);
		if (sorted) {
			column.sort((a, b) => (a.index < b.index) ? -1 : 1);
		}
		dataCopy[columnIndex] = column;
	} else {
		dataCopy.push([resolvedImage]);
	}

	return dataCopy;
}
