import { Response } from 'express'

export function ok(res: Response, data: any, meta?: any) {
  return res.json({ success: true, data, meta });
}

export function created(res: Response, data: any) {
  return res.status(201).json({ success: true, data });
}

export function fail(res: Response, status: number, error: any) {
  return res.status(status).json({ success: false, error });
}
