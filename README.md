<a href="https://luehangs.site/lue_hang/projects/react-native-image-layout"><img src="https://luehangs.site/images/react-native-image-layout-main.jpg" alt="react-native-image-layout"/></a>

<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

> An easy and simple to use React Native component to render a custom masonry layout for remote/local images and displayed on a custom interactive image viewer. Includes animations and support for both iOS and Android. Free and made possible along with costly maintenance and updates by [Lue Hang](https://www.facebook.com/lue.hang) (the author).

> Check out the [docs](https://luehangs.site/lue_hang/projects/react-native-image-layout) for a complete documentation.

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

![react-native-image-layout](https://www.luehangs.site/videos/react-native-image-layout-demo.gif)

#### :information_source: Learn more about React Native with project examples along with Cyber Security and Ethical Hacking at [LH LABS](https://www.luehangs.site).

Built with [`react-native-gallery-swiper`](https://npmjs.com/package/react-native-gallery-swiper).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

# Index

### 1.  [Install](#large_blue_diamond-install)
### 2.  [iOS Usage Example](#large_blue_diamond-ios-usage-example)
### 3.  [ANDROID Usage Example](#large_blue_diamond-android-usage-example)
### 4.  [API](#large_blue_diamond-api)
### 5.  :books: [Props](#large_blue_diamond-props)
### 6.  [Scroll State and Events for Gallery](#large_blue_diamond-scroll-state-and-events-for-gallery)
### 7.  [Example Project](#large_blue_diamond-example-project)
### 8.  [Author](#large_blue_diamond-author)
### 9.  [Contribute](#large_blue_diamond-contribute)
### 10.  [License](#large_blue_diamond-license)

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :large_blue_diamond: Install

Type in the following to the command line to install the dependency.

```bash
$ npm install --save react-native-image-layout
```

or

```bash
$ yarn add react-native-image-layout
```

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :large_blue_diamond: iOS Usage Example

Add an ``import`` to the top of the file.  At minimal, declare the ``ImageLayout`` component in the ``render()`` method providing an array of data for the ``images`` prop.

> If you like [`react-native-image-layout`](https://github.com/Luehang/react-native-image-layout), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-image-layout). Thanks.

```javascript
import ImageLayout from "react-native-image-layout";

//...
render() {
    return (
        <ImageLayout
            images={[
                // Version *3.0.0 update (or greater versions): 
                // Can be used with different image object fieldnames.
                // Ex. source, source.uri, uri, URI, url, URL
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },
                { source: require("yourApp/image.png"),
                    // IMPORTANT: It is REQUIRED for LOCAL IMAGES
                    // to include a dimensions field with the
                    // actual width and height of the image or
                    // it will throw an error.
                    dimensions: { width: 1080, height: 1920 } },
                { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                    // Optional: Adding a dimensions field with
                    // the actual width and height for REMOTE IMAGES
                    // will help improve performance.
                    dimensions: { width: 1080, height: 1920 } },
                { URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg",
                    // Version *2.0.0 update (or greater versions):
                    // Optional: Does not require an id for each
                    // image object, but is for best practices and
                    // can be better for performance with the API.
                    id: "blpccx4cn" },
                { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
            ]}
        />
    );
}
//...
```

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## :large_blue_diamond: ANDROID Usage Example

:information_source: **REACT NATIVE IMAGE AND ANDROID BUG**

<br/>

**Provide a way to cache the images so there won't be any blank or missing images in the gallery.  A custom image component can be render for the imagePageComponent prop.  An example is given below which will work perfectly.**  This is not required but should be, because it will show a blank screen in the Gallery Swiper for missing images on Android.  This is normal behavior for the **Android** platform.

<br/>

### :small_blue_diamond: Install an Caching Module

On the command line, type in the following and install the caching module.

```bash
$ npm install --save react-native-fast-image
```

Automatic link for native installation.

```bash
$ react-native link react-native-fast-image
```

:information_source: **If there are problems with the installation and start up of `react-native-fast-image`, follow the manual installation [here](https://github.com/DylanVann/react-native-fast-image/blob/master/docs/installation-manual.md).**

<br/>

### :small_blue_diamond: Import and Declare Components

```javascript
import ImageLayout from "react-native-image-layout";
import FastImage from "react-native-fast-image";

//...
render() {
    return (
        <ImageLayout
            imagePageComponent={(imageProps, imageDimensions, i) => {
                return (
                    <FastImage
                        {...imageProps}
                    />
                );
            }}
            images={[
                // Version *3.0.0 update (or greater versions): 
                // Can be used with different image object fieldnames.
                // Ex. source, source.uri, uri, URI, url, URL
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },
                { source: require("yourApp/image.png"),
                    // IMPORTANT: It is REQUIRED for LOCAL IMAGES
                    // to include a dimensions field with the
                    // actual width and height of the image or
                    // it will throw an error.
                    dimensions: { width: 1080, height: 1920 } },
                { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } },
                { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                    // Optional: Adding a dimensions field with
                    // the actual width and height for REMOTE IMAGES
                    // will help improve performance.
                    dimensions: { width: 1080, height: 1920 } },
                { URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg",
                    // Version *2.0.0 update (or greater versions):
                    // Optional: Does not require an id for each
                    // image object, but is for best practices and
                    // can be better for performance with the API.
                    id: "blpccx4cn" },
                { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
            ]}
        />
    );
}
//...
```

<br/>

### :small_blue_diamond: Hint: Adding a Close Button for Gallery

To select, callback and manipulate an image...

```javascript
import ImageLayout from "react-native-image-layout";
//...

//...
_renderPageHeader = (image, index, onClose) => {
    // Individual image object data.
    console.log(image);
    return (
        <View>
            {/*
                onClose params (third params) is a function
                that will close the react-native-gallery-swiper.

                Swiping up and down animations for closing the
                gallery is only compatible with iOS at
                the moment.  It will be compatible with
                Android in future releases.
            */}
            <TouchableWithoutFeedback onPress={() => {onClose();}}>
                <Image
                    source={backIcon}
                    style={{marginLeft: 10, height: 30, width: 30}}
                />
            </TouchableWithoutFeedback>
            <Text>{image.filename}</Text>
        </View>
    );
}

render() {
    return (
        <ImageLayout
            renderPageHeader={this._renderPageHeader}
            images={[
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                { uri: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
            ]}
        />
    );
}
//...
```

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## :large_blue_diamond: API

``<ImageLayout />`` component accepts the following props...

<br/>

# :large_blue_diamond: Props

:information_source: **Version *2.0.0 update (or greater versions):**  Props changes that may not be compatible with lower versions.

## :small_blue_diamond: Image Layout Props of ``<ImageLayout />``

> If you like [`react-native-image-layout`](https://github.com/Luehang/react-native-image-layout), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-image-layout). Thanks.

| Props                         | Description                                                                                                                                                                                    | Type              | Default |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|---------|
| `images`                      | An array of objects.  `uri` is a required field. EX. `[{uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg"}, {uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg"}]` | `Array` | Required |
| `columns`                     | Desired number of columns. | `number` | 2 |
| `initialColToRender`          | How many columns to render in the initial batch. | `number` | `columns` |
| `initialNumInColsToRender`    | How many items to render in each column in the initial batch. | `number` | 1 |
| `spacing`                     | Gutter size of the column. The spacing is a multiplier of 1% of the available view. | `number` | 1 |
| `sorted`                      | Whether to sort the masonry data according to their index position or allow to fill in as soon as the `uri` is ready. | `Boolean` | false |
| `onLongPressImage`            | Executed after a long press on an item on the masonry. `({item: Object, index: number}) => void` **Version \*3.0.0 update**. | `Function` | |
| `imageContainerStyle`         | The styles object which is added to the Image component. | `Object` | {} |
| `renderIndividualMasonryHeader` | Custom function that is executed **ABOVE** each individual masonry image. `(item: Object, index: number) => ?React.Element` | `Function` | |
| `renderIndividualMasonryFooter` | Custom function that is executed **BELOW** each individual masonry image. `(item: Object, index: number) => ?React.Element` | `Function` | |
| `renderMainHeader`              | Custom function to render a header above the MasonryList. `() => void` | `Function` | |
| `renderMainFooter`              | Custom function to render a footer below the MasonryList. `() => void` | `Function` | |
| `masonryFlatListColProps`       | Props to be passed to the underlying `FlatList` masonry.  See [`FlatList` props...](https://facebook.github.io/react-native/docs/flatlist#props) | `Object` | {} |

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## :small_blue_diamond: Gallery Props of ``<ImageLayout />``

> If you like [`react-native-image-layout`](https://github.com/Luehang/react-native-image-layout), please be sure to give it a star at [GitHub](https://github.com/Luehang/react-native-image-layout). Thanks.

| Props                         | Description                                                                                                                                                                                    | Type              | Default |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|---------|
| `imagePageComponent`          | Custom function to render the images for gallery.  `(imageProps: { imageLoaded: Boolean, source: object, image: object, style: Array<object>, resizeMode: string, capInsets: object, onLoadStart: Function, onLoad: Function, ...extras }, imageDimensions: {width: number, height: number}, index: number) => React.Element` **index params included in Version \*3.0.0 update** | `Function` | `<Image/>` component |
| `errorPageComponent`          | Custom function to render the page of an image in gallery that couldn't be displayed. | `Function` | `<View/>` with stylized error |
| `renderPageHeader`            | Custom function to render gallery page header.  `(item: Object, index: number, onClose: Function) => ?React.Element` The `onClose` function is use to close gallery pages and return to the masonry layout. | `Function` | |
| `renderPageFooter`            | Custom function to render gallery page footer.  `(item: Object, index: number, onClose: Function) => ?React.Element` The `onClose` function is use to close gallery pages and return to the masonry layout. | `Function` | |
| `pagesFlatListProps`          | Props to be passed to the underlying `FlatList` gallery.  See [`FlatList` props...](https://facebook.github.io/react-native/docs/flatlist) | `Object` | {windowSize: 3} |
| `pageMargin`                  | Blank space to show between images in gallery. | `number` | 0 |
| `sensitivePageScroll`         | Whether to enable an intelligent detection to detect rough and fast swiping gestures in order to "cushion" or slow down a swipe at the end. **Version \*3.0.0 update**. | `Boolean` | `false` |
| `onPageSelected`              | Fired with the index of page that has been selected in gallery. `(index: number) => void` | `Function` | |
| `onPageScrollStateChanged`    | Called when page scrolling state has changed in gallery.  See [scroll state and events...](#scroll-state-and-events) `(state: string) => void` | `Function` | |
| `onPageScroll`                | Scroll event for page gallery.  See [scroll state and events...](#scroll-state-and-events) `(event: { position: number, offset: number, fraction: number }) => void` | `Function` | |
| `pageScrollViewStyle`         | Custom style for the `FlatList` component for gallery. | `Object` | {} |
| `onPageSingleTapConfirmed`    | Fired after a single tap on page in gallery. | `Function` | |
| `onPageLongPress`             | Fired after a long press on page in gallery. | `Function` | |
| `removeClippedSubviewsPager`  | To improve pager scroll performance for large lists. **Version \*3.0.0 update**. | `Boolean` | `true`

<br/>
<br/>
<a href="https://luehangs.site/marketplace/product/RN%20Posting%20Demo%20App%20Kit"><img src="https://luehangs.site/images/lh-mobile-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## :large_blue_diamond: Scroll State and Events for Gallery

Built with [`react-native-gallery-swiper`](https://npmjs.com/package/react-native-gallery-swiper).

* `onPageScroll(event: { position: number, offset: number, fraction: number }) => void`

  The event object carries the following data: 

  * `position: number`:  index of first page from the left that is currently visible.
  * `offset: number`: value from range [0,1) describing stage between page transitions.
  * `fraction: number`: means that (1 - x) fraction of the page at "position" index is visible, and x fraction of the next page is visible.

* `onPageScrollStateChanged(state: string) => void`

  Called when the page scrolling state has changed. The page scrolling state can be in 3 states:

  * `'idle': string`: there is no interaction with the page scroller happening at the time.
  * `'dragging': string`: there is currently an interaction with the page scroller.
  * `'settling': string`: there was an interaction with the page scroller, and the page scroller is now finishing its closing or opening animation.

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :large_blue_diamond: Example Project

Perform steps 1-2 to run locally:

1. [Clone the Repo](#1-clone-the-repo)
2. [Install and Run](#2-install-and-run)

<br/>

### :small_blue_diamond: 1. Clone the Repo

**Clone** `react-native-image-layout` locally. In a terminal, run:

```bash
$ git clone https://github.com/Luehang/react-native-image-layout.git react-native-image-layout
```

<br/>

### :small_blue_diamond: 2. Install and Run

```bash
$ cd react-native-image-layout/example/
```

#### iOS - Mac - Install & Run

	1. check out the code
	2. npm install
    3. react-native link
	4. npm run ios

#### Android - Mac - Install & Run

	1. check out the code
	2. npm install
    3. react-native link
	4. emulator running in separate terminal
	5. npm run android

<br/>
<br/>
<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH LABS"/></a>
<br/>
<br/>

## :large_blue_diamond: Author

<a href="https://www.facebook.com/lue.hang">
<img src="https://www.luehangs.site/images/lue-hang2018-circle-150px.png"/>
</a>

Free and made possible along with costly maintenance and updates by [Lue Hang](https://www.facebook.com/lue.hang) (the author).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :large_blue_diamond: Contribute

[Pull requests](https://github.com/Luehang/react-native-image-layout/pulls) are welcomed.

<br/>

### :large_blue_diamond: Contributors

Contributors will be posted here.

<br/>

### :small_blue_diamond: Beginners

Not sure where to start, or a beginner? Take a look at the [issues page](https://github.com/Luehang/react-native-image-layout/issues).

<br/>
<br/>
<br/>

---
<br/>
<br/>
<br/>

## :large_blue_diamond: License

MIT © [Lue Hang](https://luehangs.site), as found in the LICENSE file.
