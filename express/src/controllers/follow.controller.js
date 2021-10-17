const { Op } = require("sequelize");
const db = require("../database");

/**
 * Function takes user_name and returns
 * all instances where user follows another
 * @param user_name
 * @returns array of followed users
 */
exports.getFollows = async (req, res) => {
  const follows = await db.follows.findAll({
    where: { follower: req.body.user_name },
  });

  res.json(follows);
};
/**
 * Function creates an instance in the database
 * of the follow relationship where Follower is
 * the logged in user and the followed is the
 * user they follow
 * @param follower: user_name
 * @param followed: user_name
 * @returns the created instance
 */
exports.createFollow = async (req, res) => {
  const follow = await db.follows.create({
    follower: req.body.follower,
    followed: req.body.followed,
  });

  res.json(follow);
};
/**
 * Function deletes instance of
 * the follow relationship, it takes
 * the user_name of the follower and followed,
 * then removes the instance from the database
 * @param follower: user_name
 * @param followed: user_name
 * @returns status(200)
 */
exports.deleteFollow = async (req, res) => {
  await db.follows.destroy({
    where: {
      [Op.and]: [
        { follower: req.body.follower },
        { followed: req.body.followed },
      ],
    },
  });

  res.sendStatus(200);
};
