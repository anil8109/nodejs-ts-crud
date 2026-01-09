import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.userService.registerUser(req.body);
    return res.status(201).json(user);
  };

  get = async (req: Request, res: Response): Promise<Response | void> => {
    const user = await this.userService.getUser(req.params.id);
    return res.json(user);
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const user = await this.userService.updateUserInfo(req.params.id, req.body);
    return res.json(user);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.userService.removeUser(req.params.id);
    res.status(204).send();
  };
}
