import React, { useEffect, useState, useCallback } from 'react'
import api, { setAuthToken } from '../api'
import Header from '../components/Header'
import LeadModal from '../components/LeadModal'

type Lead = { _id: string; name: string; email: string; status: string; source: string; createdAt: string }

function useDebounce<T>(value: T, delay = 400) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [sort, setSort] = useState('latest')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>()
  const [modalOpen, setModalOpen] = useState(false)

  const debounced = useDebounce(search)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setAuthToken(token)
  }, [])

  useEffect(() => {
    api.get('/auth/me').then((r) => setUserRole(r.data.role)).catch(() => setUserRole(null))
  }, [])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const qs = new URLSearchParams()
      qs.set('page', String(page))
      if (debounced) qs.set('search', debounced)
      if (status) qs.set('status', status)
      if (source) qs.set('source', source)
      if (sort) qs.set('sort', sort)
      const res = await api.get(`/leads?${qs.toString()}`)
      setLeads(res.data.data)
      setTotalPages(res.data.meta.pages)
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }, [page, debounced, status, source, sort])

  useEffect(() => {
    setPage(1)
  }, [debounced, status, source])

  useEffect(() => {
    load()
  }, [load])

  const exportCsv = async () => {
    try {
      const qs = new URLSearchParams()
      if (debounced) qs.set('search', debounced)
      if (status) qs.set('status', status)
      if (source) qs.set('source', source)
      if (sort) qs.set('sort', sort)
      const res = await api.get(`/leads/export?${qs.toString()}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'leads.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Failed to export CSV')
    }
  }

  const openAddModal = () => {
    setSelectedLead(undefined)
    setModalOpen(true)
  }

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead)
    setModalOpen(true)
  }

  const deleteLead = async (leadId: string) => {
    if (!confirm('Delete this lead?')) return
    try {
      await api.delete(`/leads/${leadId}`)
      load()
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Failed to delete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded transition-colors"
          >
            + Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded shadow p-4 mb-6 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
            />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors">
              <option value="">All status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors">
              <option value="">All source</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-colors">
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            <button onClick={exportCsv} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded transition-colors">
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded mb-4 transition-colors">{error}</div>}

        {/* Loading */}
        {loading && <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>}

        {/* Table */}
        {!loading && (
          <div className="bg-white dark:bg-slate-800 rounded shadow overflow-hidden transition-colors">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No leads found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-slate-700 border-b dark:border-slate-600 transition-colors">
                  <tr>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Name</th>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Email</th>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Status</th>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Source</th>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Created</th>
                    <th className="p-3 text-left text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="p-3 text-gray-900 dark:text-white">{lead.name}</td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{lead.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm text-white
                          ${lead.status === 'New' && 'bg-blue-500'}
                          ${lead.status === 'Contacted' && 'bg-yellow-500'}
                          ${lead.status === 'Qualified' && 'bg-green-500'}
                          ${lead.status === 'Lost' && 'bg-red-500'}
                        `}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{lead.source}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(lead)}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Edit
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => deleteLead(lead._id)}
                              className="text-red-600 dark:text-red-400 hover:underline text-sm"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </div>
            <div className="space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 border dark:border-slate-600 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-2 border dark:border-slate-600 rounded disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </main>

      <LeadModal open={modalOpen} lead={selectedLead} onClose={() => setModalOpen(false)} onSave={load} />
    </div>
  )
}
