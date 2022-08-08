import { Response,NextFunction } from "express";
import ErrorException from "../error/ErrorException";
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req:any, res:Response, next:NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
  
    if (!token) {
      return res.status(401).json({ 
        status: 0,
        msg: "Unauthenticated request"
      });
    }
    try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      req.auth = decoded;
    } catch (err:any) {
      if(err.name == "TokenExpiredError") {
        return res.status(401).json({ 
          status: 0,
          msg: err.message
        });
      } else {
        return new ErrorException({msg: err, status: 401}, res);
      }
    }
    return next();
  };
  
  export = verifyToken;