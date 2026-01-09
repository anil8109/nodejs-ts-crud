import { Router } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { validate } from '../middlewares/validate'; // Generic Zod Middleware
import { CreateUserSchema } from '../dtos/user.dto';
const userRoutes = Router();

// Manual Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.post('/', validate(CreateUserSchema), userController.register);
userRoutes.get('/:id', userController.get);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);

export default userRoutes;
