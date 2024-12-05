import express from 'express';
import cors from 'cors';

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

export { app };