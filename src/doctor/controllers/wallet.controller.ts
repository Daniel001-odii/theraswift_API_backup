import DoctorWalletModel from "../modal/doctorWallet.model";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import * as https from 'https';
import * as crypto from "crypto";

import { IncomingMessage } from 'http';
import axios from "axios"
import banks from '../../utils/banks.json'
import DoctotModel from "../modal/doctor_reg.modal";

// FUND DOCTOR WALLET >>>
export const fundDoctorWallet = async (req:any, res:Response) => {
    try{
        const doctor_id = req.doctor;
        const { amount } = req.body;
        const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });

        // algorithim to fund doctor wallet here...
        if(!amount){
            return res.status(400).json({ message: "please provide a valid amount"});
        }

        // add amount to doctor's wallet here...
        wallet.amount += amount;
        // add transaction type for history tracking...
        wallet.transactions.push({
            transaction_type: "fund",
            // transsaction_date is prefilled by default
        });

        res.status(201).json({ message: `you added ${amount} into your wallet`});

    }catch(error:any){
        res.status(500).json({ message: error.message })
    }
}


// GET DOCTOR WALLET >>>
export const getDoctorWallet = async (req:any, res:Response) => {
    try{
        const doctor_id = req.doctor._id;
        const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });

        if(!wallet){
            const newWallet = new DoctorWalletModel({
                doctorId: doctor_id
            });
            await newWallet.save();

            return res.status(201).json({ message: "new wallet created for doctor", newWallet });
        }

        res.status(200).json({ wallet });

    }catch(error:any){
        res.status(500).json({ message: error.message })  
    }
};


// SET WALLET CLINIC CODE >>>
export const setWalletClinicCode = async (req:any, res:Response) => {
    try{
        const doctor_id = req.doctor._id;
        const { clinicCode } = req.body;
        const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });

        if(!clinicCode){
            return res.status(400).json({ message: "please provide a valid clinic code"});
        }
       
        wallet.clinicCode = clinicCode;
        await wallet.save();

        res.status(200).json({ message: "wallet clinic code updated successfully" });

    }catch(error:any){
        res.status(500).json({ message: error.message })  
    }
}

// Set withdrawl details, this is essentially required for paystack required
export const setFundsWithdrawalDetails = async (req: any, res:Response) => {
    try{
        const doctor_id = req.doctor._id;
        const doctor: any = await DoctotModel.findById(doctor_id);

        const { account_number, bank_code } = req.body;

        if(!account_number || !bank_code){
            return res.status(400).json({ message: "missing required field in body"});
        }
         
        const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });
        wallet.funds_payout.account_number = account_number;
        wallet.funds_payout.bank_code = bank_code;
        await wallet.save();

        // set doctor completedAccountSteps...
        doctor.completedAccountSteps.step2.addedPaymentMethod = true;
        await doctor.save();

        const saved_ref = await initiatePayoutReference(req, res);

        if(saved_ref) {
            return res.status(201).json({ message: "payment details updated successfully!"})
        } else {
            console.log("ref code error: ", saved_ref)
            return res.status(400).json({ message: "error setting ref_code!"})
        }
        
    }catch(error){
        res.status(500).json({ message: "error updating payment details"});
        console.log("error updating payment method?: ", error);
    }
}

/* 
c
*/


// get bank details to enable setting details...
export const getAllBanks = async (req: any, res: Response) => {
   try{
    const banks_list: object = banks;

    res.status(200).json({ banks_list });

   }catch(error){
    console.log("error getting banks: ", error);
   }
}

// confirm account details...
export const confirmFundPayoutDetails = async (req: Request, res: Response): Promise<void> => {
  const { account_number, bank_code } = req.body;

  if (!account_number || !bank_code) {
    res.status(400).json({ error: 'Account number and bank code are required' });
    return;
  }

  const options: https.RequestOptions = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_KEY}`
    }
  };

  try {
    const bankDetails = await new Promise((resolve, reject) => {
      const req = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk: Buffer) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Error parsing response from Paystack API'));
          }
        });
      });

      req.on('error', (error: Error) => {
        reject(error);
      });

      req.end();
    });

    res.status(200).json({ success: true, data: bankDetails });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Unable to fetch bank details' });
  }
};

// 
export const initiatePayoutReference = async (req: any, res: Response) => {
    
    const doctor_id = req.doctor._id;
    const doctor = await DoctotModel.findById(doctor_id);
    const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });

    const name = `${doctor?.firstName} ${doctor?.lastName}`;
    const account_number = wallet.funds_payout.account_number;
    const bank_code = wallet.funds_payout.bank_code;
    
    // const { name, account_number, bank_code } = req.body;

    const type = "nuban";
    const currency = "NGN";
  
    if (!type || !name || !account_number || !bank_code || !currency) {
      res.status(400).json({ error: 'All fields are required: type, name, account_number, bank_code, and currency.' });
      return;
    }
  
    const params = JSON.stringify({
      type,
      name,
      account_number,
      bank_code,
      currency
    });
  

    const options: https.RequestOptions = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transferrecipient',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const result:any = await new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
          let data = '';
  
          response.on('data', (chunk: Buffer) => {
            data += chunk;
          });
  
          response.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Error parsing response from Paystack API'));
            }
          });
        });
  
        request.on('error', (error: Error) => {
          reject(error);
        });
  
        request.write(params);
        request.end();
      });
  
    //   res.status(200).json({ success: true, data: result });

    const recipient_code = result.data.recipient_code;

    wallet.funds_payout.recipient_code = recipient_code;
    await wallet.save();

    console.log("generated ref code: ", recipient_code);

    return recipient_code;


      
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ success: false, error: 'Unable to create transfer recipient' });
    }
};

/* 
     "source": "balance",
  "amount": 37800,
  "reference": "your-unique-reference",
  "recipient": "RCP_t0ya41mp35flk40",
  "reason": "Holiday Flexing"
*/

// withdraw funds to account...
export const withdrawFunds = async (req: any, res: Response): Promise<void> => {


    

    const doctor_id = req.doctor._id;
    const doctor = await DoctotModel.findById(doctor_id);
    const wallet:any = await DoctorWalletModel.findOne({ doctorId: doctor_id });

    // Generate a unique reference code..
    const reference = crypto.randomBytes(8).toString('hex');
    const source = "balance";
    const recipient = wallet.funds_payout.recipient_code;
    const reason = "Theraswift doctor incentive payout"

    // const { amount } = req.body;
    const amount = "25000";
  
    // Validate input
    if (!source || !amount || !reference || !recipient || !reason) {
      res.status(400).json({
        error: 'All fields are required: source, amount, reference, recipient, and reason.'
      });
      return;
    }
  
    const params = JSON.stringify({
      source,
      amount,
      reference,
      recipient,
      reason
    });
  
    
    const options: https.RequestOptions = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transfer',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_KEY}`,
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const result = await new Promise((resolve, reject) => {
        const request = https.request(options, (response) => {
          let data = '';
  
          response.on('data', (chunk: Buffer) => {
            data += chunk;
          });
  
          response.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Error parsing response from Paystack API'));
            }
          });
        });
  
        request.on('error', (error: Error) => {
          reject(error);
        });
  
        request.write(params);
        request.end();
      });
  
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: 'Unable to initiate transfer'
      });
    }
  };