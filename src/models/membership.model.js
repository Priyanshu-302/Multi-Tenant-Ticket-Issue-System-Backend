const { pool } = require("../config/db");

// These methods can only be accessed by role = 'ADMIN'

exports.addMember = async (user_id, org_id) => {
  try {
    const result = await pool.query(
      `insert into membership(user_id, org_id) values($1, $2) returning *`,
      [user_id, org_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getUserRole = async (user_id) => {
  try {
    const result = await pool.query(
      `select role from membership where user_id = $1`,
      [user_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.updateUserRole = async (role, user_id) => {
  try {
    const result = await pool.query(
      `update membership set role = $1 where user_id = $2`,
      [role, user_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getUserOrgs = async (user_id) => {
  try {
    const result = await pool.query(
      `select org_id from membership where user_id = $1`,
      [user_id],
    );

    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
