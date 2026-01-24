const createOrganization = require("../models/organization.model");
const addMember = require("../models/membership.model");
const getUserOrgs = require("../models/membership.model");
const updateUserRole = require("../models/membership.model");

exports.createOrg = async (name) => {
  try {
    const newOrg = await createOrganization(name);

    if (newOrg) {
      throw new Error("Organization already exists");
    }

    return newOrg;
  } catch (error) {
    console.log(error);
  }
};

exports.addUserToOrg = async (user_id, org_id) => {
  try {
    const newMember = await addMember(user_id, org_id);

    if (newMember) {
      throw new Error("User already in organization");
    }

    return newMember;
  } catch (error) {
    console.log(error);
  }
};

exports.getUserOrgs = async (user_id) => {
  try {
    const orgs = await getUserOrgs(user_id);

    if (!orgs) {
      throw new Error("User not in any organizations");
    }

    return orgs;
  } catch (error) {
    console.log(error);
  }
};

exports.changeUserRole = async (role, user_id) => {
  try {
    const updatedRole = await updateUserRole(role, user_id);

    return updatedRole;
  } catch (error) {
    console.log(error);
  }
};

