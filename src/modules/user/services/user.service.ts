import { IUserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { AppError } from '../utils/AppError';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(data: CreateUserDTO): Promise<IUser> {
    return await this.userRepository.create(data);
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUserInfo(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    return await this.userRepository.update(id, data);
  }

  async removeUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}
