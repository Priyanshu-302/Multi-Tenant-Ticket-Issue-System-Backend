const { pool } = require("../config/db");

const roleHandler = (role) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      const ticketId = req.body.ticket_id;
      console.log(userId, ticketId);

      if (!userId || !ticketId) {
        return res.status(401).json({
          success: false,
          message: "Forbidden",
        });
      }

      const ticketResult = await pool.query(
        `select org_id from tickets where id = $1`,
        [ticketId],
      );

      const orgId = ticketResult.rows[0].org_id;

      const query = `select role from membership where user_id = $1 and org_id = $2`;

      const result = await pool.query(query, [userId, orgId]);
      

      if (result.rowCount === 0) {
        return res.status(403).json({ message: "Forbidden1" });
      }

      if (result.rows[0].role !== role) {
        return res.status(403).json({ message: "Forbidden2" });
      }

      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

module.exports = roleHandler;
