import { comparedPassword, hashPassword } from "../helper/userHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

//signup or say register method POST

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, role } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.send({ message: "Invalid email format" });
      }
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    } else {
      if (password.length < 6) {
        return res.send({
          message: "Password should be at least 6 characters",
        });
      }
      if (!phone) {
        return res.send({ message: "Phone is required" });
      } else {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
          return res.send({ message: "Invalid phone number format" });
        }
      }
      if (!address) {
        return res.send({ message: "Address is required" });
      }
      if (!answer) {
        return res.send({ message: "Answer is required" });
      } else {
        if (answer.length < 4 || answer.length > 12) {
          return res.send({
            message: "Answer should be between 4 and 12 characters",
          });
        }
      }
      if (!role) {
        return res.send({ message: "Role is required" });
      }
      //check if user already exist

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.send({
          success: true,
          message: "User already exist please login",
        });
      }
      //register or signup user

      const hashpass = await hashPassword(password);

      const user = await new userModel({
        name,
        email,
        phone,
        address,
        answer,
        role,
        password: hashpass,
      }).save();

      res
        .status(201)
        .send({ success: true, message: "User Registered Successfully", user });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: true, message: "Error in Signing Up", error });
  }
};

//login method POST
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({ error: "Invalid email or password" });
    }
    // check user exist or not

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email not Registered" });
    }
    //matching password validation
    const match = await comparedPassword(password, user.password);
    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Password" });
    }
    // token create
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: true, message: "Error in login  ", error });
  }
};

// forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    //validation
    const { email, newpassword, answer } = req.body;
    if (!email) {
      res.status({ success: false, message: "Email is Required" });
    }
    if (!newpassword) {
      res.status({ success: false, message: "New Password is Required" });
    }
    if (!answer) {
      res.status({ success: false, message: "Answer is Required" });
    }

    //checking
    const user = userModel.findOne({ email, answer });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Wrong Email or Answer" });
    }

    const hashed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res
      .status(200)
      .send({ success: true, message: "Password Reset Successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Something Went Wrong", error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    //password check
    if (password && password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and must be 6 character long",
      });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        email: email || user.email,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error While Updating", error });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await userModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error While Updating", error });
  }
};