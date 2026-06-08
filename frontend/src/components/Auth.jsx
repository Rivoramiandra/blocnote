import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '', fullname: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const res = await axios.post(endpoint, formData)
      onLogin(res.data.user, res.data.token)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>Agenda<span>Pro</span></h1>
          <p>Organisez votre temps, efficacement</p>
        </div>
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>
            Connexion
          </div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>
            Inscription
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input type="text" name="fullname" className="form-input" value={formData.fullname} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required minLength={5} />
          </div>
          <button type="submit" className="btn btn-success btn-full" disabled={loading}>
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>
        
        {isLogin && (
          <p className="demo-info">
            Demo: <strong>demo@agenda.mg</strong> / <strong>demo123</strong>
          </p>
        )}
      </div>
    </div>
  )
}

export default Auth