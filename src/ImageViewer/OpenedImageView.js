/* @flow */

import React from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";
import PropTypes from "prop-types";

class OpenedImageView extends React.PureComponent {
  state: State
  _imageRef: Animated.Image

  static propTypes = {
    uri: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired,
    realImageWidth: PropTypes.number.isRequired,
    realImageHeight: PropTypes.number.isRequired,
    transitionProgress: PropTypes.oneOfType([
      PropTypes.instanceOf(Animated.Value),
      PropTypes.instanceOf(Animated.Interpolation)
    ]).isRequired,
    onPressImage: PropTypes.func.isRequired
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      containerWidth: props.width,
      containerHeight: props.height
    };
  }

  _onPressImage = () => {
    this.props.onPressImage();
  }

  render() {
    const { uri, imageWidth, imageHeight, transitionProgress } = this.props;
    const { containerWidth, containerHeight } = this.state;
    return (
      <Animated.View
        style={{
          width: containerWidth,
          height: containerHeight,
          flexDirection: "row",
          alignItems: "center",
          opacity: transitionProgress.interpolate({
            inputRange: [0.998, 0.999],
            outputRange: [0, 1]
          })
        }}
      >
        <TouchableWithoutFeedback onPress={this._onPressImage}>
          <Animated.Image
            ref={(ref: Animated.Image) => {
              this._imageRef = ref;
            }}
            source={{ uri }}
            resizeMode="contain"
            style={{
              width: imageWidth,
              height: imageHeight,
              opacity: transitionProgress.interpolate({
                inputRange: [0.998, 0.999],
                outputRange: [0, 1]
              })
            }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

export default OpenedImageView;
