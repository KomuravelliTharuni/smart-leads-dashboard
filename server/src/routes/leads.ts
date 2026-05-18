import { Router } from 'express';
import Lead from '../models/Lead';
import auth from '../middleware/auth';
import { requireRole } from '../middleware/roles';
import { body, validationResult } from 'express-validator';
import { ok, created, fail } from '../utils/response';

const router = Router();

// Protect all lead routes
router.use(auth);

// Create
router.post('/',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return fail(res, 400, { validation: errors.array() });
      const { name, email, status, source } = req.body;
      const lead = await Lead.create({ name, email, status, source });
      return created(res, lead);
    } catch (err) {
      next(err);
    }
  }
);

// Export CSV (applies same filters as list)
router.get('/export', async (req, res, next) => {
  try {
    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.source) filters.source = req.query.source;
    if (req.query.search) {
      const q = (req.query.search as string).trim();
      filters.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }
    const sortBy = (req.query.sort as string) === 'oldest' ? { createdAt: 1 } as const : { createdAt: -1 } as const;
    const data = await Lead.find(filters).sort(sortBy);

    // Build CSV
    const header = ['Name', 'Email', 'Status', 'Source', 'CreatedAt'];
    const rows = data.map((l) => [
      escapeCsv(String(l.name)),
      escapeCsv(String(l.email)),
      escapeCsv(String(l.status)),
      escapeCsv(String(l.source)),
      escapeCsv(l.createdAt.toISOString())
    ].join(','));
    const csv = [header.join(','), ...rows].join('\n');
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
});

function escapeCsv(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

// Read list with pagination, filters, search
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || '1'));
    const limit = 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.source) filters.source = req.query.source;
    if (req.query.search) {
      const q = (req.query.search as string).trim();
      filters.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ];
    }

    const sortBy = (req.query.sort as string) === 'oldest' ? { createdAt: 1 } as const : { createdAt: -1 } as const;

    const [data, total] = await Promise.all([
      Lead.find(filters).sort(sortBy).skip(skip).limit(limit),
      Lead.countDocuments(filters)
    ]);

    return ok(res, data, { total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// Read single
router.get('/:id', async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ error: 'Not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
});

// Update
router.put('/:id',
  body('name').optional().isString().notEmpty(),
  body('email').optional().isEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return fail(res, 400, { validation: errors.array() });
      const { name, email, status, source } = req.body;
      const lead = await Lead.findByIdAndUpdate(req.params!.id, { name, email, status, source }, { new: true });
      if (!lead) return fail(res, 404, 'Not found');
      return ok(res, lead);
    } catch (err) {
      next(err);
    }
  }
);

// Delete (admin only)
router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
