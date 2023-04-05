import Order from "../models/Order.model";

// Generate a new order ID
export async function generateOrderId() {
  // Retrieve the last order ID from the database or set it to RX:000000 if no previous orders exist
  const lastOrderId = (await getLastOrderIdFromDatabase()) || "RX:000000";

  // Increment the numeric portion of the last order ID by 1
  const lastOrderNumber = parseInt(lastOrderId.substring(3));
  const nextOrderNumber = lastOrderNumber + 1;

  // Check if the numeric portion of the order ID is about to exceed six digits
  if (nextOrderNumber >= 1000000) {
    // Switch to a new prefix for the order ID
    const newPrefix = generateNewPrefix();
    const newOrderId = `${newPrefix}:000001`;
    //   await saveOrderIdToDatabase(newOrderId);
    return newOrderId;
  }

  // Pad the numeric portion with leading zeroes to create a 6-digit number
  const paddedOrderNumber = nextOrderNumber.toString().padStart(6, "0");

  // Combine the prefix and padded numeric portion to create the new order ID
  const newOrderId = `RX:${paddedOrderNumber}`;

  // Save the new order ID to the database
  // await saveOrderIdToDatabase(newOrderId);

  // Return the new order ID
  return newOrderId;
}

// Helper function to generate a new prefix when both RX and RX1 are about to exceed their limits
async function generateNewPrefix() {
  // Retrieve the last order ID from the database or set it to RX1:000000 if no previous orders exist
  const lastOrderId = (await getLastOrderIdFromDatabase()) || "RX1:000000";

  // Extract the prefix and numeric portion of the last order ID
  const lastOrderPrefix = lastOrderId.substring(0, 3);
  const lastOrderNumber = parseInt(lastOrderId.substring(3));

  // Check if the numeric portion of the order ID is about to exceed six digits
  if (lastOrderNumber >= 999999) {
    // Increment the prefix to the next number
    const nextPrefixNumber = parseInt(lastOrderPrefix.substring(2)) + 1;
    const nextPrefix = `RX${nextPrefixNumber}`;
    return nextPrefix;
  }

  // Pad the numeric portion with leading zeroes to create a 6-digit number
  const paddedOrderNumber = (lastOrderNumber + 1).toString().padStart(6, "0");

  // Return the original prefix concatenated with the padded numeric portion
  return lastOrderPrefix.replace("RX", "RX1") + paddedOrderNumber;
}

// Helper function to retrieve the last order ID from the database
async function getLastOrderIdFromDatabase() {
  try {
    // Find the most recent order by sorting the orders collection by ID in descending order and selecting the first document
    const mostRecentOrder = await Order.findOne()
      .sort({ _id: -1 })
      .select("orderId");

    // If there are no orders in the database, return null
    if (!mostRecentOrder) {
      return null;
    }

    // Extract the order number from the ID and return the formatted order ID
    const orderNumber = parseInt(
      mostRecentOrder.orderId.toString().substring(3)
    );

    return `RX:${orderNumber.toString().padStart(6, "0")}`;
  } catch (error) {
    console.error("Error retrieving last order ID from database:", error);
    throw error;
  }
}
