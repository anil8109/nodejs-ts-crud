import { Request, Response } from 'express'; 
import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";

describe('HealthController', () => {
    it('Should return 200 and data from service', async () => {
        // 1️⃣ Mock the service
        const mockHealthService = {
            checkHealth: jest.fn().mockResolvedValue({ status: "OK" }),
        } as unknown as HealthService;

         // 2️⃣ Create controller using mock service
        const controllerObject = new HealthController(mockHealthService);

        // 3️⃣ Mock req & res objects
        const req = {} as unknown as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        
        // 4️⃣ Call method
        await controllerObject.getHealth(req, res);

        // 5️⃣ Expectations
        expect(mockHealthService.checkHealth).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: "OK" });
    });
});