import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Calendar from './Calendar'
import EventModal from './EventModal'
import './Agenda.css'

function Agenda({ user, onLogout }) {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  // Fonction pour normaliser une date (corriger le décalage horaire)
  const normalizeDate = (dateStr) => {
    if (!dateStr) return ''
    // Si c'est une date ISO, la convertir en YYYY-MM-DD
    if (dateStr.includes('T')) {
      const date = new Date(dateStr)
      return date.toISOString().split('T')[0]
    }
    return dateStr.split('T')[0]
  }

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events')
      console.log('API Response brute:', res.data)
      
      let eventsData = []
      if (Array.isArray(res.data)) {
        eventsData = res.data
      } else if (res.data.events && Array.isArray(res.data.events)) {
        eventsData = res.data.events
      } else {
        eventsData = []
      }
      
      // Normaliser les dates des événements
      const normalizedEvents = eventsData.map(event => ({
        ...event,
        date: normalizeDate(event.date)
      }))
      
      console.log('Événements normalisés:', normalizedEvents)
      setEvents(normalizedEvents)
    } catch (error) {
      console.error('Erreur fetchEvents:', error)
      toast.error('Erreur lors du chargement des événements')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async (eventData) => {
    try {
      // S'assurer que la date est au bon format
      const formattedData = {
        ...eventData,
        date: eventData.date.split('T')[0]
      }
      
      const res = await axios.post('/api/events', formattedData)
      
      let newEvent = res.data
      if (res.data.event) newEvent = res.data.event
      
      // Normaliser la date du nouvel événement
      newEvent.date = normalizeDate(newEvent.date)
      
      setEvents([...events, newEvent])
      toast.success('Événement ajouté')
      setModalOpen(false)
    } catch (error) {
      console.error('Erreur addEvent:', error)
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout')
    }
  }

  const handleUpdateEvent = async (id, eventData) => {
    try {
      const formattedData = {
        ...eventData,
        date: eventData.date.split('T')[0]
      }
      
      const res = await axios.put(`/api/events/${id}`, formattedData)
      
      let updatedEvent = res.data
      if (res.data.event) updatedEvent = res.data.event
      updatedEvent.date = normalizeDate(updatedEvent.date)
      
      setEvents(events.map(e => e.id === id ? updatedEvent : e))
      toast.success('Événement modifié')
      setModalOpen(false)
      setEditingEvent(null)
    } catch (error) {
      console.error('Erreur updateEvent:', error)
      toast.error('Erreur lors de la modification')
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return
    try {
      await axios.delete(`/api/events/${id}`)
      setEvents(events.filter(e => e.id !== id))
      toast.success('Événement supprimé')
    } catch (error) {
      console.error('Erreur deleteEvent:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const getEventsByDate = (date) => {
    if (!Array.isArray(events)) {
      return []
    }
    
    const selectedDateStr = typeof date === 'string' ? date.split('T')[0] : new Date(date).toISOString().split('T')[0]
    
    const filtered = events.filter(e => {
      const eventDate = e.date ? e.date.split('T')[0] : ''
      return eventDate === selectedDateStr
    })
    
    return filtered
  }

  if (loading) {
    return <div className="loading">Chargement des événements...</div>
  }

  return (
    <div>
      <nav>
        <div className="nav-brand">
          <i className="fas fa-calendar-alt"></i> Agenda<span>Pro</span>
        </div>
        <div className="nav-actions">
          <div className="nav-user">
            <div className="avatar">{user.fullname?.charAt(0).toUpperCase() || 'U'}</div>
            <span>{user.fullname?.split(' ')[0] || 'User'}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="agenda-header">
          <div className="month-nav">
            <button onClick={() => {
              const newDate = new Date(currentMonth)
              newDate.setMonth(currentMonth.getMonth() - 1)
              setCurrentMonth(newDate)
            }}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="month-title">
              {currentMonth.toLocaleString('fr', { month: 'long', year: 'numeric' })}
            </div>
            <button onClick={() => {
              const newDate = new Date(currentMonth)
              newDate.setMonth(currentMonth.getMonth() + 1)
              setCurrentMonth(newDate)
            }}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <button className="btn-ghost btn-sm" onClick={() => {
              setCurrentMonth(new Date())
              setSelectedDate(new Date().toISOString().slice(0, 10))
            }}>
              Aujourd'hui
            </button>
            <button className="btn-ghost btn-sm" onClick={fetchEvents}>
              <i className="fas fa-sync-alt"></i> Rafraîchir
            </button>
          </div>
        </div>

        <Calendar
          currentMonth={currentMonth}
          events={events}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        <div className="selected-day-panel">
          <h3>
            {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            <i className="fas fa-clock"></i>
          </h3>
          <div className="day-events">
            {getEventsByDate(selectedDate).length === 0 ? (
              <div className="empty">Aucun événement ce jour</div>
            ) : (
              getEventsByDate(selectedDate).map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <span className="event-time">{event.time || 'Journée'}</span>
                    <span className="event-title">{event.title}</span>
                    {event.description && <span className="event-desc">{event.description}</span>}
                  </div>
                  <div className="event-actions">
                    <button className="btn-ghost btn-sm" onClick={() => {
                      setEditingEvent(event)
                      setModalOpen(true)
                    }}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => handleDeleteEvent(event.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="btn btn-success btn-sm" onClick={() => {
            setEditingEvent(null)
            setModalOpen(true)
          }}>
            <i className="fas fa-plus"></i> Ajouter un événement
          </button>
        </div>
      </div>

      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingEvent(null)
        }}
        onSave={editingEvent ? (data) => handleUpdateEvent(editingEvent.id, data) : handleAddEvent}
        initialDate={selectedDate}
        editingEvent={editingEvent}
      />
    </div>
  )
}

export default Agenda