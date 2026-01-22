const { pool } = require("../config/db");

exports.createUser = async (name, email, password, role, org_id) => {
  try {
    const result = await pool.query(
      `insert into users(name, email, password, role, org_id) values ($1, $2, $3, $4, $5) returning *`,
      [name, email, password, role, org_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      `select id, name, email, role, org_id from users where email = $1`,
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
      `select id, name, email, role, org_id from users where id = $1`,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getAllUsersByOrg = async (org_id) => {
  try {
    const result = await pool.query(
      `select id, name, email, role, org_id from users where org_id = $1`,
      [org_id],
    );

    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
