import React from "react";
import { Animated } from "react-native";
import PropTypes from "prop-types";

const ScrollSpacerView = (props: Props) => (
  // Add space above and below the image for
  // being able to paginate through the ScrollView component
  <Animated.View
    style={{
      width: props.width.__getValue(),
      height: props.height.__getValue(),
      ...props.style
    }}
  />
);

ScrollSpacerView.propTypes = {
  width: PropTypes.object.isRequired,
  height: PropTypes.object.isRequired
};

export default ScrollSpacerView;
