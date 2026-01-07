import { IHealthRepository } from "../repository/health.repository.interface";

export class HealthService {
  constructor(private readonly repo: IHealthRepository) {}

  async checkHealth(): Promise<{ status: string }> {
    const status = await this.repo.getStatus();
    return { status };
  }
}