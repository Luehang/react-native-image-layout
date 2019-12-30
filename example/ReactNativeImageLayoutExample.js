import React, { Component } from "react";
import {
    Platform,
    Dimensions,
    Linking,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import ImageLayout from "react-native-image-layout";
// import ImageLayout from "./src"

import testData from "./data";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

const backIcon = require("./assets/arrow_back_ios_white_36dp.png");

export default class ReactNativeImageLayoutExample extends Component {
    state = {
        data: testData
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.setState({
    //             data: this.state.data.concat([
    //                 {
    //                     uri: "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    //                     // id: idGenerator(),
    //                     title: "www.luehangs.site",
    //                     // dimensions: { width: 1080, height: 1920 },
    //                 },
    //                 {
    //                     uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBu7qUznng_t9q5wEkW4obHtb-lbgqXpU0y4Gu77Su30QteHK",
    //                     // id: idGenerator(),
    //                     title: "www.luehangs.site",
    //                     // dimensions: { width: 1080, height: 1920 },
    //                 }
    //             ])
    //         });
    //     }, 6000);
    // }

    render() {
        return (
            <View
                style={styles.container}
            >
                <ImageLayout
                    // rerender={true}
                    renderMainHeader={() => {
                        return (
                            <View>
                                <View style={[styles.statusBarTop, styles.header, styles.mobileHeader]}>
                                    <Image
                                        source={{ uri: "https://luehangs.site/images/lue-hang2018-square.jpg" }}
                                        style={{height: 35, width: 35, marginLeft: 10, borderRadius: 20}} />
                                    <View style={styles.headerBody}>
                                        <Text style={styles.title}>ImageLayout</Text>
                                    </View>
                                </View>
                                <View style={styles.listTab}>
                                    <TouchableWithoutFeedback
                                        style={{borderTopLeftRadius: 7.5,}}
                                        onPress={() => Linking.openURL("https://luehangs.site")}>
                                            <View style={styles.tab}>
                                                <View style={[styles.tabTextUnderline, {paddingBottom: 3}]}>
                                                    <Text style={styles.tabTextOn}>REMOTE/LOCAL</Text>
                                                </View>
                                            </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback
                                        onPress={() => {}}>
                                        <View style={styles.tab}>
                                            <View style={{paddingBottom: 3}}>
                                                <Text style={styles.tabTextOff}>CAMERA ROLL</Text>
                                            </View>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        );
                    }}
                    images={this.state.data}
                    // renderIndividualMasonryHeader={(data, index) => {
                    //     return (
                    //         <TouchableWithoutFeedback
                    //             onPress={() => Linking.openURL("https://luehangs.site")}>
                    //             <View style={[styles.masonryHeader, {width: data.masonryDimensions.width}]}>
                    //                 <Image
                    //                     source={{ uri: "https://luehangs.site/images/lue-hang2018-square.jpg" }}
                    //                     style={styles.userPic} />
                    //                 <Text style={styles.userName}>{data.title}</Text>
                    //             </View>
                    //         </TouchableWithoutFeedback>
                    //     );
                    // }}
                    renderPageHeader={(image, i, onClose) => {
                        return (
                            <View style={[styles.statusBarTop, styles.header, styles.pageHeader]}>
                                <TouchableWithoutFeedback onPress={() => {onClose();}}>
                                    <Image source={backIcon} style={{marginLeft: 10, height: 30, width: 30}} />
                                </TouchableWithoutFeedback>
                                <View style={{}}>
                                    <Text style={[styles.profilePrimary, styles.whiteText]}>{image.title}</Text>
                                    <Text style={[styles.profileSecondary, styles.whiteText]}>{image.description}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        );
    }
}

function isIPhoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return (
        Platform.OS === "ios" &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
        (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#368FFA"
    },
    header: {
        height: isIPhoneX() ? 74 : 64,
        backgroundColor: "transparent"
    },
    headerBody: {
        flex: 1,
        alignItems: "center",
    },
    statusBarTop: {
        paddingTop: isIPhoneX() ? 30 : platform === "ios" ? 20 : 0
    },
    mobileHeader: {
        // width: deviceWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    masonryHeader: {
        position: "absolute",
        zIndex: 10,
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        backgroundColor: "rgba(150,150,150,0.4)"
    },
    pageHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        fontSize: 25
    },
    listTab: {
        height: 32,
        flexDirection: "row",
        borderTopLeftRadius: 7.5,
        borderTopRightRadius: 7.5,
        backgroundColor: "#fff",
        marginBottom: -5
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabTextUnderline: {
        borderBottomWidth: 2,
        borderBottomColor: "#e53935"
    },
    tabTextOn: {
        fontSize: 10,
        color: "#e53935"
    },
    tabTextOff: {
        fontSize: 10,
        color: "grey"
    },
    userPic: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    userName: {
        color: "#616161"
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
