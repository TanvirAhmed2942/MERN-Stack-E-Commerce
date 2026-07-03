import User from "../models/user.model.js";
import { redis_client as Redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";


const generateToken = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  return { accessToken, refreshToken };
};


const storeRefreshToken = async (userId, refreshToken) => {
  console.log(`Storing refresh token for userId: ${userId}`);
  await Redis.set(`refreshToken:${userId}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // Store for 7 days
  console.log(`Refresh token stored for userId: ${userId} executed`);
}


const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
};

export async function signup(req, res) {
  // res.send("User registered successfully");
  const { username, email, password } = req.body;
  console.log("Received signup request:", { username, email, password });
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name: username, email, password });
    await user.save();
    const {accessToken,refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ message: `User registered successfully`,user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, token: { accessToken, refreshToken } });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: `Error during signup: ${error.message}` });
  }
}
export async function login(req, res) {
  try{
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const {accessToken,refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    // user.isLoggedIn = true;
    // await user.save();
    res.status(200).json({ message: "User logged in successfully", user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isLoggedIn: user.isLoggedIn,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }});


  }catch(error){
    console.error("Error during login:", error);
    res.status(500).json({ message: `Error during login: ${error.message}` });
  }
}

export async function logout(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token not found" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const userId = decoded.userId;
    await Redis.del(`refreshToken:${userId}`);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  } 
}

export async function accessTokenbyRefreshToken(req, res) {
  try{
  const { refreshToken } = req.cookies;
  console.log("Received refresh token request:", { refreshToken });
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token not found" });
  }
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const userId = decoded.userId;
  const storedRefreshToken = await Redis.get(`refreshToken:${userId}`);
  if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  setCookies(res, accessToken, refreshToken);
  res.status(200).json({ message: "Access token retrieved successfully", accessToken });
}catch(error){
    console.error("Error during accessTokenbyRefreshToken:", error.message);
    res.status(500).json({ message: "Error during accessTokenbyRefreshToken : " + error.message });
  }
}