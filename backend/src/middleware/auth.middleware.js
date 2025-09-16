// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import user from "../models/User.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    const usere = await user.findById(decoded.userId).select("-password");

    if (!usere) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = usere; // attach user to request
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};



// import jwt from "jsonwebtoken";
// import user from "../models/User.js";

// export const protectedRoute = async (req,res,next) => {
//     try{
//         const token = req.cookies.jwt;

//         if(!token) {
//             res.status(401).json({message : "Unauthorized - No token Provided"});
//         }

//         const decode = jwt.verify(token,process.env.JWT_SECRETKEY);
//         if(!decode) {
//             return res.status(401).json({message : "Unauthorized - Invalid Token"});
//         }

//         const founduser = await user.findById(decode.userId).select("-password");
//         if(!founduser) {
//             return res.status(401).json({message : "Unauthorized - User Not Found"});
//         }

//         req.user = founduser;
//         next();
//     }
//     catch(error){
//         console.log(error);
//         res.status(501);
//     }
// }