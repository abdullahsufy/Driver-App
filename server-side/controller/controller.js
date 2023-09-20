const Joi = require("joi");
const User = require("../models/user");
const Detail = require("../models/detail");
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const bcrypt = require("bcryptjs");
const JWTService = require("../services/jwtService");
const UserDTO = require("../dto/userDTO");
const DetailDTO = require("../dto/detailDTO");

const controller = {
  // register function

  async register(req, res, next) {
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { name, username, email, password } = req.body;

    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });

      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already registered, use another email!",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username already registered, use another username!",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let accessToken, user;

    try {
      const userToRegister = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      user = await userToRegister.save();

      // token generation

      accessToken = JWTService.signaccessToken({ _id: user.id }, "60m");
    } catch (error) {
      return next(error);
    }
    const userDto = new UserDTO(user);
    return res.status(201).json({ user: userDto, accessToken });
  },

  // login function
  async login(req, res, next) {
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });

    const { error } = userLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { username, password } = req.body;

    let user;

    try {
      user = await User.findOne({ username });

      if (!user) {
        const error = {
          status: 401,
          message: "Invalid username",
        };
        next(error);
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid password",
        };
        next(error);
      }

      const accessToken = JWTService.signaccessToken({ _id: user.id }, "60m");
      const userDto = new UserDTO(user);

      return res.status(200).json({ user: userDto, accessToken });
    } catch (error) {
      return next(error);
    }
  },

  async deleteUser(req, res, next) {
    const deleteUserSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = deleteUserSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;

    try {
      await User.deleteOne({ _id: id });
      let detailExist;
      try {
        detailExist = await Detail.findOne({ user: id });
      } catch (error) {}
      if (detailExist) {
        await Detail.deleteOne({ user: id });
      }
    } catch (error) {
      return next(error);
    }
    return res.status(200).json({ message: "User deleted!" });
  },

  // Add User Details
  // async addDetails(req, res, next) {
  //   const addDetailsSchema = Joi.object({
  //     user: Joi.string().regex(mongodbIdPattern).required(),
  //     data: Joi.array().required(),
  //   });

  //   const { error } = addDetailsSchema.validate(req.body);
  //   if (error) {
  //     return next(error);
  //   }

  //   const { user, data } = req.body;

  //   const detailExists = await Detail.exists({ user });

  //   if (detailExists) {
  //     const error = {
  //       status: 409,
  //       message: "User already have details!",
  //     };
  //     return next(error);
  //   }

  //   let userDetail;

  //   try {
  //     userDetail = new Detail({
  //       user,
  //       data,
  //     });

  //     await userDetail.save();
  //   } catch (error) {
  //     return next(error);
  //   }
  //   const userDetailDto = new DetailDTO(userDetail);
  //   return res.status(201).json({ userDetail: userDetailDto });
  // },

  async getDetail(req, res, next) {
    const getDetailSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getDetailSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    let detail;

    const { id } = req.params;

    try {
      detail = await Detail.findOne({ user: id });
    } catch (error) {
      return next(error);
    }
    const detailDto = new DetailDTO(detail);
    return res.status(200).json({ detail: detailDto });
  },

  async getAllUsers(req, res, next) {
    try {
      const users = await User.find({});
      let userDto = [];
      for (let i = 0; i < users.length; i++) {
        const dto = new UserDTO(users[i]);
        userDto.push(dto);
      }
      return res.status(200).json({ users: userDto });
    } catch (error) {
      return next(error);
    }
  },
  async getDataToUpdate(req, res, next) {
    const getDataSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
    });

    const { error } = getDataSchema.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;

    try {
      const user = await User.findOne({ _id: id });
      let detail;

      try {
        detail = await Detail.findOne({ user: id });
      } catch (error) {
        return next(error);
      }

      if (detail) {
        const userDto = new UserDTO(user);
        const detailDto = new DetailDTO(detail);
        return res.status(200).json({ user: userDto, detail: detailDto });
      } else {
        const userDto = new UserDTO(user);
        return res.status(200).json({ user: userDto });
      }
    } catch (error) {
      return next(error);
    }
  },

  async updateDetails(req, res, next) {
    const updateDetailSchema = Joi.object({
      id: Joi.string().regex(mongodbIdPattern).required(),
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string().required(),
      oldblnc: Joi.number().required(),
      data: Joi.array().required(),
    });
    const { error } = updateDetailSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { id, name, username, email, oldblnc, data } = req.body;

    try {
      await User.updateOne({ _id: id }, { name, username, email });
      try {
        const detailExist = await Detail.findOne({ user: id });
        if (detailExist) {
          await Detail.updateOne({ user: id }, { data, oldblnc });
        } else {
          let userDetail;

          try {
            userDetail = new Detail({
              user: id,
              data,
              oldblnc
            });

            await userDetail.save();
          } catch (error) {
            return next(error);
          }
        }
      } catch (error) {}
    } catch (error) {
      return next(error);
    }

    return res.status(200).json({ message: "Updated Sucessfully!" });
  },
};

module.exports = controller;
