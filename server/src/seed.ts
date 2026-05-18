import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from './models/User'
import bcrypt from 'bcrypt'

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-leads'

async function run(){
  await mongoose.connect(MONGO)
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    console.log('Admin user already exists:', adminEmail)
    process.exit(0)
  }
  const password = process.env.SEED_ADMIN_PASSWORD || 'Password123'
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name: 'Admin', email: adminEmail, password: hash, role: 'admin' })
  console.log('Created admin user:', user.email)
  process.exit(0)
}

run().catch(err=>{ console.error(err); process.exit(1) })
