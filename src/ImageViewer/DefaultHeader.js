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
            <View style={{ top: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
                <View style={[styles.statusBarTop, styles.header, styles.pageHeader]}>
                    <TouchableWithoutFeedback onPress={() => onClose()}>
                        <Image source={backIcon} style={{marginLeft: 10, height: 30, width: 30}} />
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    statusBarTop: {
        paddingTop: isIPhoneX() ? 30 : Platform.OS === "ios" ? 20 : 0
    },
    header: {
        height: isIPhoneX() ? 88 : 64,
        backgroundColor: "transparent"
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center"
    }
});
