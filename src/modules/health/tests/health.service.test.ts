import { HealthService } from "../services/health.service";

describe('health service', () =>{
    it('Should return OK', async () => {
        const mockRepo = {
            getStatus: jest.fn().mockResolvedValue('OK')
        }

        const healthService = new HealthService(mockRepo);
        const result = await healthService.checkHealth();

        expect(result).toEqual({ status: 'OK'})
        expect(mockRepo.getStatus).toHaveBeenCalled()
    });
});