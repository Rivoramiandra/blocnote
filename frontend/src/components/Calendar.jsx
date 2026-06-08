import React from 'react'
import './Calendar.css'

function Calendar({ currentMonth, events, selectedDate, onSelectDate }) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = firstDayOfMonth.getDay()
  const startOffset = startWeekday === 0 ? 6 : startWeekday - 1
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  
  const today = new Date().toISOString().slice(0, 10)
  
  const getEventsByDate = (date) => events.filter(e => e.date === date)
  
  const calendarDays = []
  
  for (let i = 0; i < 42; i++) {
    let dayNumber = i - startOffset + 1
    let isCurrentMonth = true
    let fullDate = ''
    let displayDate = ''
    
    if (dayNumber <= 0) {
      isCurrentMonth = false
      dayNumber = prevMonthDays + dayNumber
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      fullDate = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
      displayDate = dayNumber
    } else if (dayNumber > daysInMonth) {
      isCurrentMonth = false
      dayNumber = dayNumber - daysInMonth
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      fullDate = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
      displayDate = dayNumber
    } else {
      fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
      displayDate = dayNumber
    }
    
    const dayEvents = getEventsByDate(fullDate)
    const isToday = fullDate === today
    const isSelected = fullDate === selectedDate
    
    calendarDays.push(
      <div
        key={i}
        className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelectDate(fullDate)}
      >
        <div className="day-number">{displayDate}</div>
        <div className="event-dots">
          {dayEvents.slice(0, 2).map(event => (
            <div key={event.id} className="event-dot" title={event.title}>
              {event.time && <span className="event-time-dot">{event.time}</span>}
              <span className="event-title-dot">{event.title}</span>
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="event-more">+{dayEvents.length - 2}</div>
          )}
        </div>
      </div>
    )
  }
  
  return (
    <div className="calendar-grid">
      <div className="weekdays">
        <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
      </div>
      <div className="calendar-days">
        {calendarDays}
      </div>
    </div>
  )
}

export default Calendar