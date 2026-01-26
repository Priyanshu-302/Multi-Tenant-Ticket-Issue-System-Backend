const { createOrg } = require("../services/organization.service");
const { addUserToOrg } = require("../services/organization.service");
const { getUserOrgs } = require("../services/organization.service");
const { changeUserRole } = require("../services/organization.service");

exports.createOrganization = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const newOrg = await createOrg(name);
    res.status(201).json({
      success: true,
      newOrg,
      message: "Organization created successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const { user_id, role, org_id } = req.body;
    if (!user_id || !org_id) {
      return res.status(400).json({
        success: false,
        message: "User ID and Organization ID are required",
      });
    }

    const newMember = await addUserToOrg(user_id, role, org_id);
    res.status(201).json({
      success: true,
      newMember,
      message: "User added to organization successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserOrganizations = async (req, res, next) => {
  try {
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const orgs = await getUserOrgs(user_id);
    if (!orgs) {
      return res.status(404).json({
        success: false,
        message: "User not in any organizations",
      });
    }

    res.status(200).json({
      success: true,
      orgs,
      message: "User organizations retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const { user_id, org_id, role } = req.body;
    if (!user_id || !role || !org_id) {
      return res.status(400).json({
        success: false,
        message: "Role and User ID are required",
      });
    }

    const updatedRole = await changeUserRole(user_id, org_id, role);
    if (!updatedRole) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      updatedRole,
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
