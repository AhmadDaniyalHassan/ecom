import { comparedPassword, hashPassword } from "../helper/userHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import { createTransport } from "nodemailer";
//signup or say register method POST

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, role } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || emailRegex.test(email)) {
      return res.send({
        message: "Email is required or format is not accurate",
      });
    }

    if (!password) {
      return res.send({ message: "Password is required" });
    } else {
      if (password.length < 6) {
        return res.send({
          message: "Password should be at least 6 characters",
        });
      }
      const phoneRegex = /^\d{11}$/;
      if (!phone || phoneRegex.test(phone)) {
        return res.send({ message: "Phone is required" });
      }

      if (!address || address.length < 10) {
        return res.send({
          message: "Address is required or its not 10 character long",
        });
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

    // Check if the user is active
    if (!user.active) {
      return res.status(403).send({
        success: false,
        message: "User is disabled and cannot log in",
      });
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
        _id: user._id,
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
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate a reset code (you can use a library like 'crypto' for this)
    const resetCode = generateResetCode();

    // Store the reset code and its expiration in the user document
    user.resetCode = resetCode;
    user.resetCodeExpiration = Date.now() + 3600000; // 30 minute (adjust as needed)
    await user.save();

    // Send a password reset email with the reset code
    const transporter = createTransport({
      host: process.env.SMTP,
      port: process.env.PORTS,
      secure: false,
      auth: {
        user: process.env.USER,

        pass: process.env.PASSED,
      },
    });

    const mailData = {
      from: process.env.MYEMAIL,
      to: email,
      subject: "Password Reset Request",
      text: `Your password reset code is: ${resetCode}`,
      // You can also include an 'html' property for an HTML email.
    };

    await transporter.sendMail(mailData);

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something Went Wrong", error });
  }
};

// Example of a function to generate a reset code
function generateResetCode() {
  const code = Math.random().toString(36).substring(2, 8); // Generate a 6-character code
  return code;
}

export const resetPasswordController = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, Reset Code, and New Password are required",
      });
    }

    // Check if the user with the provided email exists
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Check if the reset code matches and has not expired
    if (user.resetCode !== resetCode || user.resetCodeExpiration < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset code" });
    }

    // Generate a new hashed password
    const hashed = await hashPassword(newPassword);

    // Update the user's password and clear the reset code and expiration
    user.password = hashed;
    user.resetCode = undefined;
    user.resetCodeExpiration = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something Went Wrong", error });
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
    const orders = await orderModel
      .find({ purchaser: req.user._id })
      .populate("products")
      .populate("purchaser", "name email");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error While Getting Orders", error });
  }
};
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products")
      .populate("purchaser", "name address email phone quantity")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting All Orders",
      error,
    });
  }
};

export const getAllOrdersCODController = async (req, res) => {
  try {
    const codOrders = await Order.find({ "payment.method": "Cash On Delivery" })
      .populate("products")
      .populate("purchaser", "name address email phone quantity")
      .sort({ createdAt: "-1" });

    res.json(codOrders);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting COD Orders",
      error,
    });
  }
};

export const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Orders Status",
      error,
    });
  }
};

export const getUserController = async (req, res) => {
  try {
    const users = await userModel
      .find({ role: 0 })
      .select("name address createdAt phone email");
    res.status(200).send({
      success: true,
      message: "Fetching User Succesfull",
      users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Fetching Users" });
  }
};

export const getActiveAdminUsersController = async (req, res) => {
  try {
    const loggedInAdminUserId = req.params.userId; // Get the logged-in admin user's ID
    const users = await userModel
      .find({ role: 1, active: true, _id: { $ne: loggedInAdminUserId } }) // Exclude the logged-in admin user
      .select("name address createdAt active phone email");
    res.status(200).send({
      success: true,
      message: "Fetching Active Admin Users Successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Fetching Users" });
  }
};

export const toggleAdminController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // If the user is an admin
    if (user.role === 1) {
      if (user.active) {
        // Toggle the "active" status for admin users
        user.active = !user.active;
        await user.save();
        res.status(200).send({
          success: true,
          message: `Admin status for user with ID ${userId} has been toggled`,
        });
      } else {
        // If the admin is disabled, enable them
        user.active = true;
        await user.save();
        res.status(200).send({
          success: true,
          message: `Admin user with ID ${userId} has been enabled`,
        });
      }
    } else {
      res.status(403).send({ success: false, message: "Unauthorized Access" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error toggling admin status" });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndDelete(userId);
    res.status(200).send({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Deleting Users" });
  }
};

export const deleteOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findByIdAndDelete(orderId);
    res.status(200).send({
      success: true,
      message: "Order Deleted Successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, error, message: "Error In Deleting Orders" });
  }
};
