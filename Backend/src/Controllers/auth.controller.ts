import { userModel } from "../Models/user.model.js";
import type { RequestHandler } from "express";
import bcpt from "bcrypt";
import jwt from "jsonwebtoken";

export const register: RequestHandler = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (userExists) {
      return res.status(400).json({
        message: "user already exists!",
      });
    }

    const hash = await bcpt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECREAT_KEY!,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User Registered Sucessfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!password || (!username && !email)) {
      return res.status(400).json({
        message: "Password and username or email are required",
      });
    }

    const user = await userModel
      .findOne( email ? {email} : {username} )
      .select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User Not Signed In!",
      });
    }

    const isMatch = await bcpt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECREAT_KEY!,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User Loged In Sucessfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message:'User LogOut Sucessfully'
    })

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile: RequestHandler =  async (req, res) => {
    try {
        // Get the logged-in user's ID from auth middleware
        const user = await userModel.findById(req.user!.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
    }
};
