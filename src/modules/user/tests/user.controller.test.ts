// user.controller.test.ts
import { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { IUser } from '../models/user.model';
import { AppError } from '../utils/AppError';

// Mock the UserService
// jest.mock('../services/user.service');

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: jest.Mocked<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  // Create a mock user that matches IUser interface
  const mockUser = {
    _id: '695f90a2850f2dc186f03088',
    name: 'Anil',
    email: 'anil@gmail.com',
    password: 'hashedPassword123', // Note: password is required in schema
    createdAt: new Date('2026-01-08T11:10:26.673Z'),
    updatedAt: new Date('2026-01-08T11:10:26.673Z'),
  } as unknown as IUser; // Cast to any since we don't need to implement all Document methods

  beforeEach(() => {
    // Create a proper mock service
    mockUserService = {
      registerUser: jest.fn(),
      getUser: jest.fn(),
      updateUserInfo: jest.fn(),
      removeUser: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    userController = new UserController(mockUserService);
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a user and return 201 status', async () => {
      // Arrange
      const requestBody = {
        name: 'Anil',
        email: 'anil@gmail.com',
        password: 'plainPassword123',
      };
      
      mockRequest = {
        body: requestBody,
      };

      // Mock the service to return our mock user
      mockUserService.registerUser.mockResolvedValue(mockUser);

      // Act
      await userController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.registerUser).toHaveBeenCalledWith(requestBody);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('should handle service errors', async () => {
      // Arrange
      mockRequest = {
        body: {
          name: 'Anil',
          email: 'anil@gmail.com',
          password: 'plainPassword123',
        },
      };

      const error = new Error('User registration failed');
      mockUserService.registerUser.mockRejectedValue(error);

      // Act & Assert
      // We need to handle the async error
      try {
        await userController.register(
          mockRequest as Request,
          mockResponse as Response
        );
      } catch (err) {
        expect(err).toBe(error);
      }
    });
  });

  describe('Get User', () => {
    it('Should get user successfully', async () => {
      // Mock
      mockUserService.getUser.mockResolvedValue(mockUser)

      //Prepare
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        }
      }

      // Act
      await userController.get(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.getUser).toHaveBeenCalledWith(mockUser._id);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('Should give user not found', async () => {
      // Mock
      const error = new Error('User not found');
      mockUserService.getUser.mockRejectedValue(error);

      //Prepare
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        }
      }

      // Assert
      await expect(userController.get(mockRequest as Request, mockResponse as Response)).rejects.toThrow('User not found');
    });

    it('Should give user not found with AppError', async () => {
    // Mock with AppError
      const appError = new AppError('User not found', 404);
      mockUserService.getUser.mockRejectedValue(appError);

      // Prepare
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        }
      };

      // Act & Assert
      await expect(
        userController.get(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow('User not found');

      // Optional: Check it's an AppError with status 404
      try {
        await userController.get(mockRequest as Request, mockResponse as Response);
      } catch (err: unknown) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).status).toEqual(404);
      }
    });
  })

  describe('Update User', () => {
    it('Should update user successfully', async () => {
      // Mock
      mockUserService.updateUserInfo.mockResolvedValue(mockUser)

      //Prepare
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        },
        body: {
          name: 'Anil',
          email: 'anil@gmail.com',
        }
      }

      // Act
      await userController.update(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserService.updateUserInfo).toHaveBeenCalledWith('695f90a2850f2dc186f03088', mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it('Should give unable to update user', async () => {
      // Mock
      const error = new Error('User not found or unable to update user');
      mockUserService.updateUserInfo.mockRejectedValue(error);

      //Prepare
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        },
        body: {
          name: 'Anil',
          email: 'anil@gmail.com',
        }
      }

      // Assert
      await expect(userController.update(mockRequest as Request, mockResponse as Response)).rejects.toThrow('User not found or unable to update user');
    });
  })

  describe('Deleted User', () => {

    it('It should delete user successfully', async () => {
      // Prepare / Arrange and mock
      mockUserService.removeUser.mockResolvedValue(true);
      mockRequest = {
        params: {
          id: '695f90a2850f2dc186f03088'
        }
      }
      // Act 
      await userController.delete(mockRequest as Request, mockResponse as Response);

      //Assert
      expect(mockUserService.removeUser).toHaveBeenCalledWith('695f90a2850f2dc186f03088');
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });
  })
  
});