module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();

    // Select all users
    router.get("/", controller.all);

    // Select a single user with username
    router.get("/select/:username", controller.one);

    // Select one user from database if username and password are a match
    router.get("/login", controller.login);

    // Create a new user
    router.post("/", controller.create);

    // Update user
    router.put("/update", controller.updateUser);

    // Delete user
    router.post("/delete", controller.deleteUser);

    router.post("/allusers", controller.getUsers);

    // Add router to server
    app.use("/api/users", router);
};
