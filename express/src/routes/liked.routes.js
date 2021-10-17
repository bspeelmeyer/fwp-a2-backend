module.exports = (express, app) => {
    const controller = require("../controllers/liked.controller.js");
    const router = express.Router();

    router.post("/liked", controller.likePost);

    router.post("/dislike", controller.dislikePost);

    router.post("/likedposts", controller.likedPosts);

    router.post("/dislikedposts", controller.dislikedPosts);

    app.use("/api/likes", router);
};