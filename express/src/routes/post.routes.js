module.exports = (express, app) => {
    const controller = require("../controllers/post.controller.js");
    const router = express.Router();
   
    // Create post
    router.post("/", controller.create);

    router.post("/upload-image", controller.uploadImage);

    // Get all posts
    router.get("/", controller.all);

     // Add route to server
     app.use("/api/posts", router);
}