module.exports = (express, app) => {
  const controller = require("../controllers/follow.controller.js");
  const router = express.Router();

  router.post("/getfollow", controller.getFollows);

  router.post("/", controller.createFollow);

  router.post("/delete", controller.deleteFollow);

  app.use("/api/follows", router);
};
