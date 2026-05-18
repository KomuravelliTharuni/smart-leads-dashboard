import React, { useState, useEffect } from 'react'
import Modal from './Modal'
import { Input, Select } from './FormField'
import api from '../api'

type Lead = { _id: string; name: string; email: string; status: string; source: string }

type LeadModalProps = {
  open: boolean
  onClose: () => void
  lead?: Lead
  onSave: () => void
}

export default function LeadModal({ open, onClose, lead, onSave }: LeadModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('New')
  const [source, setSource] = useState('Website')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lead) {
      setName(lead.name)
      setEmail(lead.email)
      setStatus(lead.status)
      setSource(lead.source)
    } else {
      setName('')
      setEmail('')
      setStatus('New')
      setSource('Website')
    }
    setErrors({})
  }, [lead, open])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (lead) {
        await api.put(`/leads/${lead._id}`, { name, email, status, source })
      } else {
        await api.post('/leads', { name, email, status, source })
      }
      onSave()
      onClose()
    } catch (err: any) {
      setErrors({ submit: err?.response?.data?.error || 'Failed to save' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={lead ? 'Edit Lead' : 'Add Lead'} onClose={onClose}>
      <form onSubmit={submit}>
        <Input label="Name" value={name} onChange={setName} error={errors.name} />
        <Input label="Email" value={email} onChange={setEmail} error={errors.email} type="email" />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'New', label: 'New' },
            { value: 'Contacted', label: 'Contacted' },
            { value: 'Qualified', label: 'Qualified' },
            { value: 'Lost', label: 'Lost' }
          ]}
        />
        <Select
          label="Source"
          value={source}
          onChange={setSource}
          options={[
            { value: 'Website', label: 'Website' },
            { value: 'Instagram', label: 'Instagram' },
            { value: 'Referral', label: 'Referral' }
          ]}
        />
        {errors.submit && <div className="text-red-600 dark:text-red-400 text-sm mb-3">{errors.submit}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border dark:border-slate-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded disabled:opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
