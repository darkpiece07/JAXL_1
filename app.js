const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const exphbs = require('express-handlebars');
const LocalStorage = require('node-localstorage').LocalStorage;

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine({ extname: "hbs", defaultLayout: false, layoutsDir: "views/ " }));
app.set('view engine', 'handlebars');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));


localStorage = new LocalStorage('./scratch');


app.get('/', (req, res) => {

  const preEmail = localStorage.getItem('email');

  if (preEmail) {
    res.render('success', {email: preEmail});
  }
  else {
  
    res.render('contact');
  }

});

var email;

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

console.log( "OTP : ", otp);

app.post('/send',  (req, res)=> {

  email = req.body.email;

  res.status(200);
  res.render('otp', { msg: "OTP has been sent!", email });
  
});

app.post('/signout', (req, res) => {

  localStorage.clear();
  res.render('contact');  
  
})

app.post('/verify',  (req, res) => {

  if (req.body.otp == otp) {
    //localStorage.setItem('email', 'ashish07@gmail.com')
    res.status(200);
    res.render('success', {email : req.body.email})
  }
  else {
    res.status(400);
    res.render('otp', { msg: 'OTP is incorrect, Please try again!' });
  }

});

app.post('/resend',  (req, res) => {

  email = req.body.email;
  console.log(email);
  res.status(200);
  res.render('otp', { msg: "OTP has been sent!", email });

});

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
