# API Endpoint #
A basic node.js/express.js api backend which is hosted on Digital Ocean.

- MongoDB as Database
- Mongoose as Schema
- Joi for form validation
- dotenv for configuration


## Setup ##
Create a file name *.env* and add these config options to it
```
APP_PORT   = 8000
DB_CONNECT = mongodb+srv://
APP_SECRET=
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
DO_S3_ACCESS_KEY_ID = 
DO_S3_SECRET_ACCESS_KEY = 
AWS_REKON_ACCESS_KEY_ID =
AWS_REKON_SECRET_ACCESS_KEY_ID=
```