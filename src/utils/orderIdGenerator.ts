import Order from "../models/Order.model";

// Generate a new order ID
export async function generateOrderId() {
  // Retrieve the last order ID from the database or set it to RX:000000 if no previous orders exist
  const lastOrderId = (await getLastOrderIdFromDatabase()) || "RX:000000";

  // Increment the numeric portion of the last order ID by 1

  const lastOrderPrefix = lastOrderId.split(":")[0];
  const lastOrderNumber = parseInt(lastOrderId.split(":")[1]);
  const nextOrderNumber = lastOrderNumber + 1;

  // Check if the numeric portion of the order ID is about to exceed six digits
  if (nextOrderNumber >= 1000000) {
    // Switch to a new prefix for the order ID
    const newPrefix = await generateNewPrefix(lastOrderPrefix);
    const newOrderId = `${newPrefix}:000001`;

    return newOrderId;
  }

  // Pad the numeric portion with leading zeroes to create a 6-digit number
  const paddedOrderNumber = nextOrderNumber.toString().padStart(6, "0");

  // Combine the prefix and padded numeric portion to create the new order ID
  const newOrderId = `${lastOrderPrefix}:${paddedOrderNumber}`;

  // Return the new order ID
  return newOrderId;
}

async function generateNewPrefix(lastOrderPrefix: string) {
  let orderIdPrefix: string;

  if (lastOrderPrefix === "RX:") {
    // Retrieve the last order ID from the database or set it to RX1:000000 if no previous orders exist
    const lastOrderId = (await getLastOrderIdFromDatabase()) || "RX1:000000";

    // Extract the prefix and numeric portion of the last order ID
    orderIdPrefix = lastOrderId.split(":")[0];
    const lastOrderNumber = parseInt(lastOrderId.split(":")[1]);

    // Check if the numeric portion of the order ID is about to exceed six digits
    if (lastOrderNumber >= 999999) {
      // Increment the prefix to the next number
      return "RX1";
    }

    // Pad the numeric portion with leading zeroes to create a 6-digit number
    const paddedOrderNumber = (lastOrderNumber + 1).toString().padStart(6, "0");

    // Return the original prefix concatenated with the padded numeric portion
    return orderIdPrefix.replace("RX", "RX1") + paddedOrderNumber;
  } else {
    // Extract the numeric portion of the last order ID

    let rxNumber = lastOrderPrefix?.match(/RX(\d+)/)?.[1];
    let lastOrderNumber = rxNumber ? parseInt(rxNumber) : 0;

    // Check if the numeric portion of the order ID is about to exceed six digits
    if (lastOrderNumber >= 99) {
      throw new Error("Cannot generate new order ID: maximum prefix exceeded");
    }

    // Increment the prefix to the next number
    const nextPrefixNumber = lastOrderNumber + 1;
    return `RX${nextPrefixNumber}`;
  }
}

// Helper function to retrieve the last order ID from the database
async function getLastOrderIdFromDatabase() {
  try {
    const mostRecentOrder = await Order.findOne().sort({ _id: -1 });
    return mostRecentOrder ? mostRecentOrder.orderId : null;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving last order ID from database");
  }
}
