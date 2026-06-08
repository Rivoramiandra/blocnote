import React, { useState, useEffect } from 'react'
import './EventModal.css'

function EventModal({ isOpen, onClose, onSave, initialDate, editingEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    date: initialDate,
    time: '',
    description: ''
  })

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        date: editingEvent.date,
        time: editingEvent.time || '',
        description: editingEvent.description || ''
      })
    } else {
      setFormData({
        title: '',
        date: initialDate,
        time: '',
        description: ''
      })
    }
  }, [editingEvent, initialDate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Veuillez entrer un titre')
      return
    }
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{editingEvent ? 'Modifier' : 'Ajouter'} un événement</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Réunion, Rendez-vous..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Heure (optionnel)</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Lieu, notes supplémentaires..."
              />
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-success">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal