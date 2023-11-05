const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const notInJSON = [
  "Device-Type",
  "Sales-Unit",
  "teamviewer_alies",
  "final_cost_center",
  "final_investment_number",
  "floorScan1200x800",
  "floorScan800x600",
  "shelfScan",
  "labelScan",
  "powerCharger",
  "tAdapter",
  "extensionCable15m",
  "extensionCable3m",
  "blockingTime",
];

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  let jsonforAttachment={};
  let jsonforText={};
  //Filter the data
  for (const [key, value] of Object.entries(req.body)) {
    if (notInJSON.includes(key)) {
        console.log(value,key);
      jsonforText[key] = value ? value : "";
      console.log(value);
    } else {
      jsonforAttachment[key] = value ? value :"";
    }
  }

  // Compose the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "raey@otto-id.com",
    subject: "New Data from Boellhoff",
    text: `Hello Tobias,\n\n\
Please find the attached and following data.\n\
    ${JSON.stringify(jsonforText,null,2)}\n\n\
Have a great day!😊`,
    attachments: [
      {
        filename: "data.json", 
        content: JSON.stringify(jsonforAttachment,null,2), 
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.sendFile(__dirname + "/error.html");
    } else {
      res.sendFile(__dirname + "/thanks.html");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
