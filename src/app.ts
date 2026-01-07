import express from 'express';
import healthRoutes from './modules/health/routes/health.route';
export const app = express();


app.use(express.json());
app.use("/health", healthRoutes);

export default app;