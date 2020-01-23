const data = [
    // {
    //     source: require("./assets/adult-art-artistic-235462.jpg"),
    //     title: "www.luehangs.site",
    //     description: "Test 0",
    //     dimensions: { width: 1080, height: 1920 }
    // },
    {
        source: { uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg" },
        title: "www.luehangs.site",
        description: "Test 1",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        uri: "https://lh3.googleusercontent.com/r2PxdAYTBUt1myxWTH2Ijt643o3T-wx5WnH41Sxtc6hQfU7XAg1UV3nZ3XFqANiqx92ww3Tu3dF26Rip1SzAl-WWseMQoN2eTjs",
        title: "www.luehangs.site",
        description: "Test 2",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        URI: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg",
        id: "xbg72uclk",
        title: "www.luehangs.site",
        description: "Test 3",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        url: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg",
        title: "www.luehangs.site",
        description: "Test 4",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        URL: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg",
        id: idGenerator(),
        title: "www.luehangs.site",
        description: "Test 5",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg",
        title: "www.luehangs.site",
        description: "Test 6",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-846741.jpeg",
        title: "www.luehangs.site",
        description: "Test 7",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/beautiful-daylight-dress-459947.jpg",
        title: "www.luehangs.site",
        description: "Test 8",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/pexels-photo-247292.jpeg",
        title: "www.luehangs.site",
        description: "Test 9",
        // dimensions: { width: 1920, height: 1080 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/free-freedom-girl-6480.jpg",
        id: idGenerator(),
        title: "www.luehangs.site",
        description: "Test 10",
        // dimensions: { width: 1080, height: 1920 }
    },
    {
        uri: "https://luehangs.site/pic-chat-app-images/hair-girl-female-model.jpg",
        title: "www.luehangs.site",
        description: "Test 11",
        // dimensions: { width: 1080, height: 1920 }
    }
];

function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = data;
