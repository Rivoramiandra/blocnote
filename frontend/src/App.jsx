import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Auth from './components/Auth'
import Agenda from './components/Agenda'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

axios.defaults.baseURL = '/api'

// Intercepteur pour ajouter le token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    toast.success(`Bienvenue ${userData.fullname}!`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Déconnecté')
  }

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  return (
    <ErrorBoundary>
      <Toaster position="bottom-right" />
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Agenda user={user} onLogout={handleLogout} />
      )}
    </ErrorBoundary>
  )
}

export default App