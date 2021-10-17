const db = require("../database");
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");
const { sequelize } = require("../database");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public"),
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("post-image");
/**
 * Function takes upload image and stores
 * it locally on the server, returning the
 * file name.
 */
exports.uploadImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json(err);
    }
    res.send(req.file.filename);
  });
};
/**
 * Function take post parameters
 * then creates an instance of the
 *  post in the database
 * @param post_content
 * @param user_name
 * @param user_id
 * @param image (image filename)
 * @param parent_post_id
 * @returns post
 */
exports.create = async (req, res) => {
  const post = await db.posts.create({
    post_content: req.body.post_content,
    user_name: req.body.user_name,
    user_id: req.body.user_id,
    image: req.body.image,
    parent_post_id: req.body.parent_post_id,
  });
  res.json(post);
};

// Get all posts
/**
 * Function retrieves all primary posts by the
 * Logged in user and all users the logged in
 * user follows
 * @param user_name
 * @returns Array of posts
 */
exports.all = async (req, res) => {
  const posts = await db.posts.findAll({
    where: {
      user_name: {
        [Op.or]: {
          [Op.in]: [
            sequelize.literal(
              `select followed from follows where follower like \"${req.body.user_name}\"`
            ),
          ],
          [Op.eq]: req.body.user_name,
        },
      },
      parent_post_id: null,
    },
  });

  res.json(posts);
};
/**
 * Function returns all posts that have
 * a parent_post_id
 * @returns Array of reply posts
 */
exports.allReplies = async (req, res) => {
  const replies = await db.posts.findAll({
    where: { parent_post_id: { [Op.not]: null } },
  });

  res.json(replies);
};
/**
 * Function takes post_id as a parameter
 * and returns the corresponding post
 * @param post_id
 * @returns post
 */
exports.getPostById = async (req, res) => {
  const post = await db.posts.findByPk(req.params.id);

  res.json(post);
};
/**
 * Function take post_id and comments as
 * parameters, then retrieves the post from
 * the database, updates the comments value,
 * then saves it to the database
 * @param post_id
 * @param comments
 * @returns updated post
 */
exports.updatePost = async (req, res) => {
  const post = await db.posts.findByPk(req.body.post_id);

  post.post_content = req.body.post_content;

  await post.save();

  res.json(post);
};
/**
 * Function takes post_id as parameter,
 * then deletes it from the database
 * @param post_id
 * @returns status(200)
 */
exports.deletePost = async (req, res) => {
  await db.posts.destroy({ where: { post_id: req.body.post_id } });

  res.sendStatus(200);
};
