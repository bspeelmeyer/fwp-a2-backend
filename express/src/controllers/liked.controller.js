const e = require("express");
const { Op } = require("sequelize");
const db = require("../database");

exports.likePost = async (req, res) => {
  const like = await db.liked_posts.findOne({
    where: {
      liked_by: req.body.user_name,
      post: req.body.post_id,
    },
  });

  if (like === null) {
    const createLike = await db.liked_posts.create({
      liked_by: req.body.user_name,
      liked: 1,
      disliked: 0,
      post: req.body.post_id,
    });

    const post = await db.posts.findByPk(req.body.post_id);

    post.likes = post.likes + 1;

    await post.save();

    res.json(createLike);
  } else if (like.disliked === 1) {
    console.log("this is inside the sec if!!!!!!!!!!!!!!!!!!");

    like.liked = 1;
    like.disliked = 0;

    await like.save();

    const post = await db.posts.findByPk(req.body.post_id);

    post.likes = post.likes + 1;
    post.dislikes = post.dislikes - 1;

    await post.save();

    res.json(like);
  } else if (like.liked === 1) {
    console.log("this is inside the last if!!!!!!!!!!!!!!!!!!");

    await db.liked_posts.destroy({
      where: {
        [Op.and]: [
          { liked_by: req.body.user_name },
          { post: req.body.post_id },
        ],
      },
    });

    const post = await db.posts.findByPk(req.body.post_id);

    post.likes = post.likes - 1;

    post.save();
  }
};

exports.dislikePost = async (req, res) => {
  const dislike = await db.liked_posts.findOne({
    where: {
      liked_by: req.body.user_name,
      post: req.body.post_id,
    },
  });

  if (dislike === null) {
    const createDislike = await db.liked_posts.create({
      liked_by: req.body.user_name,
      liked: 0,
      disliked: 1,
      post: req.body.post_id,
    });

    const post = await db.posts.findByPk(req.body.post_id);

    post.dislikes = post.dislikes + 1;

    await post.save();

    res.json(createDislike);
  } else if (dislike.liked === 1) {
    dislike.liked = 0;
    dislike.disliked = 1;

    await dislike.save();

    const post = await db.posts.findByPk(req.body.post_id);

    post.likes = post.likes - 1;
    post.dislikes = post.dislikes + 1;

    await post.save();

    res.json(dislike);
  } else if (dislike.disliked === 1) {
    await db.liked_posts.destroy({
      where: {
        [Op.and]: [
          { liked_by: req.body.user_name },
          { post: req.body.post_id },
        ],
      },
    });

    const post = await db.posts.findByPk(req.body.post_id);

    post.dislikes = post.dislikes - 1;

    post.save();
  }
};

exports.likedPosts = async (req, res) => {
  const likedPosts = await db.liked_posts.findAll({
    where: { [Op.and]: [{ liked_by: req.body.user_name }, { liked: 1 }] },
  });

  res.json(likedPosts);
};

exports.dislikedPosts = async (req, res) => {
  const dislikedPosts = await db.liked_posts.findAll({
    where: { [Op.and]: [{ liked_by: req.body.user_name }, { disliked: 1 }] },
  });

  res.json(dislikedPosts);
};
