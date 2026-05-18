import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import leadsRoutes from './routes/leads';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// basic health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// centralized error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  // express-validator errors
  if (err && err.array && typeof err.array === 'function') {
    const errors = err.array();
    return res.status(400).json({ success: false, errors });
  }
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ success: false, error: message });
});

export default app;
