import React from "react";
import {
    Platform,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback
} from "react-native";
import { isIPhoneX } from "../utils";
import PropTypes from "prop-types";

const backIcon = require("../../assets/arrow_back_ios_white_36dp.png");

export default class DefaultHeader extends React.PureComponent {
    static propTypes = {
        onClose: PropTypes.func.isRequired
    }

    render() {
        const { onClose } = this.props;
        return (
            <View style={styles.header}>
                <TouchableWithoutFeedback onPress={() => onClose()}>
                    <Image source={backIcon} style={styles.backIcon} />
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        top: 0,
        width: "100%",
        position: "absolute",
        zIndex: 1000,
        paddingTop: isIPhoneX() ? 30 : Platform.OS === "ios" ? 20 : 0,
        height: isIPhoneX() ? 88 : 64,
        backgroundColor: "transparent",
        flexDirection: "row",
        alignItems: "center"
    },
    backIcon: {
        marginLeft: 10,
        height: 30,
        width: 30
    }
});
