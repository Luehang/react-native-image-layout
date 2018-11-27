# react-native-image-layout

> An easy and simple to use React Native component to render a custom masonry layout for remote images and displayed on a custom interactive image viewer.  Includes animations and support for both iOS and Android.

<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH BLOG"/></a>

![react-native-image-layout](https://www.luehangs.site/videos/react-native-image-layout-demo.gif)

Learn more about React Native with project examples along with Cyber Security and Ethical Hacking at [LH BLOG](https://www.luehangs.site).

Built with [`react-native-gallery-swiper`](https://npmjs.com/package/react-native-gallery-swiper).

## Index

- [Install](#install)
- [Usage Example](#usage-example)
- [API](#api)
- [Props](#props)
- [Scroll State and Events](#scroll-state-and-events)
- [Example Project](#example-project)
- [Contribute](#contribute)
- [License](#license)

## Install

Type in the following to the command line to install the dependency.

```bash
$ npm install --save react-native-image-layout
```

or

```bash
$ yarn add react-native-image-layout
```

## Usage Example

Add an ``import`` to the top of the file.  At minimal, declare the ``ImageLayout`` component in the ``render()`` method providing an array of data for the ``images`` prop.

```javascript
import ImageLayout from "react-native-image-layout";

//...
render() {
    return (
        <ImageLayout
            images={[
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg"
                },
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg"
                },
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg"
                },
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg"
                },
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg"
                },
                {
                    id: idGenerator(),
                    uri: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg"
                },
            ]}
        />
    );
}
//...

function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
}
```

<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH BLOG"/></a>

## API

``<ImageLayout />`` component accepts the following props...

### Props

| Props                         | Type              | Description                                                                                                                                                                                    | Default |
|-------------------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `images`                      | `Array`           | An array of objects.  `uri` and `id` is a required field. EX. `[{id: "50aspo9jq", uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg"}, {id: "b77cs7rjn", uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg"}]` | Required |
| `columns`                     | `number`          | Desired number of columns. | 2 |
| `masonryListViewProps`        | `Object`          | Props to be passed to the underlying `ListView` masonry.  See [`ListView` props...](https://facebook.github.io/react-native/docs/listview) | {} |
| `spacing`                     | `number`          | Gutter size of the column. The spacing is a multiplier of 1% of the available view. | 1 |
| `sorted`                      | `Boolean`         | Whether to sort the masonry data according to their index position or allow to fill in as soon as the `uri` is ready. | false |
| `imageContainerStyle`         | `Object`          | The styles object which is added to the Image component. | {} |
| `renderIndividualMasonryHeader` | `Function`        | Custom function that is executed **ABOVE** each individual masonry image.  First param is the individual data and second param is the index.  This function must return a React Component. | |
| `renderIndividualMasonryFooter` | `Function`        | Custom function that is executed **BELOW** each individual masonry image.  First param is the individual data and second param is the index.  This function must return a React Component. | |
| `refreshControl`              | `React.Component` | A component to be used as a refresh element for the Masonry component. | |
| `imagePageComponent`          | `Function`        | Custom function to render the images for gallery.  First param is the image props and second param is the dimensions. | `<Image/>` component |
| `errorPageComponent`          | `Function`        | Custom function to render the page of an image in gallery that couldn't be displayed. | `<View/>` with stylized error |
| `renderPageHeader`            | `Function`        | Custom function to render gallery page header and must return a React Component.  First param is the individual data and second param is the index.  Third param is the onClose function to close gallery pages and return to the masonry layout. | |
| `renderPageFooter`            | `Function`        | Custom function to render gallery page footer and must return a React Component.  First param is the individual data and second param is the index.  Third param is the onClose function to close gallery pages and return to the masonry layout. | |
| `pagesFlatListProps`          | `Object`          | Props to be passed to the underlying `FlatList` gallery.  See [`FlatList` props...](https://facebook.github.io/react-native/docs/flatlist) | {windowSize: 3} |
| `pageMargin`                  | `number`          | Blank space to show between images in gallery. | 0 |
| `onPageSelected`              | `Function`        | Fired with the index of page that has been selected in gallery. | |
| `onPageScrollStateChanged`    | `Function`        | Called when page scrolling state has changed in gallery.  See [scroll state and events...](#scroll-state-and-events) | |
| `onPageScroll`                | `Function`        | Scroll event for page gallery.  See [scroll state and events...](#scroll-state-and-events) | |
| `pageScrollViewStyle`         | `Object`          | Custom style for the `FlatList` component for gallery. | {} |
| `onPageSingleTapConfirmed`    | `Function`        | Fired after a single tap on page in gallery. | |
| `onPageLongPress`             | `Function`        | Fired after a long press on page in gallery. | |

## Scroll State and Events for Gallery

Built with [`react-native-gallery-swiper`](https://npmjs.com/package/react-native-gallery-swiper).

* `onPageScroll` : (event) => {}. 

  The event object carries the following data: 

  * `position`:  index of first page from the left that is currently visible.
  * `offset`: value from range [0,1) describing stage between page transitions.
  * `fraction`: means that (1 - x) fraction of the page at "position" index is visible, and x fraction of the next page is visible.

* `onPageScrollStateChanged` : (state) => {}.

  Called when the page scrolling state has changed. The page scrolling state can be in 3 states:

  * `'idle'`: there is no interaction with the page scroller happening at the time.
  * `'dragging'`: there is currently an interaction with the page scroller.
  * `'settling'`: there was an interaction with the page scroller, and the page scroller is now finishing its closing or opening animation.

## Example Project

Perform steps 1-2 to run locally:

1. [Clone the Repo](#1-clone-the-repo)
2. [Install and Run](#2-install-and-run)

### 1. Clone the Repo

**Clone** `react-native-image-layout` locally. In a terminal, run:

```bash
$ git clone https://github.com/Luehang/react-native-image-layout.git react-native-image-layout
```

### 2. Install and Run

```bash
$ cd react-native-image-layout/example/
```

#### iOS - Mac - Install & Run

	1. check out the code
	2. npm install
	3. npm run ios

#### Android - Mac - Install & Run

	1. check out the code
	2. npm install
	3. emulator running in separate terminal
	4. npm run android

<a href="https://luehangs.site"><img src="https://luehangs.site/images/lh-blog-strip.jpg" alt="LH BLOG"/></a>

## Contribute

[Pull requests](https://github.com/Luehang/react-native-image-layout/pulls) are welcomed.

### Beginners

Not sure where to start, or a beginner? Take a look at the [issues page](https://github.com/Luehang/react-native-image-layout/issues).

### Contributors

Contributors will be posted here.

## License

MIT © [Lue Hang](https://luehangs.site), as found in the LICENSE file.
