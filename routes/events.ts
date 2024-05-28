import express, { Request, Response } from 'express';
import { EventController } from '../controller/event_controller';
import { EventValidator } from '../middleware/event_validator';

const router = express.Router();
router.param("eventId", EventValidator)

const event = new EventController();

router.post('/', async (req: Request, res: Response) => {
	const newEvent = await event.createEvent(res.locals.user, res.locals.client, req.body);
	res.json(newEvent);
});


router.get('/', (req: Request, res: Response) => {
	event.getAllEvents(res.locals.client._id).then(events => res.json(events)).catch(e => res.status(500).json({message: e.message}));
});

router.get('/demo', async (req: Request, res: Response) => {
	const demoEvent = await event.getDemoEvent(res.locals.client._id);
	if (null === demoEvent){
		const newDemoEvent = await event.createEvent(res.locals.user, res.locals.client, {
			name: "FACESDEMO2024",
			hidden: true
		});

		return res.json(newDemoEvent);
	}

	return res.json(demoEvent);
});


router.get('/active', (req: Request, res: Response) => {
	event.getActiveEvents(res.locals.client._id).then(events => res.json(events)).catch(e => res.status(500).json({message: e.message}));
});

router.get('/hidden', (req: Request, res: Response) => {
	event.getHiddenEvents(res.locals.client._id).then(events => res.json(events)).catch(e => res.status(500).json({message: e.message}));
});


router.get('/:eventId', (req: Request, res: Response) => {
	event
		.getEvent(req.params.eventId)
		.then(events => res.json(events))
		.catch(e => res.status(500).json({message: e.message}));
});

router.put('/:eventId', (req: Request, res: Response) => {
	event
		.updateEvent(req.params.eventId, req.body)
		.then(events => res.json(events))
		.catch(e => res.status(500).json({message: e.message}));
});

router.patch('/:eventId', (req: Request, res: Response) => {
	event
		.hideEvent(req.params.eventId)
		.then(events => res.json(events))
		.catch(e => res.status(500).json({message: e.message}));
});

router.delete('/:eventId', (req: Request, res: Response) => {
	event
		.deleteEvent(req.params.eventId)
		.then(event => res.json(event))
		.catch(e => res.status(500).json({message: e.message}));
});



router.delete('/:eventId/clear', async (req: Request, res: Response) => {
	try {
		event.clearEvent(req.params.eventId);
		res.json({
			message: "Event cleared successfully."
		});
	} catch (error: any){
		res.status(500).json({
			message: error.message
		});
	}
});


router.get('/:eventId/export', (req: Request, res: Response) => {
	event
		.exportEvent(req.params.eventId, req.body)
		.then(event => {
			res.header('Content-Type', 'text/csv');
  			res.attachment(`${res.locals.event.name} Leads.csv`);
			return res.send(event)
		})
		.catch(e => res.status(500).json({message: e.message}));
});


router.get('/:eventId/export/fields', (req: Request, res: Response) => {
	event
		.getExportFields(req.params.eventId)
		.then(event => res.json(event))
		.catch(e => res.status(500).json({message: e.message}));
});

module.exports = router