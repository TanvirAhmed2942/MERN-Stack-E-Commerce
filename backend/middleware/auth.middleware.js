import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute =async (req, res, next) => {
    console.log("Protect Route Middleware - 1");
    try{
        const {accessToken} = req.cookies;
        console.log("Access Token:", accessToken);
        if(!accessToken)
        {
            return res.status(401).json({message: "Unauthorized - No token provided"});
        }
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        const user = await User.findById(decoded.userId).select("-password");
        if(!user)
        {
            return res.status(401).json({message: "Unauthorized - User not found"});
        }
        req.user = user;
        console.log("User attached to request:", req.user);
        next();
    }catch(error)
        {
            res.status(401).json({message: "Unauthorized"});
        }
}

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden for " + req.user.role + " || " + "Allowed roles: " + roles.join(", ")
            });
        }

        next();
    };
};

