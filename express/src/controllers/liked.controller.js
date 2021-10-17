const { Op } = require("sequelize");
const db = require("../database");
/**
 * This function handles the event of a user liking a post,
 * first it will check the database to see if the relationship
 * already exists, id it doesn't it will create it, if it does
 * it will check to see if the user has disliked the post, if so,
 * it will adjust the counts of likes and dislikes on the post and
 * the relationship in the database, if the user has already liked
 * the post, the function will update the counts on the post and
 * delete the relationship, basically unliking the post.
 * @param user_name
 * @param post_id
 * @returns result of the operation
 */
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
    like.liked = 1;
    like.disliked = 0;

    await like.save();

    const post = await db.posts.findByPk(req.body.post_id);

    post.likes = post.likes + 1;
    post.dislikes = post.dislikes - 1;

    await post.save();

    res.json(like);
  } else if (like.liked === 1) {
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
/**
 * This function does the same as the likePost function
 * but for the dislike post operation
 * @param user_name
 * @param post_id
 * @returns result of the operation
 */
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
/**
 * This function takes the user_name and returns
 * an array of all post the user has liked
 * @param user_name
 * @returns Array of liked posts
 */
exports.likedPosts = async (req, res) => {
  const likedPosts = await db.liked_posts.findAll({
    where: { [Op.and]: [{ liked_by: req.body.user_name }, { liked: 1 }] },
  });

  res.json(likedPosts);
};
/**
 * Function takes the user_name and returns
 * an array of all post the user has disliked
 * @param user_name
 * @returns Array of disliked posts
 */
exports.dislikedPosts = async (req, res) => {
  const dislikedPosts = await db.liked_posts.findAll({
    where: { [Op.and]: [{ liked_by: req.body.user_name }, { disliked: 1 }] },
  });

  res.json(dislikedPosts);
};
