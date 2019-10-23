// impoerting different modules
const {globalVariables} = require('./config/configuration');

const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const {mongoDbUrl} = require('./config/configuration');
const {PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo")(session);
const methodOverride = require('method-override');
const {selectOption} = require('./config/customFunctions');
const fileUpload = require('express-fileupload');
const Cart = require('./models/cart');
const Product = require('./models/postModel').Product;
const { Pay } = require('./models/pay');
const _ = require('lodash');
const request = require('request');
const { initializePayment, verifyPayment } = require('./config/paystack')(request);
const bodyParser = require('body-parser');



const app = express();

// configure mongoose to connect to mongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response =>{
        console.log('mongoDB connected successfully.');
    }).catch(err =>{
        console.log('Database connection failed.');
    })


// configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(cookieParser());


// flash and session
app.use(session({
    secret: 'zacks1',
    saveUninitialized: true,
    resave: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 180 * 60 * 1000
      }


}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// global variable
app.use(flash());
app.use(globalVariables);


  

// fileupload
app.use(fileUpload());


// setup view engine to use handlebars
app.engine(
    ".hbs",
    expresshandlebars({
      defaultLayout: "default",
      helpers: {select: selectOption},
      extname: ".hbs"
    })
  );
  app.set("view engine", ".hbs");


// method override middleware
app.use(methodOverride('newMethod'));


//======================add to cart route================================================
// app.get('/add-to-cart/:id', (req, res, next) =>{
//     var productId = req.params.id;
//     var cart = new Cart(req.session.cart ? req.session.cart : {});

//     Product.findById(productId, function(err, product){
//       if (err) {
//         req.flash('error has occured');
//         return res.redirect('/');
//       }
//        cart.add(product, productId);
//        req.session.cart = cart;
//        console.log(req.session.cart);
//        res.redirect('/');
//     });
//   });




// Route grouping
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes')
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);
app.use('/payment',paymentRoutes)






//paystack callback
app.get('/paystack/callback', (req, res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error, body) => {
        if (error) {
            //handle errors appropriately
            console.log(error)
            return res.redirect('/error');
        }
        response = JSON.parse(body);

        const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.full_name']);

        [reference, amount, email, full_name] = data;

        newPay = { reference, amount, email, full_name }

        const pay = new Pay(newPay)

        pay.save().then((pay) => {
            if (!pay) {
                return res.redirect('/error');
            }
            res.redirect('/receipt/' + pay._id);
        }).catch((e) => {
            res.redirect('/error');
        })
    })
});

app.get('/receipt/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)

    Pay.findById(id).then((pay) => {
        if (!pay) {
            //handle error when the donor is not found
            res.redirect('/users/error')
        }
        console.log(pay)
        let payAmount = pay.amount/100
        req.session.cart = null
        res.render('payment/success', { pay, payAmount });
    }).catch((e) => {
        res.redirect('/users/error')
    })
})




app.listen(PORT, () =>{
    console.log(`app started at port ${PORT}`);
});