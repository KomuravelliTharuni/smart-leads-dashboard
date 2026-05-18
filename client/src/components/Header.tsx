import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthToken } from '../api'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

export default function Header(){
  const nav = useNavigate()
  const { user, setUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  
  const logout = ()=>{
    localStorage.removeItem('token')
    setAuthToken(undefined)
    setUser(null)
    nav('/login')
  }
  
  return (
    <header className="bg-white dark:bg-slate-900 shadow sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/leads" className="text-lg font-bold text-blue-600 dark:text-blue-400">Smart Leads</Link>
        <nav className="flex gap-6 items-center">
          <Link to="/leads" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Leads</Link>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{user.name} <span className="font-medium">({user.role})</span></span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm"
                title="Toggle dark mode"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              <button onClick={logout} className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
