const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const {
  vendorService,
  notificationService,
  emailService,
  userService,
} = require("../services");

const getSingleVendors = catchAsync(async (req, res) => {
  const vendors = await vendorService.getSingleVendors(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Signle  Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

const searchSingleOwnerShop = catchAsync(async (req, res) => {
  const vendorId = req.params.id;
  const {
    query = "",
    category = "",
    sortBy = "createdAt",
    page = 1,
    limit = 10,
  } = req.query;

  const products = await vendorService.searchSingleOwnerShop({
    vendorId,
    query,
    category,
    sortBy,
    page,
    limit,
  });

  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const allVendors = catchAsync(async (req, res) => {
  const {
    page = 1, // Default page: 1
    limit = 10, // Default limit: 10
    search = "", // Search term for store name, description
    sortBy = "createdAt", // Default sort: newest first
    category = "", // Category filter
    ratingFilter = "", // Rating filter (optional)
  } = req.query;

  const vendors = await vendorService.allVendors({
    page,
    limit,
    search,
    sortBy,
    category,
    ratingFilter,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

const getVendors = catchAsync(async (req, res) => {
  const vendors = await vendorService.getVendors(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

const createVendorRequest = catchAsync(async (req, res) => {
  if (req.file) {
    req.body.storePhoto = `/uploads/vendors/${req.file.filename}`;
  }

  const createVendor = await vendorService.createVendorRequest({
    ...req.body,
    seller: req.user.id,
    ownerName: req.user.name,
    socialLinks: JSON.parse(req?.body?.socialLinks),
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Apllication Done. Wait for the admin Approval",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: createVendor,
    })
  );
});

const approvedVendorRequest = catchAsync(async (req, res) => {
  if (req.user.type != "admin") {
    res.status(httpStatus.CREATED).json(
      response({
        message: "Only Admin Can Approval",
        status: "OK",
        statusCode: httpStatus.NOT_ACCEPTABLE,
      })
    );
  }
  const approved = await vendorService.approvedVendorRequest(
    req.body.vendorId,
    req.body.sellerId
  );

  const user = await userService.getUserById(req.body.sellerId);
  console.log(user, "user data");
  const vendorNotificationData = {
    authorId: user?.id, // The seller is the author of the notification
    sendTo: user?.id, // Send the notification to the seller
    transactionId: approved.id, // Use the approved vendor's id as the transactionId
    title: "Your Vendor Has Been Approved", // Change the title to reflect the approval
    description: approved.notes || "No additional notes provided.", // Use the vendor's notes as the description. If no notes, provide a default message.
    type: "vendor", // The type of notification
  };

  const notification = await notificationService.addNewNotification(
    vendorNotificationData
  );

  const vendorApprovalData = {
    username: approved?.seller?.name,
    title: "Your Vendor Has Been Approved",
    description:
      approved?.notes ||
      "Your vendor application has been reviewed and approved. You can now start selling on our platform.",
    transactionId: approved?.id || "VENDOR_12345", // This would be the approved.id
    timestamp: new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
  await emailService.sendNotificationEmailWithDelayVendor(
    approved?.seller?.email || "admin@gmail.com",
    vendorApprovalData,
    5000
  );

  res.status(httpStatus.CREATED).json(
    response({
      message: "Approval Done",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: approved,
    })
  );
});

module.exports = {
  getVendors,
  createVendorRequest,
  approvedVendorRequest,
  allVendors,
  getSingleVendors,
  searchSingleOwnerShop,
};
