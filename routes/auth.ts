import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/user";
import { Token } from "../models/token";
import { TokenValidator } from "../middleware/token_validator"
import { PasswordReset } from "../models/password_reset";
import { ChangeEmailForm, ChangePasswordForm, ForgotPassword, LoginForm, RegisterForm, ResetPassword, UpdateProfileForm } from "../forms/user_forms";
import { generateRandomToken } from "../utils/helpers";
import { ClientModel } from "../models/client";

const router 			= express.Router();
const { APP_SECRET } 	= process.env;

if (!APP_SECRET){
	throw new Error("Please ensure that APP_SECRET is defined in your .env file");
}


const UserRoutes 	= {
	registerAction:  (req: Request, res: Response) => {
		
		// 1 Validate, 2 check if email exists, 3 hash password, 4 create company, 5 add user, 6 update company with user, return user.

		// Step 1: Validate data provided.
		let {error, value: userInfo} = RegisterForm.validate(req.body);

		if (error) return res.status(400).json({
			error: true,
			message: error.details[0].message
		});


		// Step 2: Check if email already exists in database.
		User.findOne({"email": userInfo.email}, (err: any, userFound: any) => {
			if (err) return res.status(500).json({
				message: "Unable to create user"
			});

			// user account already exists.
			if (userFound !== null){
				return res.status(409).json({
					message: "A user with that email address already exists."
				});
			} else {

				// Step 3: Hash password
				bcrypt.hash(userInfo.password, 10, (err: any, hash: any) => {
					if (err) return res.status(400).json({
						message: err.string
					});


					// Step 4: Create company
					const client = new ClientModel({
						name: userInfo.company
					});

					client.save((err: any, clientInfo: any) => {
						if (err) return res.status(500).json({
							message: err.message
						});

						const { _id, name } = clientInfo;

						
						// Step 5: Create user
						userInfo.password = hash; // Update password with the hashed version
						userInfo.company = { _id, name }
						
						const user = new User(userInfo);
						user.save((err: any, newUser: any) => {
							if (err) return res.status(400).json({
								error: true,
								message: err.message 
							});


							// Step 6: Update company with user info
							ClientModel.findByIdAndUpdate(_id, {
								user: {
									_id: newUser._id,
									name: newUser.name,
								}
							}, { new: true }, (err: any, updatedClient: any) => {
								if (err) return res.status(500).json({
									message: "Unable to update company with user info."
								});

								// Step 7: return new user data without password.
								const { password, passwordChangedAt, __v, ...newUserData } = newUser._doc;
								return res.json(newUserData);
							});
						});
					});
				});
			}
		});
	},

	loginAction: (req: Request, res: Response) => {
		const {error, value: loginInfo} = LoginForm.validate(req.body);

		if (error) return res.status(400).json({
			error: true,
			message: error.details[0].message
		});

		User.findOne({ email: loginInfo.email }, (err: any, user: any) => {
			if (err) return res.status(500).json({
				message: 'Unable to communicated with database.'
			});

			if (!user) return res.status(404).json({
				message: "No account was found matching the provided information."
			});

			bcrypt.compare(loginInfo.password, user.password, async (err: any, matched: any) => {
				if (err) return res.status(500).json({
					message: 'Unable to verify password.'
				});

				// console.log(user.accountType ?? "NORMAL")

				try {
					const token = await generateRandomToken(25);
					new Token({
						token: token,
						user: {
							_id: user._id,
							name: user.name
						},
						accountType: user.accountType ?? "NORMAL",
						company: user.company
					}).save((err: any, doc: any) => {
						if (err) return res.status(500).json({
							message: "Unable to save token."
						})
						
						return res.json(doc)
					})
				} catch (e) {
					return res.status(500).json({
						message: "Unable to generate auth token."
					})
				}
			})
		})
	},

	forgotPassword: (req: Request, res:Response) => {
		const { error, value } = ForgotPassword.validate(req.body);
		if (error) return res.status(400).json({
			message: error.details[0].message
		})

		const { email } = value;
		User.findOne({ "email": email }, async (err: any, user: any) => {
			if (err) return res.status(500).json({
				message: "Unable to fetch user record."
			})

			if (!user) return res.status(404).json({
				message: "There are no record in our system matching that email address."
			})

			try {
				const token = await generateRandomToken(16);
				new PasswordReset({
					user: user,
					token: token
				}).save((err: any, record: any) => {
					if (err) return res.status(500).json({
						message: err.message
					})

					return res.json({
						_id: record._id,
						token: record.token,
						user: user,
						createdAt: record.createdAt
					})
				})
			} catch (e) {
				return res.status(500).json({
					message: "Unable to generate password reset token."
				})
			}
		}).select("_id name");
	},

	resetPassword: (req: Request, res: Response) => {
		const { error, value } = ResetPassword.validate(req.body);
		if (error) return res.status(400).json({
			message: error.details[0].message
		});

		PasswordReset.findOneAndUpdate({
			token: value.token,
			usedAt: null
		}, {
			usedAt: Date.now()
		}, { useFindAndModify: false, new: false }, (err: any, record: any) => {
			if (err) return res.status(500).json({
				message: "Unable to fetch token record."
			})

			if (!record) return res.status(404).json({
				message: "Invalid token provided."
			})

			bcrypt.hash(value.password, 10, async (err: Error | undefined, newPassword: string) => {
				if (err) return res.status(500).json({
					message: "Unable to hash password."
				});

				User.findByIdAndUpdate(record.user._id, {
					password: newPassword,
					passwordChangedAt: Date.now(),
					updatedAt: Date.now()
				}, { useFindAndModify: false, new: true }, (err: any, user: any) => {
					if (err) return res.status(500).json({
						message: "Unable to update password."
					})

					if (!user) return res.status(404).json({
						message: "User not found."
					})
					
					return res.json({
						message : "Password successfully updated."
					})
				}).select("_id name email createdAt updatedAt")
			});
		})
	},
}


router.post("/register", UserRoutes.registerAction);
router.post('/login', UserRoutes.loginAction);
router.post('/forgot-password', UserRoutes.forgotPassword);
router.post('/reset-password', UserRoutes.resetPassword);

module.exports = router;