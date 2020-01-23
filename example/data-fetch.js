const data = [
    {
        uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-853168.jpeg",
        title: "www.luehangs.site",
        description: "Test 12",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-904276.jpeg",
        title: "www.luehangs.site",
        description: "Test 13",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-1059116.jpeg",
        id: idGenerator(),
        title: "www.luehangs.site",
        description: "Test 14",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/photo-206330.jpeg",
        title: "www.luehangs.site",
        description: "Test 15",
        // dimensions: { width: 1080, height: 1920 }
    },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/photo-206381.jpeg",
    //     title: "www.luehangs.site",
    //     description: "Test 16",
    //     // dimensions: { width: 1080, height: 1920 }
    // },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/adult-arm-art-326559.jpg",
    //     title: "www.luehangs.site",
    //     description: "Test 17",
    //     // dimensions: { width: 1920, height: 1080 }
    // },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/photo-755745.jpeg",
    //     title: "www.luehangs.site",
    //     description: "Test 18",
    //     // dimensions: { width: 1080, height: 1920 }
    // },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-1104114.jpeg",
    //     id: idGenerator(),
    //     title: "www.luehangs.site",
    //     description: "Test 19",
    //     // dimensions: { width: 1920, height: 1080 }
    // },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/photo-274595.jpeg",
    //     title: "www.luehangs.site",
    //     description: "Test 20",
    //     // dimensions: { width: 1080, height: 1920 }
    // },
    // {
    //     uri: "https://luehangs.site/pic-chat-app-images/photo-799443.jpeg",
    //     title: "www.luehangs.site",
    //     description: "Test 21",
    //     // dimensions: { width: 1080, height: 1920 }
    // },
];

function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = data;
