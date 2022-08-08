import User from '../models/User';
import CustomError from '../error/CustomError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthController extends User {
  constructor() {
    super();
    this.token_Key = process.env.TOKEN_KEY;
  }

  register = async (req:any, res:any) => {
    try{
      let { firstname, lastname, phone, username, password } = req.body;
      let data = req.body;
      if (!(username && password && firstname && lastname)) {
        res.status(200).send("All inputs are required");
      }
      data.fullname = firstname+" "+lastname;
      data.username = username.toLowerCase();
      data.password = await bcrypt.hash(password, 10);
      let user = await this.getData({ where: 'username = ?', args: username }).then((data:any) => data[0]);
      if(user) {
        throw new CustomError("User already exist");
      }
      
      user = await this.insertData({ input: data }).then((data:any) => data[0]);
      
      const token = jwt.sign(
        { user_id: user.id, username },
        this.token_Key,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      await this.updateData({ input: {token:token}, id: user.id })
      
      delete user.password;
      delete user.token;
      res.status(200).json({ 
        status: 1,
        data: {user: user},
        token: token
      });
    } catch (e: any) {
      if(e.name != "CustomError") {
        e.message = "Something went wrong";
      }
      res.status(200).json({ 
        status: 0,
        msg: e.message
      });
    }
  }

  login = async (req:any, res:any) => {
    try{
      let { username, password } = req.body;
      if (!(username && password)) {
        throw new CustomError("All inputs are required");
      }
      username = username.toLowerCase();
      let user = await this.getData({ select: 'id, username, password, gender, phonecode, phone, firstname, lastname, fullname, nationality, status', where: 'username = ?', args: username }).then((data:any) => data[0]);

      if(user.length == 0) {
        throw new CustomError("User does not exist");
      }

      if (!await bcrypt.compare(password, user.password)) {
        throw new CustomError("Password Incorrect!");
      }
      delete user.password;
      user=JSON.parse(JSON.stringify(user));
      const token = jwt.sign(
        user,
        this.token_Key,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      await this.updateData({ input: {token:token}, id: user.id })

      return res.status(200).json({ 
        status: 1,
        token: token
      });
    } catch (e: any) {
      if(e.name != "CustomError") {
        e.message = "Something went wrong";
      }
      return res.status(401).json({ 
        status: 0,
        msg: e.message
      });
    }
  }
  // getData = async (context) => {
  //   try {
  //     if (!context.authToken) {
  //       throw new CustomError("Unauthenticated request");
  //     }
  //     let id = context.auth.id;
  //     let authToken = context.authToken;
  //     let query = "SELECT * FROM " + this.table + " WHERE id = ? AND authToken = ?";
  //     let user: any = await this.queryDB(query, [id, authToken]);
  //     if (user.length == 0) {
  //       throw new CustomError("Session logged out");
  //     }
  //     return user;
  //   } catch (e) {
  //     if (e.name != "CustomError") {
  //       notify.sendMail(e.message);
  //       e.message = "Something went wrong";
  //     }
  //     throw new CustomError(e.message);
  //   }
  // }
}
export = new AuthController;