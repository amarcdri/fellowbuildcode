import User from '../models/User';
import authController from './AuthController';

class UserController extends User {
  list = async (req:any, res:any) => {
    try{
      // await authController.getData(context);
      let users = await this.getData({ 'other': 'ORDER BY id DESC' });
      res.status(200).json({ 
        status: 1,
        data: {users: users}
      });
    } catch (e: any) {
      if(e.name != "CustomError") {
        e.message = "Something went wrong";
      }
      return new Error(e.message);
    }
  }

  // getUser = async (parent, req, context) => {
  //   try {
  //     await authController.getData(context);
  //     return this.getData({
  //       where: 'id = ?',
  //       args: [req.id]
  //     }).then(data => data[0]);
  //   } catch (e) {
  //     if(e.name != "CustomError") {
  //       notify.sendMail(e.message);
  //       e.message = "Something went wrong";
  //     }
  //     return new Error(e.message);
  //   }
  // }

  // addUser = async (parent, req, context) => {
  //   try {
  //     // await authController.getData(context);
  //     if (req.input.password) {
  //       req.input.password = passwordHash.generate(req.input.password);
  //     }
  //     let user = await this.insertData(req).then(data => data[0]);
  //     let profile = new Profile();
  //     profile = await profile.insertData({input:{userId: user.id}});
  //     user.profile = {
  //       id: profile.insertId
  //     }
  //     return user;
  //   } catch (e) {
  //     if(e.name != "CustomError") {
  //       notify.sendMail(e.message);
  //       e.message = "Something went wrong";
  //     }
  //     return new Error(e.message);
  //   }
  // }

  // updateUser = async (parent, req, context) => {
  //   try {
  //     await authController.getData(context);
  //     return this.updateData(req).then(data => data[0]);
  //   } catch (e) {
  //     if(e.name != "CustomError") {
  //       notify.sendMail(e.message);
  //       e.message = "Something went wrong";
  //     }
  //     return new Error(e.message);
  //   }
  // }

  // deleteUser = async (parent, req, context) => {
  //   try {
  //     await authController.getData(context);
  //     return this.deleteData(req).then(data => data);
  //   } catch (e) {
  //     if(e.name != "CustomError") {
  //       notify.sendMail(e.message);
  //       e.message = "Something went wrong";
  //     }
  //     return new Error(e.message);
  //   }
  // }
}

export = new UserController;