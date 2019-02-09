import "react-native";
import React from "react";
import {
    data
} from "./mocks/dataMock";
import ImageLayout from "./../src/";

// Note: test renderer must be required after react-native.
import renderer from "react-test-renderer";

test("Image Layout renders correctly", () => {
    const imageLayout = renderer.create(<ImageLayout images={data} />).toJSON();

    const scrollView = imageLayout.children[0];

    expect(scrollView.type).toBe("RCTScrollView");
    expect(imageLayout.props.images.length).toBeGreaterThan(0);
});
