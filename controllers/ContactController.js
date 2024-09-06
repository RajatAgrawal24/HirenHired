const Contact = require("../models/contact.model.js");
const nodemailer = require("nodemailer");

class ContactController {
  static getInTouch = async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      const contactUser = await Contact.create({
        name,
        email,
        subject,
        message,
      });
      if (!contactUser) {
        return res.send({ success: false,message:"Contact not registered in database" });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "",
          pass: "",
        },
      });

      const mailOptions = {
        from: '"Your Name" <your-email@gmail.com>',
        to: "recipient@example.com",
        subject: "HirenHired",
        html: `<h1>Welcome to Our Service ${name}</h1>
    <p>We're glad to have you here.</p>`,
        text: "Thankyou for connecting with us",
      };

      const info = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
           return res.send({ success: false,message:"Email not sent to contact establisher" });
        }
        console.log("Message sent: %s", info.messageId);
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
      return res.send({success:false, message:"Error while sending email"})
    }
  };
}

module.exports = ContactController;
