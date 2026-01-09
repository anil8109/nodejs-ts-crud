import express from 'express';
import healthRoutes from './modules/health/routes/health.route';
import userRoutes from './modules/user/routes/user.routes';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './modules/user/utils/AppError';

export const app = express();

app.use(express.json());
app.use((err: Error | AppError, _req: Request, res: Response, _next: NextFunction): void => {
  // Use 'instanceof' to check if it's our custom error
  const status = err instanceof AppError ? err.status : 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});
// app.use("/health", healthRoutes);
app.use("/user", userRoutes);

app.use(express.json());
app.use("/health", healthRoutes);

export default app;