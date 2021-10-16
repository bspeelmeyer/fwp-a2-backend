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

exports.uploadImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.json(err);
    }
    res.send(req.file.filename);
  });
};
// Create post in database
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

exports.allReplies = async (req, res) => {
  const replies = await db.posts.findAll({
    where: { parent_post_id: { [Op.not]: null } },
  });

  res.json(replies);
};

exports.getPostById = async (req, res) => {
  const post = await db.posts.findByPk(req.params.id);

  res.json(post);
};

exports.updatePost = async (req, res) => {
  const post = await db.posts.findByPk(req.body.post_id);
  console.log(req.body.id);
  console.log(req.body.post_content);
  post.post_content = req.body.post_content;

  await post.save();

  res.json(post);
};

exports.deletePost = async (req, res) => {
  await db.posts.destroy({ where: { post_id: req.body.post_id } });

  res.sendStatus(200);
};
