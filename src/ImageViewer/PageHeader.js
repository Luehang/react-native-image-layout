import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

export default class PageHeader extends React.PureComponent {
    static propTypes = {
        renderPageHeader: PropTypes.func,
        image: PropTypes.object.isRequired,
        galleryIndex: PropTypes.number.isRequired,
        onClose: PropTypes.func.isRequired
    }

    render() {
        const { renderPageHeader, image, galleryIndex, onClose } = this.props;
        const header = renderPageHeader &&
            renderPageHeader(image, galleryIndex, onClose);
        return (
            <View style={{ top: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
                { header }
            </View>
        );
    }
}
