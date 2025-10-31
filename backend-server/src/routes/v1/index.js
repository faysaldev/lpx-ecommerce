const express = require("express");
const config = require("../../config/config");
const authRoute = require("./auth.routes");
const userRoute = require("./user.routes");
const docsRoute = require("./docs.routes");
const vendorRoute = require("./vendor.routes");
const cartsRoute = require("./cart.routes");
const paymentRequestRoute = require("./paymentrequest.routes");
const productsRoute = require("./product.routes");
const ratingsRoute = require("./rating.routes");
const orderRoute = require("./order.routes");
const bankDetailsRoute = require("./bankDetails.routes");
const wishlistsRoute = require("./wishlist.routes");
const adminsRoute = require("./admin.routes");
const notificationRoute = require("./notifications.routes");
const stripeRoute = require("./stripe.routes");
const generalRoute = require("./generals.routes");
const utilsRoute = require("./utils.routes");
const jeeblyRoutes = require("./jeebly-webhook.routes");

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
    path: "/payments",
    route: paymentRequestRoute,
  },
  {
    path: "/products",
    route: productsRoute,
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
    path: "/banks",
    route: bankDetailsRoute,
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
    path: "/generals",
    route: generalRoute,
  },
  {
    path: "/lpx",
    route: utilsRoute,
  },
  {
    path: "/jeebly",
    route: jeeblyRoutes,
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
