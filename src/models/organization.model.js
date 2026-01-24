const { pool } = require("../config/db");

exports.createOrganization = async (name) => {
  try {
    const result = await pool.query(
      `insert into organization(name) values($1) returning *`,
      [name],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.findOrganizationById = async (id) => {
  try {
    const result = await pool.query(
      `select * from organization where id = $1`,
      [id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.listAllOrganizations = async () => {
  try {
    const result = await pool.query("select * from organization");

    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
