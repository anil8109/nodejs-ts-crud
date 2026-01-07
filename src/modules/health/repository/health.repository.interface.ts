export interface IHealthRepository {
  getStatus(): Promise<string>;
}