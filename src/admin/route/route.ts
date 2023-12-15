const express = require("express");
const router = express.Router();
import { 
    validatEssentialCategoryParams,
    validatEssentialProuctIdParams,
    validateAdminSigninParams,
    validateEmail,
    validateMedicationDeleteParams,
    validateMedicationEditParams,
    validateOrderParams,
    validateResetPassword,
    validateUserParams
} from "../middleware/requestValidate.middleware";

import { adminSignInController } from "../controllers/regLogin.controller";
import {
     adminForgotPassworController, 
     adminResetPassworController 
} from "../controllers/forgotPassword.controller";
import { checkAdminRole } from "../middleware/rolechecker.middleware";
import { adminAddMedicationController, adminDeleteMedicationController, adminEditMedicationController, getAllMedicationController, getPageMedicationController, getSpecificNumbereMedicationController, getTotalMedicationController, getsingleMedicationController } from "../controllers/medication.controller";
import imgae from "../middleware/image.middleware";
import { upload } from "../../utils/upload.utility";
import { getAllUsersController, getPageUserDeatilController, getsingleUserController } from "../controllers/userDetail.controller";
import { DeliveredOrderController, getAllOrderDeliveredController, getAllOrderNotDeliveredController, getPageOrderDeliveredController, getPageOrderNotDeliveredController, getPageOrderNotpendingController, getSingleOrderDeliveredController, getSingleOrderNotDeliveredController } from "../controllers/order.controller";
import { adminGetDeliverdDoctorOder, adminGetPaidDoctorOder, adminGetPendingDoctorOder } from "../controllers/orderFromDoctor.controller";
import { createEssentialCategoryController, getAllEssentialCategoryController, getPageEssentialCategoryController } from "../controllers/essentialCategory.controller";
import { adminAddEssentialProductController, deleteEssentialProductController, editEssentialProductController, getPageEssentialProductController, searchEssentialProductByNameController } from "../controllers/essentialProduct.controller";


router.post("/admin_signin", validateAdminSigninParams, adminSignInController); // admin login
router.post("/admin_forgot_password", validateEmail, adminForgotPassworController); // admin forgot password
router.post("/admin_reset_password", validateResetPassword, adminResetPassworController); // admin reset password


router.post("/admin_add_medication", checkAdminRole, upload.single('medicationImg'), adminAddMedicationController); // admin add medication to databas
router.post("/admin_edit_medication", validateMedicationEditParams, checkAdminRole,   adminEditMedicationController); // admin add medication to databas
router.post("/admin_delete_medication", validateMedicationDeleteParams, checkAdminRole,  adminDeleteMedicationController); // admin add medication to databas
router.get("/admin_all_medication",  getAllMedicationController); // get all medication
router.post("/admin_single_medication", validateMedicationDeleteParams, getsingleMedicationController); // get single medication
router.post("/number_medication", getSpecificNumbereMedicationController); // get specific number of medication
router.post("/page_medication", getPageMedicationController); // get page of medication
router.get("/total_medication", getTotalMedicationController); // get total medication


router.get("/all_user", checkAdminRole, getAllUsersController); // get total medication
router.get("/page_user", checkAdminRole, getPageUserDeatilController); // get page medication
router.get("/single_user", validateUserParams, checkAdminRole, getsingleUserController); // get single medication


router.get("/all_order_not_deliver", checkAdminRole, getAllOrderNotDeliveredController); // get total order not deliver
router.get("/page_order_not_deliver", checkAdminRole, getPageOrderNotDeliveredController); // get page order not deliver
router.get("/single_order_not_deliver", validateOrderParams, checkAdminRole, getSingleOrderNotDeliveredController); // get single oder not delivered
router.get("/all_order_deliver", checkAdminRole, getAllOrderDeliveredController); // get total order delivered
router.get("/page_order_deliver", checkAdminRole, getPageOrderDeliveredController); // get page order delivered
router.get("/single_order_deliver", validateOrderParams, checkAdminRole, getSingleOrderDeliveredController); // get single oder delivered
router.get("/pending order", checkAdminRole, getPageOrderNotpendingController); // get pending order
router.post("/delivered_order", validateOrderParams, checkAdminRole, DeliveredOrderController); //  delivered order

//essential
router.post("/create_category", upload.single('categoryImg'), checkAdminRole, createEssentialCategoryController); //  create essential category
router.get("/get_category", checkAdminRole, getAllEssentialCategoryController); // get essential category
router.get("/get_page_category", checkAdminRole, getPageEssentialCategoryController); // get essential category
router.post("/create_product",  checkAdminRole, upload.single('productImg'), adminAddEssentialProductController); // create essential product
router.get("/get_product",  checkAdminRole, getPageEssentialProductController); // get essential page product
router.get("/search_product_name",  checkAdminRole, searchEssentialProductByNameController); // get essential product by name
router.post("/edit_product",  checkAdminRole, upload.single('productImg'),  editEssentialProductController); // get essential product by name
router.post("/delete_product", validatEssentialProuctIdParams,  checkAdminRole, deleteEssentialProductController); // get essential product by name



/////////////////////////////////
//////// doctor ///////////////
/////////////////////////////
router.get("/doctor_order_pending", checkAdminRole, adminGetPendingDoctorOder); // get order from doctor that is pending
router.get("/doctor_order_paid", checkAdminRole, adminGetPaidDoctorOder); // get order from doctor that is paid
router.get("/doctor_order_delivered", checkAdminRole, adminGetDeliverdDoctorOder); // get order from doctor that is delived


export default router;