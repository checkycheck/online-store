const Post = require('../models/postModel').Post; 
const Post2 = require('../models/postModel2').Post2;
const Ship = require('../models/ship').Ship; 
const User = require('../models/UserModel').User;
const Category = require('../models/CategoryModel').Category;
const {isEmpty} = require('../config/customFunctions');
const { Pay } = require('../models/pay');


//  function isUserAuthenticatedAmin (req, res, next){
//     if(req.isAuthenticated()){
//         next();
//     }
//     else{
//         res.redirect('/login');
//     }
   
// }




module.exports = {
    index: (req, res) =>{
        res.render('admin/index');
    },
    getPosts:  (req, res) =>{
        Post.find()
         .populate('category')
        .then(posts =>{
            res.render('admin/posts/index', {posts: posts});
        });
    },


    getUserPosts: async (req, res) =>{
        const user = await user.find();
        const posts2 = await Post2.find();
        const Categories = await Category.find();
        res.render('admin/posts/userPosts', {posts2: posts2, Categories: Categories});
    },

    
    submitPosts: (req, res) =>{

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
        



        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            file: `/uploads/${filename}`,
            price:req.body.price,
            allowComments: commentsAllowed,
            category: req.body.category
        });

        newPost.save().then(post => {
            console.log(post);
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    
    },

    createPosts: (req, res) =>{
        Category.find().then(cats => {

            res.render('admin/posts/create', {categories: cats});
        });
 
        
    },

    editPost: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
        .then(post =>{

            Category.find().then(cats =>{
                res.render('admin/posts/edit', {post: post, categories: cats});
            });

            
        });

        
    },

    editPostSubmit: (req, res) =>{
        const commentsAllowed = req.body.allowComments ? true : false;


        const id = req.params.id;


        

        Post.findById(id)
        .then(post =>{


            post.title = req.body.title;
            post.status = req.body.status;
            post.file = `/uploads/${filename}`;
            post.allowComments = req.body.allowComments;
            post.description = req.body.description;
            post.category = req.body.category;


            post.save().then(updatePost => {
                req.flash('success-message', `The Post ${updatePost.title} has been updated successfully.`);
                res.redirect('/admin/posts');

            });

        });
    
    },

    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    },

     /* ALL CATEGORY METHODS*/
    getCategories: (req, res) => {

        Category.find().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;
        console.log(categoryName);

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category); 
            });
        }

    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find();

        Category.findById(catId).then(cat => {
            res.render('admin/category/edit', {category: cat, categories: cats});
        });
    },

    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if(newTitle) {
            Category.findById(catId).then(category =>{
                category.title = newTitle;

                category.save().then(updated=> {
                    res.status(200).json({url: '/admin/category'});
                })
            });
        }
    },


    deletePost2: (req, res) => {

        Post2.findByIdAndDelete(req.params.id)
            .then(deletedPost2 => {
                req.flash('success-message', `The post ${deletedPost2.title} has been deleted.`);
                res.redirect('/');
            });
    },

    shipGet: async (req, res) =>{
        const ship = await Ship.find();

        res.render('admin/shipping/ship', {ship: ship});
    },

    payGet: async (req, res) =>{
        const pay = await Pay.find();

        res.render('admin/payment/pay', {pay: pay});
    }


    // const posts2 = await Post2.find();
    // const Categories = await Category.find();
    // res.render('admin/posts/userPosts', {posts2: posts2, Categories: Categories});



};