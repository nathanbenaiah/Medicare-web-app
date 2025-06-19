// Database Manager for Health Assessments
// SQLite-based storage for user responses and AI analysis results

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class DatabaseManager {
    constructor() {
        this.dbPath = './database/health_assessments.db';
        this.db = null;
        this.init();
    }

    // Initialize database and create tables
    async init() {
        try {
            // Ensure database directory exists
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Connect to database
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ Database connection error:', err);
                } else {
                    console.log('✅ Connected to SQLite database');
                    this.createTables();
                }
            });
        } catch (error) {
            console.error('❌ Database initialization error:', error);
        }
    }

    // Create necessary tables
    createTables() {
        const tables = {
            // User assessments table
            assessments: `
                CREATE TABLE IF NOT EXISTS assessments (
                    id TEXT PRIMARY KEY,
                    feature_id TEXT NOT NULL,
                    user_ip TEXT,
                    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    completed_at DATETIME,
                    status TEXT DEFAULT 'in_progress',
                    total_questions INTEGER,
                    completed_questions INTEGER DEFAULT 0
                )
            `,
            
            // Individual question responses
            responses: `
                CREATE TABLE IF NOT EXISTS responses (
                    id TEXT PRIMARY KEY,
                    assessment_id TEXT NOT NULL,
                    question_index INTEGER NOT NULL,
                    question_type TEXT NOT NULL,
                    question_text TEXT NOT NULL,
                    response_value TEXT NOT NULL,
                    answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (assessment_id) REFERENCES assessments (id)
                )
            `,
            
            // AI analysis results
            ai_results: `
                CREATE TABLE IF NOT EXISTS ai_results (
                    id TEXT PRIMARY KEY,
                    assessment_id TEXT NOT NULL,
                    feature_id TEXT NOT NULL,
                    ai_prompt TEXT NOT NULL,
                    ai_response TEXT NOT NULL,
                    confidence_score REAL,
                    processing_time_ms INTEGER,
                    tokens_used INTEGER,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (assessment_id) REFERENCES assessments (id)
                )
            `
        };

        Object.entries(tables).forEach(([tableName, sql]) => {
            this.db.run(sql, (err) => {
                if (err) {
                    console.error(`❌ Error creating ${tableName} table:`, err);
                } else {
                    console.log(`✅ ${tableName} table ready`);
                }
            });
        });
    }

    // Start a new assessment
    async startAssessment(featureId, userIp = null, totalQuestions = 0) {
        return new Promise((resolve, reject) => {
            const assessmentId = uuidv4();
            const sql = `
                INSERT INTO assessments (id, feature_id, user_ip, total_questions)
                VALUES (?, ?, ?, ?)
            `;
            
            this.db.run(sql, [assessmentId, featureId, userIp, totalQuestions], function(err) {
                if (err) {
                    console.error('❌ Error starting assessment:', err);
                    reject(err);
                } else {
                    console.log(`✅ Started assessment: ${assessmentId}`);
                    resolve({ assessmentId, featureId, totalQuestions });
                }
            });
        });
    }

    // Save a question response
    async saveResponse(assessmentId, questionIndex, questionType, questionText, responseValue) {
        return new Promise((resolve, reject) => {
            const responseId = uuidv4();
            const sql = `
                INSERT INTO responses (id, assessment_id, question_index, question_type, question_text, response_value)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [responseId, assessmentId, questionIndex, questionType, questionText, responseValue], (err) => {
                if (err) {
                    console.error('❌ Error saving response:', err);
                    reject(err);
                } else {
                    console.log(`✅ Saved response: ${responseId}`);
                    // Update assessment progress
                    this.updateAssessmentProgress(assessmentId);
                    resolve(responseId);
                }
            });
        });
    }

    // Update assessment progress
    updateAssessmentProgress(assessmentId) {
        const updateSql = `
            UPDATE assessments 
            SET completed_questions = (
                SELECT COUNT(*) FROM responses WHERE assessment_id = ?
            )
            WHERE id = ?
        `;
        this.db.run(updateSql, [assessmentId, assessmentId]);
    }

    // Get all responses for an assessment
    async getAssessmentResponses(assessmentId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM responses 
                WHERE assessment_id = ? 
                ORDER BY question_index ASC
            `;
            
            this.db.all(sql, [assessmentId], (err, rows) => {
                if (err) {
                    console.error('❌ Error getting responses:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Complete an assessment
    async completeAssessment(assessmentId) {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE assessments 
                SET status = 'completed', completed_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            
            this.db.run(sql, [assessmentId], function(err) {
                if (err) {
                    console.error('❌ Error completing assessment:', err);
                    reject(err);
                } else {
                    console.log(`✅ Completed assessment: ${assessmentId}`);
                    resolve(assessmentId);
                }
            });
        });
    }

    // Save AI analysis result
    async saveAIResult(assessmentId, featureId, prompt, response, confidenceScore = null, processingTime = null, tokensUsed = null) {
        return new Promise((resolve, reject) => {
            const resultId = uuidv4();
            const sql = `
                INSERT INTO ai_results (id, assessment_id, feature_id, ai_prompt, ai_response, confidence_score, processing_time_ms, tokens_used)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            this.db.run(sql, [resultId, assessmentId, featureId, prompt, response, confidenceScore, processingTime, tokensUsed], function(err) {
                if (err) {
                    console.error('❌ Error saving AI result:', err);
                    reject(err);
                } else {
                    console.log(`✅ Saved AI result: ${resultId}`);
                    resolve(resultId);
                }
            });
        });
    }

    // Get AI result for assessment
    async getAIResult(assessmentId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM ai_results 
                WHERE assessment_id = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            
            this.db.all(sql, [assessmentId], (err, rows) => {
                if (err) {
                    console.error('❌ Error getting AI result:', err);
                    reject(err);
                } else {
                    resolve(rows[0] || null);
                }
            });
        });
    }

    // Close database connection
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('❌ Error closing database:', err);
                } else {
                    console.log('✅ Database connection closed');
                }
            });
        }
    }
}

// Export singleton instance
const dbManager = new DatabaseManager();
module.exports = dbManager; 