import Event from '../models/Event.js';

// @desc    Get all events for current user
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findByUser(req.user.id);
    res.json(events);
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Create new event
export const createEvent = async (req, res) => {
  try {
    const { title, date, time, description } = req.body;
    
    const cleanDate = date ? date.split('T')[0] : date;
    
    const event = await Event.create({
      userId: req.user.id,
      title,
      date: cleanDate,
      time: time || null,
      description: description || null
    });
    
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Update event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, time, description } = req.body;
    
    const existingEvent = await Event.findById(parseInt(id), req.user.id);
    if (!existingEvent) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    const cleanDate = date ? date.split('T')[0] : date;
    
    const event = await Event.update(parseInt(id), req.user.id, {
      title,
      date: cleanDate,
      time: time || null,
      description: description || null
    });
    
    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.delete(parseInt(id), req.user.id);
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json({ message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get events by month
export const getEventsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    // Récupérer tous les événements et filtrer par mois
    const allEvents = await Event.findByUser(req.user.id);
    const filteredEvents = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === parseInt(year) && 
             (eventDate.getMonth() + 1) === parseInt(month);
    });
    res.json(filteredEvents);
  } catch (error) {
    console.error('Get events by month error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get events by date
export const getEventsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const allEvents = await Event.findByUser(req.user.id);
    const cleanDate = date.split('T')[0];
    const filteredEvents = allEvents.filter(event => event.date === cleanDate);
    res.json(filteredEvents);
  } catch (error) {
    console.error('Get events by date error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get single event
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(parseInt(id), req.user.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Événement non trouvé' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get upcoming events
export const getUpcomingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const allEvents = await Event.findByUser(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const upcoming = allEvents
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
    res.json(upcoming);
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const { year, month } = req.params;
    const allEvents = await Event.findByUser(req.user.id);
    const count = allEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === parseInt(year) && 
             (eventDate.getMonth() + 1) === parseInt(month);
    }).length;
    res.json({ year, month, count });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};