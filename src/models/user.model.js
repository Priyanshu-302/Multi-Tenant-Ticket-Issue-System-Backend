const { pool } = require("../config/db");

exports.createUser = async (name, email, password, org_id) => {
  try {
    const result = await pool.query(
      `insert into users(name, email, password) values ($1, $2, $3, $4) returning *`,
      [name, email, password],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `select id, name, email from users where email = $1`,
      [email],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (id) => {
  try {
    const result = await pool.query(
      `select id, name, email from users where id = $1`,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};