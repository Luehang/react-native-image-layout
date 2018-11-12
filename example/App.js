// @flow
import React, { Component } from "react";
import {
    Platform,
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import ImageLayout from "react-native-image-layout";

import testData from "./data";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

const backIcon = require("./assets/arrow_back_ios_white_36dp.png");

const X_WIDTH = 375;
const X_HEIGHT = 812;
function isIPhoneX() {
    return (
        Platform.OS === "ios" &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
        (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

class ImageGallery extends Component {
    render() {
        return (
            <View
                style={styles.container}
            >
                <View style={[styles.statusBarTop, styles.header, styles.mobileHeader]}>
                    <Text style={styles.title}>Pictures</Text>
                </View>
                <ImageLayout
                    images={testData}
                    renderIndividualMasonryHeader={(data, index) => {
                        return (
                            <View style={styles.masonryHeader}>
                                <Image
                                    source={{ uri: "https://luehangs.site/images/lue-hang2018-square.jpg" }}
                                    style={styles.userPic} />
                                <Text style={styles.userName}>{data.title}</Text>
                            </View>
                        );
                    }}
                    renderPageHeader={(image, i, onClose) => {
                        return (
                            <View style={[styles.statusBarTop, styles.pageHeader]}>
                                <TouchableWithoutFeedback onPress={() => {onClose();}}>
                                    <Image source={backIcon} style={{marginLeft: 10, height: 30, width: 30}} />
                                </TouchableWithoutFeedback>
                                <View style={{}}>
                                    <Text style={[styles.profilePrimary, styles.whiteText]}>{image.title}</Text>
                                    <Text style={[styles.profileSecondary, styles.whiteText]}>test</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#368FFA"
    },
    statusBarTop: {
        paddingTop: isIPhoneX() ? 30 : platform === "ios" ? 20 : 0
    },
    header: {
        height: isIPhoneX() ? 88 : 64,
        backgroundColor: "transparent"
    },
    mobileHeader: {
        width: deviceWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    masonryHeader: {
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        backgroundColor: "white"
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 25
    },
    userPic: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    whiteText: {
        fontWeight: "bold",
        color: "#fafafa"
    },
    profilePrimary: {
        fontSize: 14,
        paddingHorizontal: 5
    },
    profileSecondary: {
        fontSize: 12,
        paddingHorizontal: 5
    },
});

export default ImageGallery;
