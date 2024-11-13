const morgan = require('morgan');

module.exports = function(app) {
    //the unhandledRejection event is called when a promise/async method throws an exception
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    if (app.get('env') === 'development'){
        app.use(morgan('tiny'));
    }

    if (!process.env.JWT_KEY){
        throw new Exception("FATAL ERROR: JWT_KEY is not defined!");
    }

    app.set('view engine', 'pug');
    app.set('views', './views');
}