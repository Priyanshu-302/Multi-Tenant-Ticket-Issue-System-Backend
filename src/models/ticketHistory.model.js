const { pool } = require("../config/db");

exports.addTicketHistory = async (ticket_id, new_status, user_id) => {
  try {
    const result = await pool.query(
      `insert into ticket_history(ticket_id, new_status, changed_by) values($1, $2, $3) returning *`,
      [ticket_id, new_status, user_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

exports.getTicketHistory = async (ticket_id) => {
  try {
    const result = await pool.query(
      `select * from ticket_history where ticket_id = $1`,
      [ticket_id],
    );

    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
