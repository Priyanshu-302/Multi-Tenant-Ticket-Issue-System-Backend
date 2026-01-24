const createTicket = require("../services/ticket.service");
const getTickets = require("../services/ticket.service");
const assignTicket = require("../services/ticket.service");
const updateTicketStatus = require("../services/ticket.service");
const updateTicket = require("../services/ticket.service");
const deleteTicket = require("../services/ticket.service");
const addTicketMessage = require("../services/ticket.service");
const getTicketMessage = require("../services/ticket.service");

exports.createTicket = async (req, res, next) => {
  try {
    const { title, description, org_id, user_id } = req.body;
    if (!title || !description || !org_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newTicket = await createTicket(title, description, org_id, user_id);
    if (!newTicket) {
      return res.status(400).json({
        success: false,
        message: "Ticket already exists",
      });
    }

    return res.status(201).json({
      success: true,
      newTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    const { org_id } = req.body;
    if (!org_id) {
      return res.status(400).json({
        success: false,
        message: "Organization ID is required",
      });
    }

    const tickets = await getTickets(org_id);
    if (!tickets) {
      return res.status(404).json({
        success: false,
        message: "No tickets found",
      });
    }

    return res.status(200).json({
      success: true,
      tickets,
      message: "Tickets retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.assignTicket = async (req, res, next) => {
  try {
    const { user_id, ticket_id } = req.body;
    if (!user_id || !ticket_id) {
      return res.status(400).json({
        success: false,
        message: "User ID and Ticket ID are required",
      });
    }

    const assignedTicket = await assignTicket(user_id, ticket_id);
    if (!assignedTicket) {
      return res.status(400).json({
        success: false,
        message: "Ticket already assigned",
      });
    }

    return res.status(200).json({
      success: true,
      assignedTicket,
      message: "Ticket assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status, ticket_id } = req.body;
    if (!status || !ticket_id) {
      return res.status(400).json({
        success: false,
        message: "Status and Ticket ID are required",
      });
    }

    const updatedTicket = await updateTicketStatus(status, ticket_id);
    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedTicket,
      message: "Ticket status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTicket = async (req, res, next) => {
  try {
    const { title, description, ticket_id } = req.body;
    if (!title || !description || !ticket_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedTicket = await updateTicket(title, description, ticket_id);
    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedTicket,
      message: "Ticket updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTicket = async (req, res, next) => {
  try {
    const { ticket_id } = req.body;
    if (!ticket_id) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const deletedTicket = await deleteTicket(ticket_id);
    if (!deletedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedTicket,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.addTicketMessage = async (req, res, next) => {
  try {
    const { ticket_id, new_status, user_id } = req.body;
    if (!ticket_id || !new_status || !user_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = await addTicketMessage(ticket_id, new_status, user_id);
    if (!newMessage) {
      return res.status(400).json({
        success: false,
        message: "Message not added",
      });
    }

    return res.status(201).json({
      success: true,
      newMessage,
      message: "Message added successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getTicketMessage = async (req, res, next) => {
  try {
    const { ticket_id } = req.body;
    if (!ticket_id) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const messages = await getTicketMessage(ticket_id);
    if (!messages) {
      return res.status(404).json({
        success: false,
        message: "No messages found",
      });
    }

    return res.status(200).json({
      success: true,
      messages,
      message: "Messages retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};
