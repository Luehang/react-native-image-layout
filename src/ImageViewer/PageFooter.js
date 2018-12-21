import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

export default class PageFooter extends React.PureComponent {
    static propTypes = {
        renderPageFooter: PropTypes.func,
        image: PropTypes.object.isRequired,
        galleryIndex: PropTypes.number.isRequired,
        onClose: PropTypes.func.isRequired
    }

    render() {
        const { renderPageFooter, image, galleryIndex, onClose } = this.props;
        const footer = renderPageFooter &&
            renderPageFooter(image, galleryIndex, onClose);
        return (
            <View style={{ bottom: 0, width: "100%", position: "absolute", zIndex: 1000 }}>
                { footer }
            </View>
        );
    }
}
