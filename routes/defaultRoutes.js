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
  .get(defaultController.profileGet);


router.route('/logout')
 .get(defaultController.logoutGet);  

  


 router.route('/posts2/', isUserAuthenticated)
 .get(defaultController.getPosts2);
 


router.route('/posts2/create2/')
 .get(defaultController.createPosts2)
 .post(defaultController.submitPosts2);

router.route('/posts2/edit2/:id', isUserAuthenticated)
 .get(defaultController.editPost2)
 .put(defaultController.editPostSubmit2);


router.route('/posts2/delete2/:id', isUserAuthenticated)
 .delete(defaultController.deletePost2);     


  module.exports = router;