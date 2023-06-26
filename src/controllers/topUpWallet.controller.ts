import { ExpressArgs } from "../types/generalTypes";
import UserModel from "../models/User.model";
import { Request, Response, NextFunction } from "express";
import { verifyPaystackPayment } from "../utils/verifyPaystackPaymentUtility";
import TransactionsModel from "../models/Transactions.model";
import {
  sendGiftTopUpSenderEmail,
  sendGiftTopUpRecipientEmail,
  sendTopUpEmail,
} from "../utils/sendEmailUtility";

// topUpWallet logic
const topUpWalletController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    userId,
    email,
    amount,
    referenceId = "T768990107951172",
    payment_method = "paystack",
  } = req.body;

  //   Checking the parameters passed in the body
  if (userId && email) {
     res.status(500).json({
      message: "please pass in either a user_id or an email address",
    });
    return;
  }
  try {
    // Check if the user exists in the database
    let user;

    // if (email) {
    //   user = await UserModel.findOne({ email });
    // }

    if (userId) {
      user = await UserModel.findOne({ userId });
    }

    if (!user) {
      return res.json({
        message: "user doesn't exist",
      });
    }

    // verify payment in paystack here
    console.log("verifying with paystack");

    // await verifyPaystackPayment(referenceId);

    //   wallet topUp logic
    let currentWalletBal: number = user!.theraWallet as number; // Cast user!.theraWallet to 'number'
    // adding to the user's wallet balance
    user!.theraWallet = currentWalletBal + parseInt(amount); // Parse the amount and perform the addition
    

    await user?.save();

    //save log in transaction history
    const newTopupTransactionLog = new TransactionsModel({
      userId: user.userId,
      amount,
      details: {
        payment_method: payment_method,
        // reference_id: referenceId,
        currency: "NGN",
        payment_status: "success",
      },
      type: "wallet-topup",
      created_at: new Date(),
    });
    let savedHistory = await newTopupTransactionLog.save();
    console.log(savedHistory);
    // send email notification to user
    let data = {
      name: user.firstName,
      amount,
      // referenceId,
      subject: "Therawallet Top-up Notification",
      emailTo: user.email,
    };
    let emailSent = await sendTopUpEmail(data);
    console.log(emailSent);
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
  const {
    receiverId,
    email,
    amount,
    senderId,
    // referenceId = "T768990107951172",
    payment_method,
  } = req.body;

  if (receiverId && email) {
    return res.status(500).json({
      message: "please pass in either a reciver id or an email address",
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


    let sender = await UserModel.findOne({ userId: senderId });

    // verify payment in paystack here
    console.log("verifying with paystack");
    // await verifyPaystackPayment(referenceId);
    //   wallet topUp logic
    let recipientCurrentWalletBal = parseInt(
      recipient!.theraWallet.toString()
    ) as number;
    let senderCurrentWalletBal = parseInt(
      sender!.theraWallet.toString()
    ) as number;
    // check if sender's balance is enough for gifting
    if (senderCurrentWalletBal < parseInt(amount)) {
      return res.json({
        message: "balance is not enough for gifting",
      });
    }

   
    //   deducting from the sender's wallet balance
    sender!.theraWallet = senderCurrentWalletBal - parseInt(amount);
    //   adding to the receiver wallet balance
    recipient!.theraWallet = recipientCurrentWalletBal + parseInt(amount);

    await recipient?.save();
    await sender?.save();

    //save log in transaction history
    const newSenderHistoryLog = new TransactionsModel({
      userId: recipient.userId,
      amount,
      details: {
        recipientId: `${recipient!.userId}`,
        recipientName: `${recipient!.firstName} ${recipient!.lastName}`,
        payment_method: payment_method,
        currency: "NGN",
        payment_status: "success",
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
        payment_method: payment_method,
        currency: "NGN",
        payment_status: "success",
      },
      type: "gift-balance",
      created_at: new Date(),
    });

    await newRecipientHistoryLog.save();
    await newSenderHistoryLog.save();

    //send email notification to sender
    let senderEmailNotificationData = {
      amount,
      recipientId: `${recipient!.userId}`,
      recipientName: `${recipient!.firstName} ${recipient!.lastName}`,
      emailTo: sender!.email,
      subject: "Therawallet Gift Balance Top-up Notification",
      senderName: `${sender!.firstName}`,
    };

    sendGiftTopUpSenderEmail(senderEmailNotificationData);
    let recipientEmailNotificationData = {
      amount,
      senderId: `${sender!.userId}`,
      recipientId: `${recipient!.userId}`,
      senderName: `${sender!.firstName} ${sender!.lastName}`,
      emailTo: recipient!.email,
      subject: "Therawallet Gift Balance Top-up Notification",
      recipientName: `${recipient!.firstName}`,
    };

    sendGiftTopUpRecipientEmail(recipientEmailNotificationData);

    res.status(200).json({ success: "gifting was successful" });
  } catch (err) {
    console.error(err);
    next?.(err);
    return res.status(500).json({ message: "Server error" });
  }
};

