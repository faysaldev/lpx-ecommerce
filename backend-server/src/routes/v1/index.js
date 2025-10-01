const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const vendorRoute = require("./vendor.routes");
const cartsRoute = require("./cart.routes");
const paymentRequestRoute = require("./paymentrequest.routes");
const productsRoute = require("./product.routes");
const draftRoute = require("./draft.routes");
const ratingsRoute = require("./rating.routes");
const orderRoute = require("./order.routes");
const paymentCardRoute = require("./paymentCard.routes");
const wishlistsRoute = require("./wishlist.routes");
const adminsRoute = require("./admin.routes");
const notificationRoute = require("./notifications.routes");
const stripeRoute = require("./stripe.routes");
const categoriesRoute = require("./categories.routes");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/vendors",
    route: vendorRoute,
  },
  {
    path: "/carts",
    route: cartsRoute,
  },
  {
    path: "/paymentrequest",
    route: paymentRequestRoute,
  },
  {
    path: "/products",
    route: productsRoute,
  },
  {
    path: "/drafts",
    route: draftRoute,
  },
  {
    path: "/ratings",
    route: ratingsRoute,
  },
  {
    path: "/orders",
    route: orderRoute,
  },

  {
    path: "/cards",
    route: paymentCardRoute,
  },
  {
    path: "/wishlists",
    route: wishlistsRoute,
  },
  {
    path: "/admin",
    route: adminsRoute,
  },
  {
    path: "/notifications",
    route: notificationRoute,
  },
  {
    path: "/stripes",
    route: stripeRoute,
  },
  {
    path: "/categories",
    route: categoriesRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
