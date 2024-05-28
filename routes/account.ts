import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/user";
import { ChangeEmailForm, ChangePasswordForm, UpdateProfileForm } from "../forms/user_forms";

const router 			= express.Router();
const { APP_SECRET } 	= process.env;

if (!APP_SECRET){
	throw new Error("Please ensure that APP_SECRET is defined in your .env file");
}


const AuthUserRoutes 	= {
	getAccount: (req: Request, res: Response) => {
		const { _id: userId } = res.locals.user;
		User.findById(userId, (err: any, user: any) => {
			if (err) return res.status(500).json({
				message: "Unable to fetch user account."
			});

			if (!user) return res.status(404).json({
				message: "User not found."
			})

			return res.json(user)
		}).select("_id name email phone title company createdAt updatedAt")
	},

	updateAccount: (req: Request, res: Response) => {
		const { error, value: userInfo } = UpdateProfileForm.validate(req.body);
		if (error) return res.status(400).json({
			message: error.details[0].message
		});

		if (!userInfo || Object.keys(userInfo).length === 0) return res.status(400).json({
			message: "No data provided."
		});

		User.findByIdAndUpdate(res.locals.user._id, {
			updatedAt: Date.now(),
			... userInfo 
		}, { useFindAndModify: false, new: true}, (err: any, user: any) => {
			if (err) return res.status(500).json({
				messgage: "Unable to fetch user record."
			});

			if (!user) return res.status(404).json({
				message: "User profile not found."
			});

			return res.json(user);
		}).select("_id name title company email phone createdAt updatedAt")
	},

	changeEmail: (req: Request, res: Response) => {
		const { error, value } = ChangeEmailForm.validate(req.body);
		if (error) return res.status(400).json({
			message: error.details[0].message
		});

		User.findOne({
			email: value.email
		}, (err: any, account: any) => {
			if (err) return res.status(500).json({
				message: "Unable to communicate with database."
			})

			if (!account){
				// Update user profile with this new email.
				User.findByIdAndUpdate(res.locals.user._id, {
					email: value.email,
					updatedAt: Date.now()
				}, { useFindAndModify: false, new: true }, (err: any, updatedAccount: any) => {
					if (err) return res.status(500).json({
						message: "Unable to find and update user email."
					})

					if (!updatedAccount) return res.status(410).json({
						message: "Unable to find user account."
					})

					return res.json(updatedAccount);
				}).select("_id  name email phone title company createdAt updatedAt")


			} else {
				if (account._id.equals(res.locals.user._id) === true){
					return res.status(400).json({
						message: `Your account email address is already set to '${value.email}'`
					})

				} else {
					return res.status(409).json({
						message: "The provided email address is already being used by another account."
					})
				}
			}
		})
	},

	changePassword: (req: Request, res: Response) => {
		const { error, value } = ChangePasswordForm.validate(req.body);
		if (error) return res.status(400).json({
			message: error.details[0].message
		})

		if (value.currentPassword === value.newPassword) return res.status(400).json({
			message: "Current password and new password cannot be the same."
		})

		User.findById(res.locals.user._id, (err: any, account: any) => {
			if (err) return res.status(500).json({
				message: "Unable to get user account."
			})

			if (!account) return res.status(404).json({
				message: "User account not found."
			})

			bcrypt.compare(value.currentPassword, account.password, (err: any, same: boolean) => {
				if (err) return res.status(500).json({
					message: "Unable to verify password."
				})

				if (same === false) return res.status(400).json({
					message: "Your current password does not match the one we have on record."
				})
	

				bcrypt.hash(value.newPassword, 10, async (err: Error | undefined, hashed: string) => {
					if (err) return res.status(500).json({
						message: "Unable to hash password."
					});

					const update = { $set: {password: hashed}};
					const user = await User.findByIdAndUpdate(res.locals.user._id, update);

					User.findByIdAndUpdate(res.locals.user._id, {
						password: hashed,
						passwordChangedAt: Date.now(),
						updatedAt: Date.now()
					}, { new: true }, (err: any, updatedUser: any) => {
						if (err) return res.status(500).json({
							message: "Unable to update user password."
						})

						if (!updatedUser) return res.status(404).json({
							message: "User account not found."
						})

						return res.json({
							message: "Password successfully updated."
						})
					})
				})
			})
		})
	}
}


router.get("/account", AuthUserRoutes.getAccount);
router.put("/account", AuthUserRoutes.updateAccount);
router.put("/account/email", AuthUserRoutes.changeEmail);
router.put("/account/password", AuthUserRoutes.changePassword);

module.exports = router;