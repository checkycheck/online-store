const express = require("express");
const app = express();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;
const Admin = require('../models/admin').Admin;
const {isUserAuthenticated} = require("../config/customFunctions");
const bodyParser = require('body-parser');
const Post2 = require('../models/postModel2').Post2;
const path = require('path');





//===================================== start cloundinary configurations========================================================

var multer = require('multer');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'jubel', 
  api_key: '394513677318352', 
  api_secret: 'EfBk3Lz_X28ifXOvO3txvtc1Rp8'
});

//===================================== end of cloundinary configuration========================================================




const router = express.Router();

router.all('/*',  (req, res, next)=>{
  req.app.locals.layout = 'default';
  next() 
});




router.route("/")
.get(defaultController.index);


//define local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
      User.findOne({email: email}).then(user => {
        if(!user){
          Admin.findOne({email:email}).then(user =>{
            if(!user){
              return done(null, false, req.flash('error-message', 'User not found with this email'));
            }
            bcrypt.compare(password, user.password, (err, passwordMatched) =>{
              if(err){
                return err;
              }
              if(!passwordMatched){
                return done(null, false, req.flash('error-message', 'invalid username or password'));
              }
    
              return done(null, user, req.flash('success-message', 'login successful'));
            });
          })
          
        }
        bcrypt.compare(password, user.password, (err, passwordMatched) =>{
          if(err){
            return err;
          }
          if(!passwordMatched){
            return done(null, false, req.flash('error-message', 'invalid username or password'));
          }

          return done(null, user, req.flash('success-message', 'login successful'));
        });
      });
}));




passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(!user){
      Admin.findById(id, function(err, user){
        done(err, user);
      })
    }else{
      done(err, user);
    }
    
  });
});


router.route('/login')
  .get(defaultController.loginGet)
  .post(passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect:'/login',
    failureFlash: true,
    successFlash: true,
    session: true
   
  }));

router.route('/about')
  .get(defaultController.aboutPosts);

router.route('/services')
  .get(defaultController.servicesPosts);

router.route('/contact')
  .get(defaultController.contactPosts);  


  
router.route('/register')
  .get(defaultController.registerGet)
  .post(defaultController.registerPosts);

router.route('/picture')
  .post(defaultController.profilePicture);


  router.use(bodyParser.urlencoded({extended: false}));
  router.use(bodyParser.json());

router.route('/shop/ship', isUserAuthenticated)
  .get(defaultController.shipGet)
  .post(defaultController.shipPost);  

// router.route('/product')
//   .get(defaultController.productGet)
//   .get(defaultController.productPosts);


  // begining of new code

router.route('/add-to-cart/:userid', isUserAuthenticated)
  .post(defaultController.addToCartPost)
  .get(defaultController.addToCartGet);  





  router.route('/shop/shopping-cart', isUserAuthenticated)
  .get(defaultController.shoppingCartGet);  
// end of new code




router.route('/dashboard')
  .get(defaultController.dashboardGet);


router.route('/profile')  
  .get(defaultController.profileGet)
  .post(defaultController.profilePost);


router.route('/logout')
 .get(defaultController.logoutGet);  

  


 router.route('/posts/', isUserAuthenticated)
 .get(defaultController.getPosts);
 


router.route('/posts/create/')
 .get(defaultController.createPosts)
 .post(defaultController.submitPosts);


// user: req.body.user,
    //         allowComments: commentsAllowed,
    //         category: req.body.category


//  router.route('/posts2/create2/', upload.single('picture'))
//  .get(defaultController.createPosts2)
//  .post( upload.single('picture'),function (req, res, next) {
//   console.log('consoling req.body::', req.body)
//   cloudinary.v2.uploader.upload(req.file.path,  async (err, result) =>{
//       console.log('consoling cloud result::',result)
//       let { title, status, picture, price, description, creationDate, user,  allowComments, category } = req.body;
//       var image = result.secure_url;
//       let newPost2 = new Post2({ title, status, picture, price, description, creationDate, user, allowComments, category })
//       console.log(newPost2)
//       await newPost2.save().then(post2 =>{
//           console.log('consoling promise return::',post2)
//           req.flash('success', 'post created successfully')
//           res.redirect('/') 

//         });
//       });
//     });

router.route('/posts2/edit2/:id', isUserAuthenticated)
 .get(defaultController.editPost2)
 .put(defaultController.editPostSubmit2);


// router.route('/profile/edit')
//   .put(defaultController.editProfile);

router.route('/editprofile/:id')
  .get(defaultController.editprofileGet)
  .put(defaultController.editprofilePut);  
  

router.route('/posts/delete/:id', isUserAuthenticated)
 .delete(defaultController.deletePost);     



 router.route('/mailchimp')
 .post(function(req, res){
  addEmailToMailchimp(req.body.email)
  console.log(req.body.email);
 
});


function addEmailToMailchimp(email){
var request = require("request");

var options = { method: 'POST',
  url: 'https://us5.api.mailchimp.com/3.0/lists/bd540b6555/members',
  headers: 
   { 'cache-control': 'no-cache',
     Connection: 'keep-alive',
     Cookie: '_AVESTA_ENVIRONMENT=prod; _mcid=1.2c44858818cc95873ea97b9a9f2bdffe.945795d13273c6b97275ee641b073a0fb97ebdb0184184d8ac9be458a35ad7cb',
     'Content-Length': '65',
     'Accept-Encoding': 'gzip, deflate',
     Host: 'us5.api.mailchimp.com',
     'Postman-Token': '59c8cbb4-2590-4918-b4dd-8269d45e3208,8d65d8a4-4b15-4e2b-a4f4-a511c8cc6394',
     'Cache-Control': 'no-cache',
     Accept: '*/*',
     'User-Agent': 'PostmanRuntime/7.19.0',
     Authorization: 'Basic ZXN0b3Jlc21haWxlcjpiOTRlZGYxOWNmNzljZjYzODA2NDFiNGE3MzA1ODE3Mi11czU=',
     'Content-Type': 'application/json' },
  body: { email_address: email, status: 'subscribed' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
}




  module.exports = router;