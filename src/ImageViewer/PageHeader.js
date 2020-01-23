import React from "react";
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
        return header;
    }
}
