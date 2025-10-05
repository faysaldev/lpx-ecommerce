export const forMatStripeLineItems = (data) => {
  return data.totalItems.map((item) => ({
    price_data: {
      currency: "usd", // Currency, can be dynamic
      product_data: {
        name: `Product ${item.productId}`, // Assuming you want to pass product name dynamically
        description: "Description of the product", // You can adjust to pass the actual description
        images: item.images, // Array of image URLs
      },
      unit_amount: item.price * 100, // Price in cents
    },
    quantity: item.quantity, // The quantity of the product
  }));
};

export const forMatOrderData = (req) => {
  const orderData = {
    customer: req.customer, // Get customer from authenticated user
    status: "unpaid", // Default status
    totalAmount: req.total, // The total amount of the order
    totalItems: req.totalItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      vendorId: item.vendorId,
    })),
    total: req.total, // Total price
    shipping: req.shipping, // Shipping cost
    tax: req.tax, // Tax cost
    orderNotes: req.orderNotes || "",
    coupon: req.coupon || {},
  };

  return orderData;
};
