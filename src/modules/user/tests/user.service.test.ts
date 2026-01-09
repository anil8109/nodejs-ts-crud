import { IUser } from "../models/user.model";
import { IUserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { AppError } from "../utils/AppError";

describe('User Service', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<IUserRepository>;

      // Create a mock user that matches IUser interface
      const mockResponseUser = {
        _id: '695f90a2850f2dc186f03088',
        name: 'Anil',
        email: 'anil@gmail.com',
        password: 'hashedPassword123', // Note: password is required in schema
        createdAt: new Date('2026-01-08T11:10:26.673Z'),
        updatedAt: new Date('2026-01-08T11:10:26.673Z'),
      } as unknown as IUser; // Cast to any since we don't need to implement all Document methods
        const mockedUserId = '695f90a2850f2dc186f03088';


      beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;
        userService = new UserService(mockUserRepository);
      })

      afterEach(() => {
        jest.clearAllMocks();
      })


    describe('Register User', () => {
        it('User should create successfully', async () => {
            // Prepare and Mock 
            mockUserRepository.create.mockResolvedValue(mockResponseUser);

            const mockCreateUser = {
                name: 'Anil',
                email: 'anil@gmail.com',
                password: 'hashedPassword123',
            }
    
            //Act 
            const userData = await userService.registerUser(mockCreateUser);
            
            // Assert
            expect(userData).toEqual(mockResponseUser);
        });
        it('Should handle repository error', async () => {
            // Prepare and Mock 
            const error = new Error('User registration failed');
            mockUserRepository.create.mockRejectedValue(error);

            const mockCreateUser = {
                name: 'Anil',
                email: 'anil@gmail.com',
                password: 'hashedPassword123',
            }
    
            //Act and Assert
            await expect(userService.registerUser(mockCreateUser)).rejects.toThrow('User registration failed');
        });
    })
    describe('Get User', () => {
        // Mock

        it('Should get user by ID successfully', async () => {
            // Prepare 
            mockUserRepository.findById.mockResolvedValue(mockResponseUser);
    
            //Act 
            const userData = await userService.getUser(mockedUserId);
            
            // Assert
            expect(userData).toEqual(mockResponseUser);
        });
        it('Should handle user not found error', async () => {
            // Prepare and Mock 
            const error = new Error('User not found');
            mockUserRepository.findById.mockRejectedValue(error);

            //Act and Assert
            await expect(userService.getUser(mockedUserId)).rejects.toThrow('User not found');
        });

        it('Should handle user not found App error', async () => {
            // Prepare and Mock 
            mockUserRepository.findById.mockResolvedValue(null);

            //Act and Assert
            await expect(userService.getUser(mockedUserId)).rejects.toThrow(AppError);

            try {
                await userService.getUser(mockedUserId);
            } catch (error: unknown) {
                const err = (error as AppError);
                expect(err.message).toBe('User not found');
                expect(err.status).toBe(404);
            }
        });
    })

    describe('Update User', () => {
        // Mock
        const mockedUpdateUser = {
            name: 'Anil',
            email: 'anil@gmail.com',
        };

        it('Should Update user successfully', async () => {
            // Prepare 
            mockUserRepository.update.mockResolvedValue(mockResponseUser);
    
            //Act 
            const userData = await userService.updateUserInfo(mockedUserId, mockedUpdateUser);
            
            // Assert
            expect(userData).toEqual(mockResponseUser);
        });
        it('Should handle unable to update error', async () => {
            // Prepare and Mock 
            const error = new Error('Unable to update user data');
            mockUserRepository.update.mockRejectedValue(error);

            //Act and Assert
            await expect(userService.updateUserInfo(mockedUserId, mockedUpdateUser)).rejects.toThrow('Unable to update user data');
        });
    })

    describe('Delete User', () => {
        // Mock
        const isUserDeleted = true;

        it('Should delete user successfully', async () => {
            // Prepare 
            mockUserRepository.delete.mockResolvedValue(isUserDeleted);
    
            //Act 
            const userData = await userService.removeUser(mockedUserId);
            
            // Assert
            expect(userData).toEqual(isUserDeleted);
        });
        it('Should handle unable to delete error', async () => {
            // Prepare and Mock 
            const error = new Error('Unable to delete user');
            mockUserRepository.delete.mockRejectedValue(error);

            //Act and Assert
            await expect(userService.removeUser(mockedUserId)).rejects.toThrow('Unable to delete user');
        });
    })
})