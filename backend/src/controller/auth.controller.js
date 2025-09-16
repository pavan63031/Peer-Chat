import user from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

// SIGNUP
export async function signup(req, res) {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password Length Should Be Atleast 6" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const randomnumber = Math.floor(Math.random() * 100 + 1);
    const avatar = `https://avatar.iran.liara.run/public/${randomnumber}.png`;

    const newUser = await user.create({
      email,
      fullName,
      password,
      profilePic: avatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id,
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
    } catch (err) {
      console.log("Stream user error:", err.message);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

   res.cookie("jwt", token, {
  httpOnly: true,
  secure: false, // true only in production with https
  sameSite: "lax", // important for cross-site cookies
  path: "/"
});

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ message: "Email Doesn't Exist" });
    }

    const isPWDCorrect = await foundUser.comparePassword(password);
    if (!isPWDCorrect) {
      return res.status(400).json({ message: "Password is Wrong" });
    }

    const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

   res.cookie("jwt", token, {
  httpOnly: true,
  secure: false, // true only in production with https
  sameSite: "lax", // important for cross-site cookies
  path: "/"
});


    res.status(200).json({ success: true, user: foundUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// LOGOUT
export function logout(req, res) {
  res.clearCookie("jwt", { path: "/" });
  res.status(200).json({ success: true, message: "Logged out successfully" });
}

// ONBOARDING
export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { ...req.body, isOnboarded: true },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
    } catch (err) {
      console.log("Stream update error:", err.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}
