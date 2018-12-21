import React from "react";
import { Animated, StyleSheet } from "react-native";
import PropTypes from "prop-types";

export default class ViewerBackground extends React.PureComponent {
  static propTypes = {
    opacityProgress: PropTypes.instanceOf(Animated.Value).isRequired,
    inputRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    outputRange: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  render() {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.background,
          {
            opacity: this.props.opacityProgress.interpolate({
              inputRange: this.props.inputRange,
              outputRange: this.props.outputRange
            })
          }
        ]}
      />
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "black"
  }
});
