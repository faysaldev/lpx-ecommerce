export const forMatStripeLineItems = (data) => {
  return data.map((item) => ({
    price_data: {
      currency: "aed", // Currency, can be dynamic
      product_data: {
        name: item.productName, // Product name
        description: "Product description ",
        images: [item.image], // Image URL
      },
      unit_amount: item.price * 100, // Price in cents (multiplied by 100 to convert to cents)
    },
    quantity: item.quantity, // Quantity of the product
  }));
};

export const forMatOrderData = ({
  productDetails,
  customer,
  cupon,
  taxCost,
  orderNotes,
  shippingCost,
}) => {
  // Calculate the total amount of the order by summing the price of all items
  const totalAmount =
    productDetails.reduce((acc, item) => acc + item.price * item.quantity, 0) +
    shippingCost;

  // Build the order data object
  const orderData = {
    customer: customer, // Assuming customer is an object with _id
    status: "unpaid", // Default status
    totalAmount: totalAmount, // The total amount of the order
    total: totalAmount, // Total price
    shipping: shippingCost, // Shipping cost
    tax: taxCost, // Tax cost
    orderNotes: orderNotes || "", // Optional notes
    coupon: cupon || {}, // Optional coupon data
  };

  return orderData;
};

export const formatSellingProducts = (productDetails, orderId) => {
  return productDetails.map((product) => ({
    orderId: orderId, // Convert orderId to ObjectId
    productId: product.productId, // Convert productId to ObjectId
    shippingId: "", // If shippingId is not available, you can leave it empty or generate it as needed
    image: product.image,
    quantity: product.quantity,
    price: product.price,
    vendorId: product.vendorId, // Convert vendorId to ObjectId
    status: "unpaid", // Set default status or modify as needed
  }));
};
