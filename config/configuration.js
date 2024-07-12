module.exports = {
    // mongoDbUrl: 'mongodb://localhost:27017/apro-tech1',
    mongoDbUrl:'mongodb+srv://coza:6045@cluster0.ikkyv.mongodb.net/pay4servicedb?retryWrites=true&w=majority',
    PORT: process.env.PORT || 4194,
    globalVariables: (req, res, next) =>{
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        res.locals.isAuthenticated = req.user ? true : false;
        res.locals.session = req.session;
        
        
        next();

    }
};
