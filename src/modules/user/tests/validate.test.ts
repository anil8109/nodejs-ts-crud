import { validate } from '../middlewares/validate';
import { Request, Response, NextFunction } from 'express';
import { CreateUserSchema } from '../dtos/user.dto';
  import { ZodType } from 'zod';

describe('validate middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  const testSchema = CreateUserSchema;

  it('should call next() if validation passes', async () => {
    mockRequest.body = { name: 'John Doe', email: "john@gmail.com", password: "123456" };
    const middleware = validate(testSchema);

    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    mockRequest.body = { name: 123 }; // Should be string
    const middleware = validate(testSchema);

    await middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'fail' })
    );
  });

    it('should call next(error) for non-Zod errors', async () => {
    // 1. Arrange: Create a mock that matches the expected structure of ZodType
    const mockGenericError = new Error('Unexpected Database Error');
    
    // We cast through unknown to satisfy the compiler
    const fakeSchema = {
        parseAsync: jest.fn().mockRejectedValue(mockGenericError),
    } as unknown as ZodType;

    const middleware = validate(fakeSchema);
    
    // 2. Act
    await middleware(
        mockRequest as Request, 
        mockResponse as Response, 
        nextFunction
    );

    // 3. Assert
    // This confirms the code skipped the 'if (error instanceof ZodError)' block
    expect(nextFunction).toHaveBeenCalledWith(mockGenericError);
    expect(mockResponse.status).not.toHaveBeenCalled();
    });
});