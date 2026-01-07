import { Request, Response } from "express";
import { HealthService } from "../services/health.service";

export class HealthController {
  constructor(private healthService: HealthService) {}

  public getHealth = async (req: Request, res: Response) => {
    const result = await this.healthService.checkHealth();
    return res.status(200).json(result);
  };
}