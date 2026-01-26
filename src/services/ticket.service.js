const { createTicket } = require("../models/ticket.model");
const { getTicketByOrg } = require("../models/ticket.model");
const { assignTicket } = require("../models/ticket.model");
const { updateTicketStatus } = require("../models/ticket.model");
const { updateTicket } = require("../models/ticket.model");
const { deleteTicket } = require("../models/ticket.model");
const { addTicketHistory } = require("../models/ticketHistory.model");
const { getTicketHistory } = require("../models/ticketHistory.model");

exports.createTicket = async (title, description, org_id, status, priority) => {
  try {
    const newTicket = await createTicket(
      title,
      description,
      org_id,
      status,
      priority,
    );
    if (!newTicket) {
      throw new Error("Ticket needed");
    }

    return newTicket;
  } catch (error) {
    console.log(error);
  }
};

exports.getTickets = async (org_id) => {
  try {
    const tickets = await getTicketByOrg(org_id);
    if (!tickets) {
      throw new Error("No tickets found");
    }

    return tickets;
  } catch (error) {
    console.log(error);
  }
};

exports.assignTicket = async (id, created_by, assigned_to) => {
  try {
    const assignedTicket = await assignTicket(id, created_by, assigned_to);

    if (!assignedTicket) {
      throw new Error("Ticket not assigned");
    }

    return assignedTicket;
  } catch (error) {
    console.log(error);
  }
};

exports.updateTicketStatus = async (status, ticket_id) => {
  try {
    const updatedTicket = await updateTicketStatus(status, ticket_id);
    if (!updatedTicket) {
      throw new Error("Ticket not found");
    }

    return updatedTicket;
  } catch (error) {
    console.log(error);
  }
};

exports.updateTicket = async (title, description, ticket_id) => {
  try {
    const updatedTicket = await updateTicket(title, description, ticket_id);
    if (!updatedTicket) {
      throw new Error("Ticket not found");
    }

    return updatedTicket;
  } catch (error) {
    console.log(error);
  }
};

exports.deleteTicket = async (ticket_id) => {
  try {
    const deletedTicket = await deleteTicket(ticket_id);
    if (!deletedTicket) {
      throw new Error("Ticket not found");
    }

    return deleteTicket;
  } catch (error) {
    console.log(error);
  }
};

exports.addTicketMessage = async (ticket_id, new_status, user_id) => {
  try {
    const newMessage = await addTicketHistory(ticket_id, new_status, user_id);
    if (!newMessage) {
      throw new Error("Message not added");
    }

    return newMessage;
  } catch (error) {
    console.log(error);
  }
};

exports.getTicketMessage = async (ticket_id) => {
  try {
    const messages = await getTicketHistory(ticket_id);
    if (!messages) {
      throw new Error("No messages found");
    }

    return messages;
  } catch (error) {
    console.log(error);
  }
};
