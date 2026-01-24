const { pool } = require("../config/db");

exports.createTicket = async (title, description, org_id, user_id) => {
  try {
    const result = await pool.query(
      `insert into tickets(title, description, org_id, user_id) values($1, $2, $3, $4) returning *`,
      [title, description, org_id, user_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getTicketByOrg = async (org_id) => {
  try {
    const result = await pool.query(`select * from tickets where org_id = $1`, [
      org_id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getTicketById = async (id) => {
  try {
    const result = await pool.query(`select * from tickets where id = $1`, [
      id,
    ]);

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.assignTicket = async (user_id, ticket_id) => {
  try {
    const result = await pool.query(
      `update tickets set user_id = $1 where id = $2 returning *`,
      [user_id, ticket_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.updateTicketStatus = async (status, ticket_id) => {
  try {
    const result = await pool.query(
      `update tickets set status = $1 where id = $2 returning *`,
      [status, ticket_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.updateTicket = async (title, description, ticket_id) => {
  try {
    const result = await pool.query(
      `update tickets set title = $1, description = $2 where id = $3 returning *`,
      [title, description, ticket_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.deleteTicket = async (ticket_id) => {
  try {
    const result = await pool.query(
      `delete from tickets where id = $1 returning *`,
      [ticket_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};
