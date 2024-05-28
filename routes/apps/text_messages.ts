import { SMSForm } from "../../forms/sms_forms";
import express, { Request, Response } from "express";

const accountId = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// import { SendEmail } from "../../models/actions/send_email";

const client = require('twilio')(accountId, authToken);

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { value, error } = SMSForm.validate(req.body);
    if (error){
        return res.status(400).json(error.details[0]);
    }

    const { type, to, message } = value;

    if (type === "SMS"){

            client.messages.create({
                'body': message,
                'from': '+18883047008',
                'to': `+1${to}`
            })
            .then((msg:any) => res.json(msg))
            .catch((err: any) => {
                if (err.code === 21408){
                    return res.status(400).json({
                        message: "Permission to send an SMS has not been enabled for the region indicated by the 'To' number"
                    })
                } else {
                    return res.status(400).json({
                        code: err.code,
                        message: "Unable to send SMS"
                    })
                }
            })
        
    } else {
        return res.status(400).json({
            message: "Invalid request!"
        })
    }

});


module.exports = router;