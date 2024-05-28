const squirrelly = require("squirrelly");
const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// recipient { name: "", "email": "" }
// emailInfo { "email.config" }
export const SendEmail = async (recipient: Object, emailInfo: Object) => {
	const msg = {
		// to: '9086929024@vzwpix.com', // Change to your recipient
		to: '9086929024@vtext.com',
		from: 'noreply@globaldatacapture.com', // Change to your verified sender
		subject: 'Chase NADA 2024',
		text: '\n\n\nAnother Text Message Being Sent',
		// html: '<strong>and easy to do anywhere, even with Node.js</strong>',
	}

	sendgrid
		.send(msg)
		.then((response: any) => {
			console.log(JSON.stringify(response));
		})
		.catch((error: any) => {
			console.log("error", JSON.stringify(error));
		});

}

export const ParseEmailTemplate = (template: any, replacements: any) => {
	console.log(template, replacements);
	return squirrelly.render(template, replacements);
}