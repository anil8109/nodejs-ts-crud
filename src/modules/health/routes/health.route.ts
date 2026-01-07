import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { HealthRepository } from '../repository/health.repository';

const router = Router();

const repo = new HealthRepository();
const service = new HealthService(repo);
const controller = new HealthController(service);

router.get('/', controller.getHealth);

export default router;