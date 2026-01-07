import { IHealthRepository } from "./health.repository.interface";

export class HealthRepository implements IHealthRepository {
  async getStatus(): Promise<string> {
    return "OK";
  }
}