import request from 'supertest';
import express from 'express';
import { IUser } from '../models/user.model';

// 1. Create a "stable" mock object that persists across resets
const mockUserController = {
  register: jest.fn(),
  get: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// 2. Mock the controller at the TOP level using the stable object
jest.mock('../controllers/user.controller', () => {
  return {
    UserController: jest.fn().mockImplementation(() => mockUserController),
  };
});
const mockUser = {
_id: '695f90a2850f2dc186f03088',
name: 'Anil',
email: 'anil@gmail.com',
password: 'hashedPassword123', // Note: password is required in schema
createdAt: new Date('2026-01-08T11:10:26.673Z'),
updatedAt: new Date('2026-01-08T11:10:26.673Z'),
} as unknown as IUser; 

describe('User Routes', () => {
  let app: express.Application;

  beforeEach(async () => {
    // 3. Clear the mock data (but not the functions themselves)
    jest.clearAllMocks();

    // 4. Import the routes (use require to ensure it picks up the mock)
    // No resetModules needed here if the mock factory is stable
    const { default: userRoutes } = await import('../routes/user.routes');

    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
  });

  describe('Post User', () => {
      it('POST /users - should return 400 for invalid data', async () => {
        const res = await request(app)
          .post('/users')
          .send({ name: 'J' }); // Fails Zod validation
    
        expect(res.status).toBe(400);
      });
    
      it('POST /users - Success Case, get user success case', async () => {
        // 5. Apply the specific implementation for this block
        mockUserController.register.mockImplementation((req, res) => {
          res.status(201).json(mockUser);
        });
    
        const res = await request(app)
          .post('/users')
          .send({ 
            name: mockUser.name, 
            email: mockUser.email, 
            password: mockUser.password 
          });
    
        expect(res.status).toBe(201);
        expect(res.body.name).toBe(mockUser.name);
      });
  })

  describe('Get User', () => {
    it('Get /users - Success Case', async () => {
        // 5. Apply the specific implementation for this block
        mockUserController.get.mockImplementation((req, res) => {
            res.status(200).json(mockUser);
        });

        const res = await request(app)
            .get(`/users/:${mockUser._id}`);

        expect(res.body.name).toBe(mockUser.name);
        expect(res.status).toBe(200);
    });

    it('Get /users - error 404 user not found', async () => {
        // 5. Apply the specific implementation for this block
        mockUserController.get.mockImplementation((req, res) => {
            res.status(404).json({message: 'User not found' });
        });

        const res = await request(app)
            .get(`/users/:${mockUser._id}`);

        expect(res.body.message).toBe('User not found');
        expect(res.status).toBe(404);
    });
  })
  describe('Edit User', () => {
    it('Edit /users - Success Case', async () => {
        // 5. Apply the specific implementation for this block
        const nameToUpdate = "Ajit";
        mockUser.name = nameToUpdate;
        mockUserController.update.mockImplementation((req, res) => {
            res.status(200).json(mockUser);
        });

        const res = await request(app)
            .put(`/users/:${mockUser._id}`)
            .send({
                name: nameToUpdate
            });
        
        expect(res.body.name).toBe(nameToUpdate);
        expect(res.status).toBe(200);
    });

    it('Get /users - error bad request error', async () => {
        // 5. Apply the specific implementation for this block
        const nameToUpdate = "Ajit";
        mockUser.name = nameToUpdate;
        mockUserController.update.mockImplementation((req, res) => {
            res.status(400).json({message: 'Bad request error' });
        });

        const res = await request(app)
            .put(`/users/:${mockUser._id}`)
            .send({
                name: nameToUpdate
            });

        expect(res.body.message).toBe('Bad request error');
        expect(res.status).toBe(400);
    });
  })

  describe('Delete User', () => {
    it('Edit /users - Success Case', async () => {
        // 5. Apply the specific implementation for this block
        mockUserController.delete.mockImplementation((req, res) => {
            res.status(204).json({});
        });

        const res = await request(app)
            .delete(`/users/:${mockUser._id}`);
        
        expect(res.status).toBe(204);
    });

    it('Get /users - error unable to delete user', async () => {
        // 5. Apply the specific implementation for this block
        mockUserController.delete.mockImplementation((req, res) => {
            res.status(400).json({message: 'Bad request error' });
        });

        const res = await request(app)
            .delete(`/users/:${mockUser._id}`);

        expect(res.body.message).toBe('Bad request error');
        expect(res.status).toBe(400);
    });
  })
});