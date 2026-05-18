import { useState, useEffect, createContext, useContext } from 'react'
import api, { setAuthToken } from '../api'

type User = { _id: string; name: string; email: string; role: string } | null

const AuthContext = createContext<{ user: User; setUser: (u: User)=>void }>({ user: null, setUser: ()=>{} })

export function AuthProvider({ children }: any){
  const [user, setUser] = useState<User>(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (token){
      setAuthToken(token)
      api.get('/auth/me').then(r=> setUser(r.data)).catch(()=>{
        setAuthToken(undefined)
        localStorage.removeItem('token')
      })
    }
  },[])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth(){
  return useContext(AuthContext)
}
