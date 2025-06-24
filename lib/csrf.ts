import { createEdgeCSRF } from '@edge-csrf/nextjs';

const csrf = createEdgeCSRF({
  secret: process.env.CSRF_SECRET || 'your-csrf-secret-key-change-in-production',
});

export default csrf; 