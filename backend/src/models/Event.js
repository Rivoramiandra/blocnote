import pool from '../config/database.js';

class Event {
  static async create({ userId, title, date, time, description }) {
    const result = await pool.query(
      `INSERT INTO events (user_id, title, event_date, event_time, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, event_date as date, event_time as time, description`,
      [userId, title, date, time || null, description || null]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await pool.query(
      `SELECT id, title, event_date as date, event_time as time, description 
       FROM events 
       WHERE user_id = $1 
       ORDER BY event_date ASC, event_time ASC`,
      [userId]
    );
    return result.rows;
  }

  static async findByMonth(userId, year, month) {
    const result = await pool.query(
      `SELECT id, title, event_date as date, event_time as time, description
       FROM events 
       WHERE user_id = $1 
         AND EXTRACT(YEAR FROM event_date) = $2 
         AND EXTRACT(MONTH FROM event_date) = $3
       ORDER BY event_date ASC, event_time ASC`,
      [userId, year, month]
    );
    return result.rows;
  }

  static async findByDate(userId, date) {
    const result = await pool.query(
      `SELECT id, title, event_date as date, event_time as time, description
       FROM events 
       WHERE user_id = $1 AND event_date = $2
       ORDER BY event_time ASC`,
      [userId, date]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM events WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  }

  static async update(id, userId, { title, date, time, description }) {
    const result = await pool.query(
      `UPDATE events 
       SET title = $1, event_date = $2, event_time = $3, description = $4
       WHERE id = $5 AND user_id = $6
       RETURNING id, title, event_date as date, event_time as time, description`,
      [title, date, time || null, description || null, id, userId]
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );
    return result.rows[0];
  }
  // Ajoutez à la fin de la classe Event dans Event.js

static async getUpcoming(userId, limit = 10) {
  const result = await pool.query(
    `SELECT id, title, event_date as date, event_time as time, description
     FROM events 
     WHERE user_id = $1 AND event_date >= CURRENT_DATE
     ORDER BY event_date ASC, event_time ASC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

static async countByMonth(userId, year, month) {
  const result = await pool.query(
    `SELECT COUNT(*) as count
     FROM events 
     WHERE user_id = $1 
       AND EXTRACT(YEAR FROM event_date) = $2 
       AND EXTRACT(MONTH FROM event_date) = $3`,
    [userId, year, month]
  );
  return parseInt(result.rows[0].count);
}
}

export default Event;