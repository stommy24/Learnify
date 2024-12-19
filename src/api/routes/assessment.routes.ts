import express from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { validateAssessment } from '../validators/assessment.validator';
import { authorize } from '../middleware/authorize';

const router = express.Router();
const controller = new AssessmentController();

router.get('/', controller.listAssessments);
router.get('/:id', controller.getAssessment);
router.post('/', authorize(['TEACHER', 'ADMIN']), validateAssessment, controller.createAssessment);
router.put('/:id', authorize(['TEACHER', 'ADMIN']), validateAssessment, controller.updateAssessment);
router.delete('/:id', authorize(['TEACHER', 'ADMIN']), controller.deleteAssessment);
router.post('/:id/submit', controller.submitAssessment);

export default router; 