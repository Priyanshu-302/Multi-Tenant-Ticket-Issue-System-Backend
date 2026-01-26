const { pool } = require("../config/db");

exports.createTicket = async (title, description, org_id, status, priority) => {
  try {
    const result = await pool.query(
      `insert into tickets(title, description, org_id, status, priority) values($1, $2, $3, $4, $5) returning *`,
      [title, description, org_id, status, priority],
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

    return result.rows;
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

exports.assignTicket = async (id, created_by, assigned_to) => {
  try {
    const result = await pool.query(
      `update tickets set created_by = $2, assigned_to = $3 where id = $1 returning *`,
      [id, created_by, assigned_to],
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
  const client = await pool.connect();

  // Transaction
  try {
    await client.query("BEGIN");

    // 1. Delete the history of the key first
    await client.query(
      "DELETE FROM ticket_history WHERE ticket_id = $1",
      [ticket_id]
    );

    // 2. Delete the ticket
    const result = await client.query(
      "DELETE FROM tickets WHERE id = $1 RETURNING *",
      [ticket_id]
    );

    if (result.rowCount === 0) {
      throw new Error("Ticket not found");
    }

    await client.query("COMMIT");
    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

