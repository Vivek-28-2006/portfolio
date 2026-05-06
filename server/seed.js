const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const dataPath = path.join(__dirname, '..', 'data', 'portfolio.json');
const defaultPortfolio = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false
});

async function setupSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      summary TEXT NOT NULL,
      impact TEXT NOT NULL,
      tech_stack TEXT[] NOT NULL,
      link TEXT NOT NULL,
      repo TEXT NOT NULL,
      featured BOOLEAN DEFAULT false,
      display_order INTEGER DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT NOT NULL,
      display_order INTEGER DEFAULT 0
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      summary TEXT NOT NULL,
      highlights TEXT[] NOT NULL,
      display_order INTEGER DEFAULT 0
    );
  `);
}

async function seedDatabase() {
  const projectCount = await pool.query('SELECT COUNT(*) FROM projects');
  if (Number(projectCount.rows[0].count) === 0) {
    for (const project of defaultPortfolio.projects) {
      await pool.query(
        `
        INSERT INTO projects
          (title, category, summary, impact, tech_stack, link, repo, featured, display_order)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          project.title,
          project.category,
          project.summary,
          project.impact,
          project.techStack,
          project.link,
          project.repo,
          project.featured,
          project.order
        ]
      );
    }
  }

  const skillCount = await pool.query('SELECT COUNT(*) FROM skills');
  if (Number(skillCount.rows[0].count) === 0) {
    for (const skill of defaultPortfolio.skills) {
      await pool.query(
        'INSERT INTO skills (name, category, level, display_order) VALUES ($1, $2, $3, $4)',
        [skill.name, skill.category, skill.level, skill.order]
      );
    }
  }

  const experienceCount = await pool.query('SELECT COUNT(*) FROM experience');
  if (Number(experienceCount.rows[0].count) === 0) {
    for (const entry of defaultPortfolio.experience) {
      await pool.query(
        'INSERT INTO experience (role, company, period, summary, highlights, display_order) VALUES ($1, $2, $3, $4, $5, $6)',
        [entry.role, entry.company, entry.period, entry.summary, entry.highlights, entry.order]
      );
    }
  }
}

async function run() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is required to seed PostgreSQL.');
    process.exit(1);
  }

  await pool.query('SELECT NOW()');
  await setupSchema();
  await seedDatabase();
  await pool.end();
  console.log('PostgreSQL seeded with portfolio content.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
