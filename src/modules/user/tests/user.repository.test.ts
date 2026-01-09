// user.repository.test.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { IUser } from '../models/user.model';

describe('UserRepository', () => {
  let mongoServer: MongoMemoryServer;
  let repository: UserRepository;
  const mockedUserId = new mongoose.Types.ObjectId().toHexString();
  const userData = { name: 'Anil', email: 'anil@gmail.com', password: '123' } as unknown as CreateUserDTO;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    repository = new UserRepository();
  });

  afterEach(async () => {
    // Clear database before each testx 
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe('Register', () => {

      it('should create a user in the database', async () => {
        // Call repository method directly (NO Supertest)
        const user: IUser = await repository.create(userData);

        // Assert
        expect(user.name).toBe('Anil');
        expect(user._id).toBeDefined();
      });
    
      it('should fail when a required field is missing', async () => {
        // Use Partial to allow missing required fields like 'email'
        const invalidData = { 
            name: 'Anil', 
            password: '123456' 
        } as unknown as CreateUserDTO;
    
            // Cast to any ONLY at the point of the call to bypass the compiler check
            await expect(repository.create(invalidData))
            .rejects
            .toThrow(mongoose.Error.ValidationError);
      });

    it('should throw duplicate error for unique constraint violation', async () => {
      // Arrange: Create a user with a unique email
      await repository.create(userData);

      const userData2 = { 
        name: 'Amit', 
        email: 'anil@gmail.com', // Same email - should cause duplicate error
        password: '456' 
      };
      await expect(repository.create(userData2))
        .rejects
        .toMatchObject({ 
          code: 11000,
          name: 'MongoServerError'
        });
    });
  })

  describe('Find by id', () => {
    it('should find a user successfully by a valid ID', async () => {
      // 1. Arrange: Create a user first so it exists in the memory DB
      const user: IUser = await repository.create(userData);
      const userId = (user._id as unknown as string).toString();

      // 2. Act: Call findById
      const foundUser = await repository.findById(userId);

      // 3. Assert
      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('anil@gmail.com');
      expect(foundUser?._id.toString()).toBe(userId);
    });

    it('should return null when a user is not found', async () => {
      // 2. Act: Call findById
      const foundUser = await repository.findById(mockedUserId);

      // 3. Assert
      expect(foundUser).toBe(null);
    });

    it('should throw a CastError if the ID format is invalid', async () => {
      // 1. Arrange: An ID that is not a 24-character hex string
      const invalidIdFormat = 'invalid-id-123';

      // 2. Act & Assert
      // Mongoose findById will throw a CastError automatically for bad formats
      await expect(repository.findById(invalidIdFormat))
        .rejects
        .toThrow(mongoose.Error.CastError);
    });
  })

  describe('Update', () => {
    it('Should update user details successfully', async () => {
      // 1. Arrange: Create a user first so it exists in the memory DB
      const user: IUser = await repository.create(userData);
      const savedUserId = user._id as unknown as string;
      const userDataToUpdate = { name: 'Amit', email: 'amit@gmail.com'};
      const updatedUser = await repository.update(savedUserId, userDataToUpdate as UpdateUserDTO);

      // Assert 
      expect(updatedUser?.name).toBe(userDataToUpdate.name);
      expect(updatedUser?.email).toBe(userDataToUpdate.email);
    });

    it('Should give duplicate error', async () => {
      // 1. Arrange: Create a user first so it exists in the memory DB
      await repository.create(userData);
      const newUserData = {name: "Amit", email: "anilhu@gmail.com", password: "123456"} as unknown as CreateUserDTO;
      const savedUser = await repository.create(newUserData);
      const savedUserId = savedUser._id as unknown as string;
      const userDataToUpdate = { name: 'Amit', email: 'anil@gmail.com'};

      // 2. Act & Assert
      await expect(repository.update(savedUserId, userDataToUpdate))
      .rejects
      .toMatchObject({ code: 11000 });
    });
  })

  describe('Delete', () => {
    // Mock
    const isUserDeleted = true;
    let savedUserId = '';
    it('Should delete user details successfully', async () => {
      // 1. Arrange: Create a user first so it exists in the memory DB
      const user = await repository.create(userData);
      savedUserId = user._id as unknown as string;
      const deletedUser = await repository.delete(savedUserId);

      // Assert 
      expect(deletedUser).toBe(isUserDeleted);
    });

    it('Should give error when deleting already deleted', async () => {
      // 1. Arrange: Create a user first so it exists in the memory DB  
      const result = await repository.delete(savedUserId);

      // 2. Act & Assert
      expect(result).toEqual(false);
    });
  })

});
