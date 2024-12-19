import express from 'express';
import { SubjectController } from '../controllers/subject.controller';
import { validateSubject } from '../validators/subject.validator';
import { authorize } from '../middleware/authorize';

const router = express.Router();
const controller = new SubjectController();

router.get('/', controller.listSubjects);
router.get('/:id', controller.getSubject);
router.post('/', authorize(['ADMIN']), validateSubject, controller.createSubject);
router.put('/:id', authorize(['ADMIN']), validateSubject, controller.updateSubject);
router.delete('/:id', authorize(['ADMIN']), controller.deleteSubject);

export default router; 