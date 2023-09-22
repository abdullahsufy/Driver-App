const express = require("express");
const controller = require("../controller/controller");
const validateUser = require("../middlewares/validateUser");
const validateAdmin = require("../middlewares/validateAdmin");
const router = express.Router();

router.get("/", (req, res) => res.json({ msg: "Hello world" }));

// ==================User Site==================//
// Login
router.post("/login", controller.login);

// get user data
router.get("/user/details/:id", validateUser, controller.getDetail);

// ==================Admin Site==================//

//create admin
// router.post("/create/admin", controller.createAdmin);

//AdminLogin
router.post("/login/admin", controller.adminLogin);

//AdminLogin
router.put("/update/admin/password", validateAdmin, controller.editAdmin);

//register
router.post("/register", validateAdmin, controller.register);

// delete User
router.delete("/delete/:id", validateAdmin, controller.deleteUser);

//get all users
router.get("/fetch/all/users", validateAdmin, controller.getAllUsers);

//get data to update
router.get("/get/data/to/update/:id", validateAdmin, controller.getDataToUpdate);

//update data
router.put("/update/data", validateAdmin, controller.updateDetails);

// update password
router.put("/update/password", validateAdmin, controller.updatePassword);

module.exports = router;
