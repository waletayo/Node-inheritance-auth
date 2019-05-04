import express from 'express';
import logger from 'morgan';
import bodyParser from "body-parser";
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from 'config';
import register from '../api/auth/register/register.route';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(register)
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.set('port', config.get('app.port'));
app.use(bodyParser.urlencoded({extended: false}));

// development error handler
// will print stacktrace
export default app;
