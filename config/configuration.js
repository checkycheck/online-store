module.exports = {
    // mongoDbUrl: 'mongodb://localhost:27017/apro-tech1',
    mongoDbUrl:'mongodb://aprotech:1256@cluster0-shard-00-00-20i6o.mongodb.net:27017,cluster0-shard-00-01-20i6o.mongodb.net:27017,cluster0-shard-00-02-20i6o.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
    PORT: process.env.PORT || 4002,
    globalVariables: (req, res, next) =>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        res.locals.isAuthenticated = req.user ? true : false;
        res.locals.session = req.session;
        
        
        next();

    }
};