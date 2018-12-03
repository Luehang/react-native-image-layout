import { View, FlatList, Dimensions } from "react-native";
import React, { Component } from "react";
import PropTypes from "prop-types";
import differenceBy from "lodash.differenceby";

import { resolveImage } from "./model";
import Column from "./Column";

const deviceWidth = Dimensions.get("window").width;

export default class Masonry extends Component {
	static propTypes = {
		bricks: PropTypes.array.isRequired,
		columns: PropTypes.number,
		spacing: PropTypes.number,
		initialColToRender: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,
		sorted: PropTypes.bool,
		imageContainerStyle: PropTypes.object,
		renderIndividualMasonryHeader: PropTypes.func,
		renderIndividualMasonryFooter: PropTypes.func,
		masonryFlatListColProps: PropTypes.object,

		onPressImage: PropTypes.func.isRequired,
		displayImageViewer: PropTypes.bool.isRequired,
		displayedImageId: PropTypes.string,
		findImageIndex: PropTypes.func.isRequired,
		setImageData: PropTypes.func.isRequired,

		priority: PropTypes.string,
		onEndReachedThreshold: PropTypes.number,
	};

	static defaultProps = {
		priority: "order",
		onEndReachedThreshold: 25
	};

	constructor(props) {
		super(props);
		// This creates an array of [1..n] with values of 0, each index represent a column within the masonry
		const columnHeights = generateColumnHeights(props.columns);
		this.state = {
			dimensions: {},
			initialOrientation: true,
			_sortedData: [],
			_resolvedData: [],
			_columnHeights: columnHeights,
			_uniqueCount: props.bricks.length
		};
		// Assuming that rotation is binary (vertical|landscape)
		Dimensions.addEventListener("change", (window) => this.setState(state => ({ initialOrientation: !state.initialOrientation })));
	}

	componentDidMount() {
		this.resolveBricks(this.props.bricks, this.props.columns);
	}

	componentWillReceiveProps(nextProps) {
		const differentColumns = this.props.columns !== nextProps.columns;
		const differentPriority = this.props.priority !== nextProps.priority;

		// We use the difference in the passed in bricks to determine if user is appending or not
		const brickDiff = differenceBy(nextProps.bricks, this.props.bricks, "uri");
		const appendedData = brickDiff.length !== nextProps.bricks.length;
		const _uniqueCount = brickDiff.length + this.props.bricks.length;

		// These intents would entail a complete re-render of the listview
		if (differentColumns || differentPriority || !appendedData) {
			this.setState(state => ({
				_sortedData: [],
				_resolvedData: [],
				_columnHeights: generateColumnHeights(nextProps.columns),
				_uniqueCount
			}), this.resolveBricks(nextProps.bricks, nextProps.columns));
		}

		// TODO: optimize masonry list
	}

	resolveBricks(bricks, columns, offSet = 0) {
		if (bricks.length === 0) {
			// clear and re-render
			this.setState(state => ({
				_sortedData: []
			}));
		}

		// Sort bricks and place them into their respectable columns
		// Issues arrise if state changes occur in the midst of a resolve
		bricks
			.map((brick, index) => assignObjectColumn(columns, index, brick))
			.map((brick, index) => assignObjectIndex(offSet + index, brick))
			.map((brick, index) => {
				if (!brick.id) {
					const newBrick = brick;
					newBrick.id = idGenerator();
					return newBrick;
				}
				return brick;
			})
			.map(brick => resolveImage(brick))
			.map((resolveTask, index) => resolveTask.fork(
				// eslint-disable-next-line handle-callback-err, no-console
				(err) => console.warn("Image failed to load"),
				(resolvedBrick) => {
					this.setState(state => {
						const sortedData = this._insertIntoColumn(resolvedBrick, state._sortedData);
						return {
							_sortedData: sortedData,
							_resolvedData: [...state._resolvedData, resolvedBrick]
						};
					});
					if (index === bricks.length - 1) {
						this.props.setImageData(this.state._resolvedData);
					}
				}));
	}

	_setParentDimensions(event) {
		// Currently height isn't being utilized, but will pass through for future features
		const {width, height} = event.nativeEvent.layout;

		this.setState({
			dimensions: {
				width,
				height
			}
		});
	}

	_insertIntoColumn = (resolvedBrick, dataSet) => {
		let dataCopy = dataSet.slice();
		const priority = this.props.priority;
		let columnIndex;

		switch (priority) {
			case "balance":
				// Best effort to balance but sometimes state changes may have delays when performing calculation
				columnIndex = findMinIndex(this.state._columnHeights);
				const heightsCopy = this.state._columnHeights.slice();
				const newColumnHeights = heightsCopy[columnIndex] + resolvedBrick.dimensions.height;
				heightsCopy[columnIndex] = newColumnHeights;
				this.setState({
					_columnHeights: heightsCopy
				});
				break;
			case "order":
			default:
				columnIndex = resolvedBrick.column;
				break;
		}

		const column = dataSet[columnIndex];
		const sorted = this.props.sorted;

		if (column) {
			// Append to existing "row"/"column"
			let bricks = [...column, resolvedBrick];
			if (sorted) {
				// Sort bricks according to the index of their original array position
				bricks = bricks.sort((a, b) => (a.index < b.index) ? -1 : 1);
			}
			dataCopy[columnIndex] = bricks;
		} else {
			// Pass it as a new "row" for the data source
			dataCopy = [...dataCopy, [resolvedBrick]];
		}

		return dataCopy;
	};

	_delayCallEndReach = () => {
		// const sortedData = this.state._sortedData;
		// const sortedLength = sortedData.reduce((acc, cv) => cv.length + acc, 0);
		// // Limit the invokes to only when the masonry has
		// // fully loaded all of the content to ensure user fully reaches the end
		// if (sortedLength === this.state._uniqueCount) {
			if (this.props.masonryFlatListColProps && this.props.masonryFlatListColProps.onEndReached) {
				this.props.masonryFlatListColProps.onEndReached();
			}
		// }
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
					removeClippedSubviews={true}
					onEndReachedThreshold={this.props.onEndReachedThreshold}
					{...this.props.masonryFlatListColProps}
					onEndReached={this._delayCallEndReach}
					initialNumToRender={this.props.initialColToRender}
					keyExtractor={(item, index) => index.toString()}
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
								displayImageViewer={this.props.displayImageViewer}
								displayedImageId={this.props.displayedImageId}
								findImageIndex={this.props.findImageIndex}

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

// assignObjectColumn :: Number -> [Objects] -> [Objects]
export const assignObjectColumn = (nColumns, index, targetObject) => ({...targetObject, ...{ column: index % nColumns }});

// Assigns an `index` property` from bricks={data}` for later sorting.
// assignObjectIndex :: (Number, Object) -> Object
export const assignObjectIndex = (index, targetObject) => ({...targetObject, ...{ index }});

// findMinIndex :: [Numbers] -> Number
export const findMinIndex = (srcArray) => srcArray.reduce((shortest, cValue, cIndex, cArray) => (cValue < cArray[shortest]) ? cIndex : shortest, 0);

// Fills an array with 0's based on number count
// generateColumnsHeight :: Number -> Array [...0]
export const generateColumnHeights = count => Array(count).fill(0);

// Random unique id generator
export const idGenerator = () => Math.random().toString(36).substr(2, 9);
