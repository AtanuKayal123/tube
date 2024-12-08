import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// create express app
const app = express(); 



// common middlewares for all routes 
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    }));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({ 
    extended: true,
    limit: '50mb'
}));

app.use(express.static('public'));

app.use(cookieParser()); // cookie parser middleware 

// import routes 
import healthcheckRouter from './routes/healthcheck.route.js'; 
import userRouter from './routes/user.route.js';


// use routes
app.use('/api/v1/healthcheck', healthcheckRouter); 
app.use('/api/v1/users', userRouter);

//app.use(errorHandler); // error handler middleware 

export { app };