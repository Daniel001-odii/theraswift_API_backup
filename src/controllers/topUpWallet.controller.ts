import { ExpressArgs } from "../types/generalTypes";
import UserModel from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import { verifyPaystackPayment } from "../utils/verifyPaystackpPaymentUtility";
import TransactionsModel from "../models/Transactions.model";
import { sendGiftTopUpSenderEmail,sendGiftTopUpRecipientEmail } from "../utils/sendEmailUtility";

// topUpWallet logic
const topUpWalletController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userID, email, amount, referenceId } = req.body;

  //   Checking the parameters passed in the body
  if (userID && email) {
    res.status(500).json({
      message: "please pass in either a user_id or an email address",
    });
  }
  try {
    // Check if the mobile number already exists in the database
    let user;
    if (email) {
      user = await UserModel.findOne({ email });
    }
    if (userID) {
      let formattedUserId = "234" + userID;
      user = await UserModel.findOne({ mobileNumber: userID });
    }

    if (!user) {
      return res.json({
        message: "user doesn't exist",
      });
    }

    // verify payment in paystack here
    console.log("verifying with paystack");
    verifyPaystackPayment(referenceId);
    //   wallet topUp logic
    let currentWalletBal = user!.theraWallet;
    // adding to the user's wallet balance
    user!.theraWallet = currentWalletBal + amount;

    await user?.save();

    //TODO save log in transaction history
    console.log("saving transaction log in history");

    //TODO send email notification to user
    console.log("sending notification email to user on success");

    res.status(200).json({ success: "topUp was successful" });
  } catch (err) {
    next?.(err);
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export default topUpWalletController;

// giftTopUpWallet logic
export const giftWalletTopUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { receiverId, email, amount, senderId, referenceId } = req.body;

  if (receiverId && email) {
    res.status(500).json({
      message: "please pass in either a mobile number or an email address",
    });
  }
  try {
    // Check if the mobile number already exists in the database
    let recipient;

    // if (email) {
    //   user = await UserModel.findOne({ email });
    // }

    if (receiverId) {
      recipient = await UserModel.findOne({ userId: receiverId });
    }

    if (!recipient) {
      return res.json({
        message: "user doesn't exist",
      });
    }

    //   checking if sender has enough money to gift
    // let formattedSenderId = "234" + senderId;
    // TODO change to uiser id check
    let sender = await UserModel.findOne({ userId: senderId });

    // verify payment in paystack here
    console.log("verifying with paystack");
    verifyPaystackPayment(referenceId);
    //   wallet topUp logic
    let currentWalletBal = recipient!.theraWallet;
    //   deducting from the sender's wallet balance
    sender!.theraWallet = currentWalletBal - amount;
    //   adding to the receiver wallet balance
    recipient!.theraWallet = currentWalletBal + amount;

    await recipient?.save();
    await sender?.save();

    //TODO save log in transaction history
    console.log("saving transaction log in history");
    const newSenderHistoryLog = new TransactionsModel({
      userId: recipient.userId,
      amount,
      details: {
        recipientId: `${recipient!.userId}`,
        recipientName: `${recipient!.firstName} ${recipient!.lastName}`,
      },
      type: "gift-balance",
      created_at: new Date(),
    });

    const newRecipientHistoryLog = new TransactionsModel({
      userId: sender!.userId,
      amount,
      details: {
        senderName: `${sender!.firstName} ${sender!.lastName}`,
        senderId: `${sender!.userId}`,
      },
      type: "gift-balance",
      created_at: new Date(),
    });

    await newRecipientHistoryLog.save();
    await newSenderHistoryLog.save();

    //TODO send email notification to sender
    console.log("sending notification email to receiver and sender");
    // senderEmailTemplate
    let senderEmailNotificationData = {
      amount,
      recipientId: `${recipient!.userId}`,
      recipientName: `${recipient!.firstName} ${recipient!.lastName}`,
      emailTo: sender!.email,
      subject: "Gift Balance Top-up Notification",
    };

    sendGiftTopUpSenderEmail(senderEmailNotificationData);
    let recipientEmailNotificationData = {
      amount,
      senderId: `${sender!.userId}`,
      senderName: `${sender!.firstName} ${sender!.lastName}`,
      emailTo: recipient!.email,
      subject: "Gift Balance Top-up Notification",
    };

    sendGiftTopUpRecipientEmail(recipientEmailNotificationData)

    res.status(200).json({ success: "gifting was successful" });
  } catch (err) {
    console.error(err);
    next?.(err);
    return res.status(500).json({ message: "Server error" });
  }
};
