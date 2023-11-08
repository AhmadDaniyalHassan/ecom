import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//auth access to specific Routing
export const verifyToken = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;

    return next();
  } catch (error) {
    console.log(error);
  }
};

//admin access

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (user.role !== 1 || !user.active) {
      return res
        .status(403)
        .send({ success: false, message: "Unauthorized Access" });
    }

    // If the admin is trying to disable another admin, they need to be an active admin
    if (req.path.includes("/disable-admin/")) {
      const targetUserId = req.params.userId;
      const targetUser = await userModel.findById(targetUserId);

      if (targetUser && targetUser.role === 1 && targetUser.active) {
        next();
      } else {
        return res
          .status(403)
          .send({ success: false, message: "Unauthorized Access" });
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .send({ success: false, error, message: "ؑError in Admin Middleware" });
  }
};
