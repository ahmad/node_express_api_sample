import { Request, Response } from 'express';
import { DocumentController } from '../controller/document_controller';

const express = require('express');
const router = express.Router();


const document = new DocumentController();
router.post('/', async (req:Request, res: Response) => {
	const newDoc = await document.createDocument(res.locals.user, res.locals.client, req.body);
	res.json(newDoc);
});

router.get('/', async (req: Request, res: Response) => {
	document.getDocuments(res.locals.client._id).then(leads => res.json(leads)).catch(e => res.status(500).json({message: e.message}));
});

router.get('/:documentId', (req:Request, res: Response) => {
	document.getDocument(req.params.documentId)
		.then(events => res.json(events))
		.catch(e => res.status(500).json({message: e.message}));
});


module.exports = router