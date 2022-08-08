import Email from "../library/Email";

class ErrorException {
  constructor(param: any, res: any) {
    this.error(param, res);
  }
  error = (param: any, res: any) => {
    let msg = param.msg;
    let status = param.status ?? 200;
    if(process.env.ENVIRONMENT == "production") { 
      let email = new Email({
        from: process.env.MAIL_ERROR_FROM,
        to: process.env.MAIL_ERROR_TO,
        subject: process.env.MAIL_ERROR_SUBJECT,
        text: process.env.MAIL_ERROR_DEFAULT_TEXT
      });
      email.sendMail(msg);
      msg = "Something went wrong";
    }
    res.status(status).json({
      status: 0,
      msg: msg,
      type: "error",
    });
  }
}

export = ErrorException;