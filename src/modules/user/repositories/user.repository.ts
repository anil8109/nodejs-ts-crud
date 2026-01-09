import { User, IUser } from '../models/user.model';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  update(id: string, data: UpdateUserDTO): Promise<IUser | null>;
  delete(id: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<IUser> {
    return await User.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async update(id: string, data: UpdateUserDTO): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }
}
