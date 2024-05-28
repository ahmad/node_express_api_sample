import { config } from 'dotenv';
import mongoose from "mongoose";
import morgan from "morgan";
import fs from "fs";
import path from "path";

import { AppValidator } from './middleware/app_validator';
import { EventValidator } from './middleware/event_validator';
import { TokenValidator } from './middleware/token_validator';
import { NextFunction, Request, Response } from 'express';


const cors = require("cors");
const express = require("express");

config();

const app = express();
const { APP_PORT, DB_CONNECT } = process.env;

if (!APP_PORT){
	throw new Error("Please ensure that APP_PORT is defined in your .env file.");
}

if (!DB_CONNECT){
	throw new Error("Please ensure that DB_CONNECT is defined in your .env file.");
}

mongoose.set('strictQuery', true);
mongoose
.connect(DB_CONNECT)
.then(e => {
	console.log("Connected to database.");
	app.listen(APP_PORT, () => {
		console.log(`Listening at http://localhost:${APP_PORT}`);
	});
})
.catch(e => {
	console.error(`Unable to connect to database: ${DB_CONNECT}`);
});

// Allow cross origin
app.use(cors());

// morgan logging file
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan("common", { stream: accessLogStream }));

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// middleware
function handleError(middleware: any, req: Request, res: Response, next: NextFunction) {
	middleware(req, res, (err: any) => {
		if (err) {
			return res.status(400).json({
				message: "Invalid JSON supplied"
			});
		}
		next();
	});
}

app.use((req: Request, res: Response, next: NextFunction) => {
	handleError(express.json({
		limit: 10000000
	}), req, res, next);
});


// public routes
app.use('/', [], require("./routes/auth"));
app.use('/app/message', require("./routes/apps/text_messages"));


// auth token is required after here
app.use(TokenValidator);

app.use('/', require("./routes/account"));

app.use('/documents', require("./routes/documents"));
app.use('/events', require("./routes/events"));
app.use('/apps', require("./routes/client_apps"));
app.use('/apps/:appId/users', [AppValidator], require("./routes/apps/app_users"));
// app.use('/events/:eventId/rooms', [EventValidator], require("./routes/tracking/rooms"));
// app.use('/events/:eventId/faces', [EventValidator], require("./routes/faces"));
app.use('/events/:eventId/emails', [EventValidator], require("./routes/emails"));
// app.use('/events/:eventId/keys', [EventValidator], require("./routes/keys"));
app.use('/events/:eventId/leads', [EventValidator], require("./routes/leads"));
// app.use('/events/:eventId/sessions', [EventValidator], require("./routes/sessions"));
// app.use('/events/:eventId/invites', [EventValidator], require("./routes/invite"));

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).json({message: "Endpoint not found.", endpoint: req.url, method: req.method});
});

process.on('uncaughtException', function(err) {
	console.log("App crashed: ", err.message);
});