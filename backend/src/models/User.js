import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create({ email, password, fullname }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (email, password_hash, fullname)
      VALUES ($1, $2, $3)
      RETURNING id, email, fullname, created_at
    `;
    const values = [email, hashedPassword, fullname];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, fullname, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }

  static async update(id, { fullname, email }) {
    const query = `
      UPDATE users 
      SET fullname = $1, email = $2
      WHERE id = $3
      RETURNING id, email, fullname
    `;
    const result = await pool.query(query, [fullname, email, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default User;