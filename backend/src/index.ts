import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  // Handle client-side routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
