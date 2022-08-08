import nodemailer from 'nodemailer';

class Email {
  private transporter;
  private mailOptions;
  constructor(param: any) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
      }
    });
    
    this.mailOptions = {
      from: param.from,
      to: param.to,
      subject: param.subject,
      text: param.text
    };
  }

  sendMail = (msg:any) => {
    if(msg) {
      this.mailOptions.text = msg;
    }
    this.transporter.sendMail(this.mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Error notified to admin');
      }
    });
  }
}

export = Email;