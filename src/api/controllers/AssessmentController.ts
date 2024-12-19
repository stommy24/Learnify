import { Request, Response, NextFunction } from 'express';
import { BaseController } from './BaseController';
import { AssessmentService } from '../services/AssessmentService';
import { validateAssessment } from '../validators/assessmentValidator';

export class AssessmentController extends BaseController {
  constructor(private assessmentService: AssessmentService) {
    super();
  }

  protected async executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | any> {
    try {
      switch (req.method) {
        case 'GET':
          if (req.params.id) {
            return await this.getAssessment(req, res);
          }
          return await this.getAllAssessments(req, res);
        case 'POST':
          return await this.createAssessment(req, res);
        case 'PUT':
          return await this.updateAssessment(req, res);
        case 'DELETE':
          return await this.deleteAssessment(req, res);
        default:
          next(this.clientError('Method not allowed'));
      }
    } catch (error) {
      next(error);
    }
  }

  private async getAssessment(req: Request, res: Response) {
    const assessment = await this.assessmentService.getById(req.params.id);
    if (!assessment) {
      throw this.notFound('Assessment not found');
    }
    return this.ok(res, assessment);
  }

  private async getAllAssessments(req: Request, res: Response) {
    const assessments = await this.assessmentService.getAll(req.query);
    return this.ok(res, assessments);
  }

  private async createAssessment(req: Request, res: Response) {
    const validationResult = validateAssessment(req.body);
    if (!validationResult.isValid) {
      throw this.clientError(validationResult.errors.join(', '));
    }

    const assessment = await this.assessmentService.create(req.body);
    return this.created(res, assessment);
  }

  private async updateAssessment(req: Request, res: Response) {
    const validationResult = validateAssessment(req.body, true);
    if (!validationResult.isValid) {
      throw this.clientError(validationResult.errors.join(', '));
    }

    const assessment = await this.assessmentService.update(req.params.id, req.body);
    if (!assessment) {
      throw this.notFound('Assessment not found');
    }
    return this.ok(res, assessment);
  }

  private async deleteAssessment(req: Request, res: Response) {
    await this.assessmentService.delete(req.params.id);
    return this.ok(res);
  }
} 