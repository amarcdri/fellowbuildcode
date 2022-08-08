import User from '../models/Proposal';

class ProposalController extends User {
  list = async (req:any, res:any) => {
    try{
      let userId = req.auth.id;
      let proposals = await this.getData({ select:'a.*', where: 'userId = ?', other: 'ORDER BY id DESC', args: [userId] });
      res.status(200).json({ 
        status: 1,
        data: {proposals: proposals}
      });
    } catch (e: any) {
      if(e.name != "CustomError") {
        e.message = "Something went wrong";
      }
      return new Error(e.message);
    }
  }

  show = async (req:any, res:any) => {
    try{
      let userId = req.auth.id;
      let proposal = await this.getData({ select:'a.*, b.id as qpr_id, b.qpr_no', join: ' JOIN qpr b ON a.id=b.appid AND b.user_status IS NULL', where: 'userId = ?', other: 'ORDER BY id DESC', args: [userId] });
      res.status(200).json({ 
        status: 1,
        data: {proposal: proposal[0]}
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

  saveBasicInformation = (req:any, res:any) => {
    req = {input: req.body};
    let basic_information = this.insertData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {basic_information: rslt[0]}
      });
    }).catch((err: any) => setImmediate(() => { throw err; }));
  }
  // saveBasicInformation = async (req:any, res:any) => {
  //   try {
  //     req = {input: req.body};
  //     let basic_information = await this.insertData(req);
  //     console.log(basic_information);
  //     res.status(200).json({ 
  //       status: 0,
  //       data: {basic_information: basic_information[0]}
  //     });
  //   } catch (e: any) {
  //     if(e.name != "CustomError") {
  //       // notify.sendMail(e.message);
  //       // e.message = "Something went wrong";
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

export = new ProposalController;