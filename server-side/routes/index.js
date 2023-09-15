const express = require("express");
const controller = require("../controller/controller");
const validateUser = require("../middlewares/validateUser");
const router = express.Router();

router.get("/", (req, res) => res.json({ msg: "Hello world" }));

// ==================User Site==================//
// Login
router.post("/login", controller.login);

// get user data
router.get("/user/details/:id", validateUser, controller.getDetail);

// ==================Admin Site==================//

//register
router.post("/register", controller.register);

// delete User
router.delete("/delete/:id", controller.deleteUser);

//get all users
router.get("/fetch/all/users", controller.getAllUsers);

// add user data
// router.post("/add/details", controller.addDetails);

//get data to update
router.get("/get/data/to/update/:id", controller.getDataToUpdate);

//update data
router.put("/update/data", controller.updateDetails);

module.exports = router;
