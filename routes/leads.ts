import { isValidObjectId } from 'mongoose';
import { LeadController } from '../controller/lead_controller';
import { NewLeadForm } from '../forms/lead_forms';
import { LeadValidator } from '../middleware/lead_validator';
import { SendEmail, ParseEmailTemplate } from '../models/actions/send_email';
import express, { Request, Response } from "express";


const router = express.Router();


const lead = new LeadController();

router.post('/', async (req: Request, res: Response) => {
	let {error, value: leadInfo} = NewLeadForm.validate(req.body);
	if (error) return res.status(400).json({
		message: error.details[0].message
	});

	const newLead = await lead.createLead(res.locals.user, res.locals.event, leadInfo);
	res.json(newLead);
});



router.get('/', (req: Request, res: Response) => {
	lead.getLeads(res.locals.event._id).then(leads => res.json(leads)).catch(e => res.status(500).json({message: e.message}));
});


router.get('/search', (req: Request, res: Response) => {
	const { query, limit } = req.query;
	if (query === undefined){
		return res.status(400).json({
			message: "Invalid request"
		});
	}

	lead.searchLeads(res.locals.event._id, query, limit).then(leads => res.json(leads)).catch(e => res.status(500).json({message: e.message}));
});


router.get("/options", (req: Request, res: Response) => {
	const { name, value, sort, order } = req.query;

	if (name == null || value == null){
		return res.status(400).json({
			message: "Both `name` and `value` are required."
		});
	}
	
	lead.findByOption(res.locals.event._id, name, value, sort, order)
			.then(leads => res.json(leads))
			.catch(e => res.status(500).json({message: e.message}));
});

router.get('/:leadId', [LeadValidator], (req: Request, res: Response, next: any) => {
	lead
		.getLead(req.params.leadId)
		.then(events => res.json(events))
		.catch(e => res.status(500).json({message: e.message}));
});

router.get('/:leadId/options', [LeadValidator],  (req: Request, res: Response) => {
	lead
		.getOptions(req.params.leadId)
		.then(options => res.json(options))
		.catch(e => res.status(500).json({message: e.message}));
});


router.get('/:leadId/actions', [LeadValidator],  (req: Request, res: Response) => {
	res.json(req.body);
});

router.patch('/:leadId/actions', [LeadValidator], (req: Request, res: Response) => {
	const { action, emailId, template, replacement } = req.body;
	switch (action){
		case "send_email":
			const done = ParseEmailTemplate(template, replacement);
			res.json(done);
			break;
		default:
			return res.status(404).json({
				message: "Action not found."
			});
			break;
	}

	// res.json(req.body);
});

router.post('/:leadId/options', [LeadValidator],  (req: Request, res: Response) => {
	lead
		.addOptions(req.params.leadId, req.body)
		.then(options => res.json(options))
		.catch(e => res.status(500).json({message: e.message}));
});

router.delete('/:leadId/options', [LeadValidator],  (req: Request, res: Response) => {
	lead
		.deleteOptions(req.params.leadId)
		.then(options => res.json(options))
		.catch(e => res.status(500).json({message: e.message}));
});

router.delete('/:leadId/options/:optionId', [LeadValidator],  (req: Request, res: Response) => {
	lead
		.deleteOptionById(req.params.leadId, req.params.optionId)
		.then(options => res.json(options))
		.catch(e => res.status(500).json({message: e.message}));
});

router.put('/:leadId/options/:optionId', [LeadValidator],  (req: Request, res: Response) => {
	lead
		.updateOptionById(req.params.optionId, req.body.name, req.body.value)
		.then(options => res.json(options))
		.catch(e => res.status(500).json({message: e.message}));
});


module.exports = router