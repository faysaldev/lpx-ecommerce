const httpStatus = require("http-status");
const { User, Vendor } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmailVerification } = require("./email.service");
const unlinkImages = require("../common/unlinkImage");

const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (userBody.role === "user" || userBody.role === "admin") {
    sendEmailVerification(userBody.email, oneTimeCode);
  }
  return User.create({ ...userBody, oneTimeCode });
};

const resendVerification = async (email) => {
  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  sendEmailVerification(email, oneTimeCode);
};

const queryUsers = async (filter, options) => {
  const query = {};

  // Loop through each filter field and add conditions if they exist
  for (const key of Object.keys(filter)) {
    if (
      (key === "fullName" || key === "email" || key === "username") &&
      filter[key] !== ""
    ) {
      query[key] = { $regex: filter[key], $options: "i" }; // Case-insensitive regex search for name
    } else if (filter[key] !== "") {
      query[key] = filter[key];
    }
  }

  const users = await User.paginate(query, options);

  // Convert height and age to feet/inches here...

  return users;
};

const getUserById = async (id, userType) => {
  try {
    // Fetch the user based on ID
    const user = await User.findById(id).select(
      "name email image role type address city phoneNumber createdAt _id"
    );

    if (!user) {
      throw new Error("User not found");
    }

    // Initialize the response object
    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
      type: user.type,
      address: user.address,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      city: user.city,
    };

    // If the user is a seller, check if they have an active vendor
    if (userType === "seller") {
      const vendor = await Vendor.findOne({
        seller: id,
        status: "approved",
      }).select("storeName storePhoto totalEarnings totalWithDrawal");

      if (vendor) {
        response.vendorDetails = {
          storeName: vendor.storeName,
          storePhoto: vendor.storePhoto,
          totalEarnings: vendor.totalEarnings,
          totalWithDrawal: vendor.totalWithDrawal,
        };
      } else {
        response.vendorDetails = null; // No active vendor
      }
    }

    return response;
  } catch (error) {
    throw new Error(`Error retrieving user details: ${error.message}`);
  }
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserById = async (userId, updateBody, files) => {
  const user = await getUserById(userId);
  console.log(user);
  console.log(updateBody);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  if (files && files.length > 0) {
    updateBody.photo = files;
  } else {
    delete updateBody.photo; // remove the photo property from the updateBody if no new photo is provided
  }

  // Object.assign(user, updateBody);
  // await user.save();
  return await User.findByIdAndUpdate(userId, updateBody, { new: true });
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

const isUpdateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const oneTimeCode =
    Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  if (updateBody.role === "user" || updateBody.role === "admin") {
    sendEmailVerification(updateBody.email, oneTimeCode);
  }

  Object.assign(user, updateBody, {
    isDeleted: false,
    isSuspended: false,
    isEmailVerified: false,
    isResetPassword: false,
    isPhoneNumberVerified: false,
    oneTimeCode: oneTimeCode,
  });
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isUpdateUser,
  resendVerification,
};
