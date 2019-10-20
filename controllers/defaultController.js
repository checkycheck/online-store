const Post2 = require('../models/postModel2').Post2;
const Category = require('../models/CategoryModel').Category;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;
const Ship = require('../models/ship').Ship;
const Cart = require('../models/cart');
const Post = require('../models/postModel').Post;
const {isEmpty} = require('../config/customFunctions');
const {isUserAuthenticated} = require("../config/customFunctions");
const _ = require('lodash');
const bodyParser = require('body-parser');
const request = require('request');



module.exports = {
    index: async (req, res)=>{
        
        const users = await User.find();
        const posts2 = await Post2.find();
        const posts = await Post.find();
        const Categories = await Category.find();    Categories:Categories, 

    res.render('default/index', {posts: posts, posts2: posts2, users:users});
    },
    aboutPosts: (req, res) =>{
        res.render('default/about');
    },
    servicesPosts: (req, res) =>{
        res.render('default/services');
    },
    contactPosts: (req, res) =>{
        res.render('default/contact');
    },
    loginGet: (req, res) =>{
        res.render('default/login', {message: req.flash('error') });
    },
    // loginPost: (req, res) =>{
    //     res.render('default/login');
    // },
    registerGet: (req, res) =>{
        res.render('default/register');
    },
    shipGet: (req, res) =>{
        res.render('default/shop/ship');
    },
    shipPost: (req, res) => {
        let errors = [];

        // if(!req.body.firstName) {
        //     errors.push({message: 'first name is mandetory'});
        // }
        // if(!req.body.lastName) {
        //     errors.push({message: 'last name is mandetory'});
        // }
        // if(!req.body.email) {
        //     errors.push({message: 'email is mandetory'});
        // }
        if(!req.body.number) {
            errors.push({message: 'phone number not match'});
        }
        if(!req.body.address) {
            errors.push({message: 'address not match'});
        }

        // router.use(bodyParser.urlencoded({extended: false}));
        // router.use(bodyParser.json());

        // =========================new code =================================================

        // if(
        //     req.body.captcha === undefined ||
        //     req.body.captcha === '' ||
        //     req.body.captcha === null
        // ){
        //     return res.json({"success": false, "msg":"please select captcha"});
        // }

        // secret key
        // const secretKey = '6LdOBL4UAAAAAKAzd1XC9lnuOrybVZpa1GbxdRgg';


        // verify URL
        // const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=$
        // {secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

        // make request to verifiyURL
        // request(verifyUrl, (err, response, body) =>{
        //     body = JSON.parse(body);
        //     console.log(body);

            // if not successful
            // if(body.success !== undefined && !body.success){
            //     return res.json({"success": false, "msg":"failed captcha verification"});
            // }

            // if successful

        //     const newShip = new Ship(req.body);
        //     newShip.save().then(ship => {
        //         req.flash('success-message', 'shipping address save successfully');
        //         res.redirect('/payment/checkout');
        //     });
        // });







// =====================previous code====================================================================
        const newShip = new Ship(req.body);
        newShip.save().then(ship => {
            req.flash('success-message', 'shipping address save successfully');
            res.redirect('/payment/checkout');
        });


    },
    registerPosts: (req, res) =>{
        let errors = [];

        if(!req.body.firstName) {
            errors.push({message: 'first name is mandetory'});
        }
        if(!req.body.lastName) {
            errors.push({message: 'last name is mandetory'});
        }
        if(!req.body.email) {
            errors.push({message: 'email is mandetory'});
        }
        if(req.body.password != req.body.passwordConfirm) {
            errors.push({message: 'password not match'});
        }


        if(errors.length > 0) {
            res.render('default/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                usertype: req.body.usertype
                

            });
            console.log(errors);
        }

        else{
            User.findOne({email: req.body.email}).then(user => {
                if(user){
                    req.flash('error-message', 'email already exists try to login');
                    res.redirect('/login');
                }
                else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'you are now registered');
                                res.redirect('/login');
                            });

                        });
                    });
                }
            })
        }


    },
    productGet:(req, res) =>{
        //begining new code
            //   Post.find((err, docs) =>{
            //     var productChunks = [];
            //     var chunkSize = 3;
            //     for(var i = 0; i < docs.length; i += chunkSize){
            //       productChunks.push(docs.slice(i, i + chunkSize));
            //     }
            //     res.render("default/product", { title: 'shopping cart', products: productChunks});
            //   }); 
        // end of new code
    },
    // productPosts: async (req, res) =>{

    //     const posts = await Post.find();
    //     const Categories = await Category.find();

    //     res.render('default/product', {posts: posts, Categories:Categories });
    // },

    addToCartGet: (req, res) =>{
        var productId = req.params.userid;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
    
        Post.findById(productId, function(err, post){
          if (err) {
            req.flash('error has occured');
            return res.redirect('/');
          }
           cart.add(post, productId);
           req.session.cart = cart;
           console.log(req.session.cart);
           res.redirect('/');
        });
        
    },
    addToCartPost: (req, res) =>{
       
    },

    shoppingCartGet: (req, res, next) => {
        if(!req.session.cart){
          return res.render('default/shop/shopping-cart', {posts: null});
        }
        var cart = new Cart(req.session.cart);
        res.render('default/shop/shopping-cart', {posts: cart.generateArray(), totalPrice: cart.totalPrice});
      },

      dashboardGet: (req, res) =>{
          if(req.user.usertype === 'admin'){
              return res.redirect('/admin')
          }
          else if(req.user.usertype === 'user'){
              return res.redirect('/profile')
          }
          else{
             req.flash('error', 'no user found');
             return  res.redirect('back')
          }
       
    },  

    profileGet: (req, res) =>{

        res.render('default/profile', {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
        });
    },

    logoutGet: (req, res) =>{
        req.logout();
        req.flash("success", "See you later!")
        res.redirect("/");
    },


    // user product posts


    getPosts2:  (req, res, next) =>{
        console.log('USER IS', req.user._id);
        // console.log('POST USER ID', _.filter(Post2) );


        Post2.find({user: req.user}, function (err, posts2){
            if(err){
                return req.flash('error', 'problem finding this page');
            }
       
            res.render('default/posts2/index2', {posts2: posts2});
        })

   
        


        // ==========old previous code ===========================
        
    //    Post2.find()
    //      .populate('category')
    //     .then(posts2 =>{
    //         console.log('POST USER ID', _.mapKeys(posts2, 'user') );
    //             res.render('default/posts2/index2', {posts2: posts2});
    //     });
    },
  

    submitPosts2:  async (req, res) =>{

        const commentsAllowed = req.body.allowComments ? true : false;
     
        // check for new file
        let fileName = '';

        if(!isEmpty(req.files)){
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if(err)
                    throw err;
            });
        }
        
    

    //    =================================================== PREVIOUS FUNTIONAL CODE ====================================================

       const  newPost2 = new Post2({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            file: `/uploads/${filename}`,
            price:req.body.price,
            user: req.body.user,
            allowComments: commentsAllowed,
            category: req.body.category
           
        });

        


       await newPost2.save().then(post2 => {
            console.log('POSTS',post2);
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/posts2');
        });


        // user.Posts2.push(newPost2);
        // await user.save();

    
    },

    createPosts2: (req, res) =>{
        // console.log('REQ_post', req.post2);

//  ===========previous code===========================================
        Category.find().then(cats => {
            res.render('default/posts2/create2', {categories: cats});
        });

    },

    editPost2: (req, res) => {
        const id = req.params.id;

        Post2.findById(id)
        .then(post2 =>{

            Category.find().then(cats =>{
                res.render('default/posts2/edit2', {post2: post2, categories: cats});
            });

            
        });

        
    },

    editPostSubmit2: (req, res) =>{
        const commentsAllowed = req.body.allowComments ? true : false;


        const id = req.params.id;

        Post2.findById(id)
        .then(post2 =>{

            post2.title = req.body.title;
            post2.status = req.body.status;
            post2.imagePath = req.body.imagePath;
            post2.allowComments = req.body.allowComments;
            post2.description = req.body.description;
            post2.category = req.body.category;


            post2.save().then(updatePost2 => {
                req.flash('success-message', `The Post2 ${updatePost2.title} has been updated.`);
                res.redirect('/default/posts2');

            });

        });
    
    },

    deletePost2: (req, res) => {

        Post2.findByIdAndDelete(req.params.id)
            .then(deletedPost2 => {
                req.flash('success-message', `The post ${deletedPost2.title} has been deleted.`);
                res.redirect('/posts2');
            });
    },
    
}