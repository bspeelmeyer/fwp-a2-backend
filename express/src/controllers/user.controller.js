const db = require("../database");
const argon2 = require("argon2");
const { Op } = require("sequelize");

/**
 * Function retrieves all users from the
 * database, and returns them in an array
 * @returns Array of all users
 */
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

// Select one user from the database
/**
 * Function takes the user_name as a
 * parameter, the retrieves the user from
 * the database
 * @param user_name
 * @returns user
 */
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.username);
  res.json(user);
};
/**
 * Function takes user_name and password,
 * then the password hashed and then compared
 * against the stored hash, if the hashes and
 * user_name match, the user is returned, if not
 * null is returned
 * @param user_name
 * @param password
 * @returns user or null
 */
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.username);

  if (
    user === null ||
    (await argon2.verify(user.password_hash, req.query.password)) === false
  )
    // Login failed
    res.json(null);
  else res.json(user);
};
/**
 * Function takes user_name, first_name, last_name, email
 * and password as parameters. The password is hashed and
 * then stored in the database along with the other parameters
 * @param user_name
 * @param first_name
 * @param last_name
 * @param email
 * @param password
 * @returns user
 */
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  const user = await db.user.create({
    user_name: req.body.username,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    password_hash: hash,
  });

  res.json(user);
};

/**
 * Function takes the same parameters as the create function
 * and updates existing user in the database
 *
 */
exports.updateUser = async (req, res) => {
  const user = await db.user.findByPk(req.body.username);

  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  user.user_name = req.body.username;
  user.first_name = req.body.firstname;
  user.last_name = req.body.lastname;
  user.email = req.body.email;
  user.password_hash = hash;

  await user.save();

  res.json(user);
};
/**
 * Function takes user_name as a parameter, then
 * removes all relations in the database where the
 * user_name is found
 * @param user_name
 * @returns status(200)
 */
exports.deleteUser = async (req, res) => {
  await db.posts.destroy({ where: { user_name: req.body.user_name } });
  await db.liked_posts.destroy({ where: { liked_by: req.body.user_name } });
  await db.follows.destroy({ where: { follower: req.body.user_name } });
  await db.follows.destroy({ where: { followed: req.body.user_name } });
  await db.user.destroy({ where: { user_name: req.body.user_name } });

  res.sendStatus(200);
};
/**
 * Function returns all users that are
 * not the given user_name
 * @param user_name
 * @returns Array of users
 */
exports.getUsers = async (req, res) => {
  const users = await db.user.findAll({
    where: { user_name: { [Op.notLike]: req.body.user_name } },
  });

  res.json(users);
};
