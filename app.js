/**
 * ============================================================================
 * Swimming Student Tracker Application
 * ============================================================================
 * 
 * A web application for tracking student progress through the RLSS Swim for Life Program.
 * 
 * Features:
 * - Student management (Create, Read, Update, Delete operations)
 * - Skill progress tracking across multiple swim levels
 * - AI-powered report card generation using Anthropic's Claude API
 * - SQLite database for persistent storage
 * 
 * Technology Stack:
 * - Express.js: Web server framework
 * - SQLite3: Local database
 * - Anthropic API: AI report card generation
 * 
 * Database Structure:
 * - Single table: students
 * - Skills stored as JSON strings (parsed/stringified as needed)
 * 
 * API Endpoints:
 * - GET    /api/students          - List all students
 * - GET    /api/students/:id      - Get single student
 * - POST   /api/students          - Create new student
 * - PUT    /api/students/:id      - Update student
 * - DELETE /api/students/:id      - Delete student
 * - PUT    /api/students/:id/skills - Update specific skill status
 * - POST   /api/students/:id/report-card - Generate AI report card
 */

// ============================================================================
// Dependencies
// ============================================================================

// Express: Web application framework for handling HTTP requests/responses
const express = require('express');

// SQLite3: Embedded database for storing student data
// .verbose() enables detailed error messages for debugging
const sqlite3 = require('sqlite3').verbose();

// Path: Node.js module for working with file and directory paths
const path = require('path');

// FS Promises: File system operations using promises (for async/await)
const fs = require('fs').promises;

// ============================================================================
// Application Setup
// ============================================================================

// Create Express application instance
const app = express();

// Set server port from environment variable or default to 3000
// Environment variables allow different ports in development vs. production
const PORT = process.env.PORT || 3000;

// ============================================================================
// Middleware Configuration
// ============================================================================

// Parse incoming JSON request bodies automatically
// This converts JSON strings in requests to JavaScript objects in req.body
app.use(express.json());

// Serve static files (HTML, CSS, JavaScript, images) from 'public' directory
// Files in 'public' folder are accessible directly via URL paths
app.use(express.static('public'));

// ============================================================================
// Database Initialization
// ============================================================================

// Create/open SQLite database file
// './students.db' creates the database file in the current directory
// The callback function runs after the database connection is established
const db = new sqlite3.Database('./students.db', (err) => {
    if (err) {
        // Log error if database connection fails
        console.error('Error opening database', err);
    } else {
        // Connection successful - proceed with table initialization
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

/**
 * Initialize database schema
 * Creates the students table if it doesn't already exist
 * 
 * Table Structure:
 * - id: Auto-incrementing primary key
 * - name: Student's full name (required)
 * - age: Student's age (optional)
 * - level: Swim level/class (required)
 * - skills: JSON string containing all skills and their statuses
 * - notes: Instructor notes (optional)
 * - created_at: Timestamp when record was created
 * - updated_at: Timestamp when record was last modified
 */
function initializeDatabase() {
    // CREATE TABLE IF NOT EXISTS prevents errors if table already exists
    // This is safe to run every time the application starts
    db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER,
        level TEXT NOT NULL,
        skills TEXT NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
}

// ============================================================================
// API Routes - Student Management
// ============================================================================

/**
 * GET /api/students
 * Retrieve all students from the database
 * 
 * Response Format:
 * [
 *   {
 *     id: 1,
 *     name: "John Doe",
 *     age: 8,
 *     level: "Swimmer 1",
 *     skills: "{...}",  // JSON string
 *     notes: "Making good progress",
 *     created_at: "2024-01-15 10:30:00",
 *     updated_at: "2024-01-20 14:15:00"
 *   },
 *   ...
 * ]
 */
app.get('/api/students', (req, res) => {
    // db.all() retrieves ALL rows that match the query
    // Empty array [] means no parameters (no ? placeholders in query)
    // Results are ordered alphabetically by name for easier browsing
    db.all('SELECT * FROM students ORDER BY name', [], (err, rows) => {
        if (err) {
            // 500 = Internal Server Error (database error)
            res.status(500).json({ error: err.message });
            return;
        }
        // Send all student records as JSON array
        res.json(rows);
    });
});

/**
 * GET /api/students/:id
 * Retrieve a single student by ID
 * 
 * URL Parameters:
 * - id: Student's database ID
 * 
 * Response: Single student object (see GET /api/students for format)
 * 
 * Error Responses:
 * - 404: Student not found
 * - 500: Database error
 */
app.get('/api/students/:id', (req, res) => {
    // Extract the ID from the URL parameter
    // req.params contains all :parameter values from the route
    const studentId = req.params.id;
    
    // db.get() retrieves only ONE row (the first match)
    // ? is a placeholder that gets replaced with studentId (prevents SQL injection)
    db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
        if (err) {
            // Database error occurred
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            // No student found with this ID
            // 404 = Not Found
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        // Send the student record
        res.json(row);
    });
});

/**
 * POST /api/students
 * Create a new student
 * 
 * Request Body:
 * {
 *   name: "Jane Smith",     // Required
 *   age: 10,                // Optional
 *   level: "Swimmer 2",     // Required
 *   notes: "Needs goggles"  // Optional
 * }
 * 
 * Response:
 * {
 *   id: 5,
 *   name: "Jane Smith",
 *   age: 10,
 *   level: "Swimmer 2",
 *   skills: {...},
 *   notes: "Needs goggles",
 *   message: "Student added successfully"
 * }
 * 
 * Skills are automatically initialized based on the level
 */
app.post('/api/students', (req, res) => {
    // Destructure the request body to extract relevant fields
    // This pulls out only the properties we need
    const { name, age, level, notes = '' } = req.body;
    
    // Validate required fields
    // Name and level are mandatory for creating a student
    if (!name || !level) {
        // 400 = Bad Request (client sent invalid data)
        return res.status(400).json({ error: 'Name and level are required' });
    }
    
    // Get the default skill set for this level
    // Each level has different skills that students need to master
    const skills = getDefaultSkillsForLevel(level);
    
    // Prepare SQL INSERT statement
    // datetime('now') automatically sets current timestamp
    const sql = `INSERT INTO students (name, age, level, skills, notes, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;
    
    // Execute the INSERT query
    // Skills object is converted to JSON string for storage
    // Regular function (not arrow) is used because we need access to 'this.lastID'
    db.run(sql, [name, age, level, JSON.stringify(skills), notes], function(err) {
        if (err) {
            // Database error (e.g., constraint violation)
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Success! Send back the newly created student data
        // this.lastID contains the auto-generated ID of the new record
        res.json({
            id: this.lastID,
            name,
            age,
            level,
            skills,
            notes,
            message: 'Student added successfully'
        });
    });
});

/**
 * PUT /api/students/:id
 * Update an existing student's information
 * 
 * URL Parameters:
 * - id: Student's database ID
 * 
 * Request Body (all fields optional):
 * {
 *   name: "Updated Name",
 *   age: 11,
 *   level: "Swimmer 3",
 *   skills: {...},
 *   notes: "Updated notes"
 * }
 * 
 * Strategy: Merge new data with existing data
 * - Only fields included in request are updated
 * - Omitted fields keep their current values
 * 
 * Response: Updated student object with success message
 */
app.put('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    const { name, age, level, skills, notes } = req.body;
    
    // First, retrieve the current student data from database
    // This allows us to merge updates with existing values
    db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, currentStudent) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!currentStudent) {
            // Student with this ID doesn't exist
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        
        // Merge updates with current data using ternary operator
        // Pattern: value !== undefined ? newValue : currentValue
        // This preserves existing values if new values aren't provided
        const updatedName = name !== undefined ? name : currentStudent.name;
        const updatedAge = age !== undefined ? age : currentStudent.age;
        const updatedLevel = level !== undefined ? level : currentStudent.level;
        
        // Skills need special handling because they're stored as JSON strings
        // Parse current skills from string, or use new skills if provided
        const updatedSkills = skills !== undefined ? skills : JSON.parse(currentStudent.skills);
        const updatedNotes = notes !== undefined ? notes : currentStudent.notes;
        
        // Prepare UPDATE query
        // Only update the fields, updated_at timestamp, for this specific ID
        const sql = `UPDATE students 
                     SET name = ?, age = ?, level = ?, skills = ?, notes = ?, updated_at = datetime('now')
                     WHERE id = ?`;
        
        // Execute the update
        // Skills object is stringified back to JSON for storage
        // studentId is the last parameter to match the final ? in WHERE clause
        db.run(sql, [updatedName, updatedAge, updatedLevel, JSON.stringify(updatedSkills), updatedNotes, studentId], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Send back the updated student data
            res.json({
                id: studentId,
                name: updatedName,
                age: updatedAge,
                level: updatedLevel,
                skills: updatedSkills,
                notes: updatedNotes,
                message: 'Student updated successfully'
            });
        });
    });
});

/**
 * DELETE /api/students/:id
 * Remove a student from the database
 * 
 * URL Parameters:
 * - id: Student's database ID
 * 
 * Response:
 * {
 *   message: "Student deleted successfully"
 * }
 * 
 * Error Responses:
 * - 404: Student not found
 * - 500: Database error
 * 
 * Note: This is a permanent deletion with no recovery option
 */
app.delete('/api/students/:id', (req, res) => {
    const studentId = req.params.id;
    
    // Execute DELETE query
    // Regular function used to access 'this.changes'
    db.run('DELETE FROM students WHERE id = ?', [studentId], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // this.changes tells us how many rows were affected
        // If 0, the student ID didn't exist in the database
        if (this.changes === 0) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        
        // Deletion successful
        res.json({ message: 'Student deleted successfully' });
    });
});

// ============================================================================
// API Routes - Skills Management
// ============================================================================

/**
 * PUT /api/students/:id/skills
 * Update the status of a specific skill for a student
 * 
 * URL Parameters:
 * - id: Student's database ID
 * 
 * Request Body:
 * {
 *   skillId: "pt-wc-1",              // Skill's unique identifier
 *   status: "mastered"               // New status for this skill
 * }
 * 
 * Valid Status Values:
 * - "not-started": Student hasn't attempted this skill yet
 * - "practicing": Student is working on this skill
 * - "proficient": Student can perform skill consistently
 * - "mastered": Student has fully mastered this skill
 * 
 * Process:
 * 1. Validate inputs
 * 2. Retrieve student's current skills
 * 3. Find the specific skill in the nested structure
 * 4. Update its status
 * 5. Save back to database
 */
app.put('/api/students/:id/skills', (req, res) => {
    const studentId = req.params.id;
    const { skillId, status } = req.body;
    
    // Validate that both required fields are present
    if (!skillId || !status) {
        return res.status(400).json({ error: 'Skill ID and status are required' });
    }

    // Validate that status is one of the four allowed values
    // This prevents invalid statuses from being stored
    if (!['not-started', 'practicing', 'proficient', 'mastered'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    // Retrieve only the skills column for this student
    // We don't need the entire record, just the skills JSON
    db.get('SELECT skills FROM students WHERE id = ?', [studentId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!row) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }

        // Parse the skills JSON string into a JavaScript object
        // Structure: { "Category Name": [ {skill}, {skill}, ... ], ... }
        const skills = JSON.parse(row.skills);

        // Search through all skill categories to find the matching skill
        // Flag to track whether we found the skill
        let skillFound = false;
        
        // Loop through each category (e.g., "Water Comfort", "Submersion")
        for (let category in skills) {
            // Within this category, find the skill with matching ID
            // .find() returns the first matching element or undefined
            const skill = skills[category].find(s => s.id === skillId);
            
            if (skill) {
                // Found the skill! Update its status
                skill.status = status;
                skillFound = true;
                break; // Stop searching once we've found and updated it
            }
        }

        // If we searched all categories and didn't find the skill
        if (!skillFound) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        // Save the updated skills back to the database
        // Convert object back to JSON string for storage
        // Update the timestamp to track when this change was made
        const sql = 'UPDATE students SET skills = ?, updated_at = datetime(\'now\') WHERE id = ?';
        
        db.run(sql, [JSON.stringify(skills), studentId], (err) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Success! Confirm which skill was updated
            res.json({ 
                message: 'Skill updated successfully',
                updatedSkill: {
                    skillId,
                    status
                }
            });
        });
    });
});

// ============================================================================
// API Routes - AI Report Card Generation
// ============================================================================

/**
 * POST /api/students/:id/report-card
 * Generate an AI-powered progress report card for a student
 * 
 * URL Parameters:
 * - id: Student's database ID
 * 
 * Process:
 * 1. Retrieve student data from database
 * 2. Calculate progress statistics (mastered, proficient, etc.)
 * 3. Organize skills by status for clarity
 * 4. Build detailed prompt for AI
 * 5. Call Anthropic API with Claude
 * 6. Return generated report card with statistics
 * 
 * Response:
 * {
 *   reportCard: "Dear parents...",  // AI-generated text
 *   stats: {
 *     totalSkills: 20,
 *     masteredSkills: 5,
 *     proficientSkills: 8,
 *     practicingSkills: 4,
 *     notStartedSkills: 3,
 *     progressPercentage: 65
 *   }
 * }
 * 
 * Note: Requires ANTHROPIC_API_KEY environment variable to be set
 */
app.post('/api/students/:id/report-card', async (req, res) => {
    const studentId = req.params.id;
    
    // Use try-catch for error handling in async functions
    // Any errors in this block will be caught and handled
    try {
        // Wrap SQLite callback in Promise to use with async/await
        // This pattern converts old-style callbacks to modern promises
        // Makes the code more readable than nested callbacks
        const student = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
                if (err) reject(err);        // On error, reject the promise
                else resolve(row);            // On success, resolve with the data
            });
        });

        // Check if student exists before proceeding
        // Important to validate before making expensive API call
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Parse skills from JSON string to JavaScript object
        const skills = JSON.parse(student.skills);

        // ====================================================================
        // Calculate Progress Statistics
        // ====================================================================
        
        // Initialize counters for each skill status
        // These will be used to calculate overall progress percentage
        let totalSkills = 0;
        let masteredSkills = 0;
        let proficientSkills = 0;
        let practicingSkills = 0;
        let notStartedSkills = 0;

        // Loop through all skill categories
        // Count skills by their status for statistics
        for (let category in skills) {
            // For each skill in this category
            skills[category].forEach(skill => {
                totalSkills++;  // Count every skill
                
                // Increment the appropriate counter based on status
                if (skill.status === 'mastered') masteredSkills++;
                else if (skill.status === 'proficient') proficientSkills++;
                else if (skill.status === 'practicing') practicingSkills++;
                else if (skill.status === 'not-started') notStartedSkills++;
            });
        }

        // Calculate overall progress percentage
        // We consider both mastered AND proficient skills as "complete"
        // Avoid division by zero with ternary operator
        const progressPercentage = totalSkills > 0 
            ? Math.round(((masteredSkills + proficientSkills) / totalSkills) * 100)
            : 0;

        // ====================================================================
        // Organize Skills by Status for AI
        // ====================================================================
        
        // Create lists of skills grouped by their status
        // This makes it easier for the AI to understand the student's progress
        const skillsByStatus = {
            mastered: [],
            proficient: [],
            practicing: [],
            notStarted: []
        };

        // Populate the status-grouped lists
        // Format: "Category Name: Skill Name" for clarity
        for (let category in skills) {
            skills[category].forEach(skill => {
                const skillEntry = `${category}: ${skill.name}`;
                
                // Add to the appropriate list based on status
                if (skill.status === 'mastered') {
                    skillsByStatus.mastered.push(skillEntry);
                } else if (skill.status === 'proficient') {
                    skillsByStatus.proficient.push(skillEntry);
                } else if (skill.status === 'practicing') {
                    skillsByStatus.practicing.push(skillEntry);
                } else if (skill.status === 'not-started') {
                    skillsByStatus.notStarted.push(skillEntry);
                }
            });
        }

        // ====================================================================
        // Build AI Prompt
        // ====================================================================
        
        // Create detailed prompt for the AI
        // Template literal (backticks) allows multi-line strings and ${} expressions
        const prompt = `You are a swimming instructor writing a progress report card for a student. Please write a warm, encouraging, and specific report card based on the following information:

Student Name: ${student.name}
Age: ${student.age || 'Not specified'}
Level: ${student.level}
Overall Progress: ${progressPercentage}% complete

Skills Mastered (${masteredSkills}):
${skillsByStatus.mastered.length > 0 ? skillsByStatus.mastered.join('\n') : 'None yet'}

Skills Proficient (${proficientSkills}):
${skillsByStatus.proficient.length > 0 ? skillsByStatus.proficient.join('\n') : 'None yet'}

Skills Practicing (${practicingSkills}):
${skillsByStatus.practicing.length > 0 ? skillsByStatus.practicing.join('\n') : 'None yet'}

Skills Not Started (${notStartedSkills}):
${skillsByStatus.notStarted.length > 0 ? skillsByStatus.notStarted.join('\n') : 'None yet'}

Instructor Notes: ${student.notes || 'No additional notes'}

Please write a report card that:
1. Celebrates the student's achievements
2. Provides specific feedback on their mastered and proficient skills
3. Encourages continued practice on skills they're working on
4. Sets positive goals for skills not yet started
5. Is age-appropriate and motivating
6. Is suitable to share with parents/guardians

Keep the tone warm, professional, and encouraging. Format it as a proper report card.`;

        // ====================================================================
        // Call Anthropic API
        // ====================================================================
        
        // Make HTTP POST request to Anthropic's Claude API
        // await pauses execution until the API responds
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // API key from environment variable for security
                // Never hardcode API keys in source code
                'x-api-key': process.env.ANTHROPIC_API_KEY || '',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',  // Specific Claude model
                max_tokens: 1024,                      // Limit response length
                messages: [{
                    role: 'user',
                    content: prompt                     // Our detailed prompt
                }]
            })
        });

        // Check if the API request was successful
        // response.ok is true for status codes 200-299
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        // Parse the JSON response from the API
        const data = await response.json();
        
        // Extract the AI-generated text from the response
        // Anthropic API returns content as an array with text blocks
        const reportCard = data.content[0].text;

        // ====================================================================
        // Send Response
        // ====================================================================
        
        // Return both the AI-generated report card and statistics
        // This gives the frontend everything needed to display results
        res.json({
            reportCard,
            stats: {
                totalSkills,
                masteredSkills,
                proficientSkills,
                practicingSkills,
                notStartedSkills,
                progressPercentage
            }
        });

    } catch (error) {
        // Catch any errors that occurred during the process
        // This includes: database errors, API errors, network errors
        console.error('Error generating report card:', error);
        
        // Send error response to client
        res.status(500).json({ 
            error: 'Failed to generate report card',
            details: error.message 
        });
    }
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get default skills for a given swim level
 * 
 * Each level in the RLSS Swim for Life Program has a specific set of skills
 * that students need to master. This function returns the appropriate skill
 * set based on the level.
 * 
 * @param {string} level - The swim level (e.g., "Parent & Tot", "Swimmer 1")
 * @returns {object} Object containing skill categories with arrays of skills
 * 
 * Skill Object Structure:
 * {
 *   "Category Name": [
 *     { id: "unique-id", name: "Skill description", status: "not-started" },
 *     ...
 *   ],
 *   ...
 * }
 * 
 * All skills start with status "not-started" when a student is created
 */
function getDefaultSkillsForLevel(level) {
    // Master object containing all skill sets for all levels
    // Each level is a key that maps to its skill categories
    const skillSets = {
        // ====================================================================
        // Parent & Tot Level
        // ====================================================================
        'Parent & Tot': {
            'Water Comfort': [
                { id: 'pt-wc-1', name: 'Entering and exiting the pool safely', status: 'not-started' },
                { id: 'pt-wc-2', name: 'Getting face wet', status: 'not-started' },
                { id: 'pt-wc-3', name: 'Comfort in water environment', status: 'not-started' }
            ],
            'Submersion': [
                { id: 'pt-sub-1', name: 'Voluntary submersion of mouth', status: 'not-started' },
                { id: 'pt-sub-2', name: 'Blowing bubbles', status: 'not-started' }
            ],
            'Buoyancy': [
                { id: 'pt-boy-1', name: 'Front float with support', status: 'not-started' },
                { id: 'pt-boy-2', name: 'Back float with support', status: 'not-started' }
            ],
            'Movement': [
                { id: 'pt-mov-1', name: 'Moving through water with support', status: 'not-started' },
                { id: 'pt-mov-2', name: 'Kicking with support', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Preschooler Level
        // ====================================================================
        'Preschooler': {
            'Water Comfort': [
                { id: 'ps-wc-1', name: 'Independent entry and exit', status: 'not-started' },
                { id: 'ps-wc-2', name: 'Moving around pool independently', status: 'not-started' },
                { id: 'ps-wc-3', name: 'Comfort with face in water', status: 'not-started' }
            ],
            'Submersion': [
                { id: 'ps-sub-1', name: 'Full face submersion', status: 'not-started' },
                { id: 'ps-sub-2', name: 'Opening eyes underwater', status: 'not-started' },
                { id: 'ps-sub-3', name: 'Retrieving objects from shallow water', status: 'not-started' }
            ],
            'Buoyancy': [
                { id: 'ps-boy-1', name: 'Front float (3 seconds)', status: 'not-started' },
                { id: 'ps-boy-2', name: 'Back float (3 seconds)', status: 'not-started' },
                { id: 'ps-boy-3', name: 'Recovery to standing', status: 'not-started' }
            ],
            'Movement': [
                { id: 'ps-mov-1', name: 'Front glide (2m)', status: 'not-started' },
                { id: 'ps-mov-2', name: 'Flutter kick on front', status: 'not-started' },
                { id: 'ps-mov-3', name: 'Flutter kick on back', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 1 Level
        // ====================================================================
        'Swimmer 1': {
            'Submersion': [
                { id: 's1-sub-1', name: 'Underwater swim (2m)', status: 'not-started' },
                { id: 's1-sub-2', name: 'Retrieving objects in deep water', status: 'not-started' }
            ],
            'Front Crawl': [
                { id: 's1-fc-1', name: 'Front glide (5m)', status: 'not-started' },
                { id: 's1-fc-2', name: 'Flutter kick (10m)', status: 'not-started' },
                { id: 's1-fc-3', name: 'Front crawl arms (10m)', status: 'not-started' },
                { id: 's1-fc-4', name: 'Front crawl with side breathing (5m)', status: 'not-started' }
            ],
            'Back Crawl': [
                { id: 's1-bc-1', name: 'Back glide (5m)', status: 'not-started' },
                { id: 's1-bc-2', name: 'Flutter kick on back (10m)', status: 'not-started' },
                { id: 's1-bc-3', name: 'Back crawl arms (10m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's1-ws-1', name: 'Treading water (10 seconds)', status: 'not-started' },
                { id: 's1-ws-2', name: 'Jump into deep water', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 2 Level
        // ====================================================================
        'Swimmer 2': {
            'Front Crawl': [
                { id: 's2-fc-1', name: 'Front crawl (25m)', status: 'not-started' },
                { id: 's2-fc-2', name: 'Bilateral breathing', status: 'not-started' }
            ],
            'Back Crawl': [
                { id: 's2-bc-1', name: 'Back crawl (25m)', status: 'not-started' }
            ],
            'Breaststroke': [
                { id: 's2-br-1', name: 'Breaststroke kick (10m)', status: 'not-started' },
                { id: 's2-br-2', name: 'Breaststroke arms (10m)', status: 'not-started' },
                { id: 's2-br-3', name: 'Breaststroke (15m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's2-ws-1', name: 'Treading water (30 seconds)', status: 'not-started' },
                { id: 's2-ws-2', name: 'Surface dive - head first', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 3 Level
        // ====================================================================
        'Swimmer 3': {
            'Front Crawl': [
                { id: 's3-fc-1', name: 'Front crawl (50m)', status: 'not-started' },
                { id: 's3-fc-2', name: 'Shallow dive entry', status: 'not-started' }
            ],
            'Back Crawl': [
                { id: 's3-bc-1', name: 'Back crawl (50m)', status: 'not-started' }
            ],
            'Breaststroke': [
                { id: 's3-br-1', name: 'Breaststroke (25m)', status: 'not-started' }
            ],
            'Butterfly': [
                { id: 's3-fly-1', name: 'Butterfly kick (10m)', status: 'not-started' },
                { id: 's3-fly-2', name: 'Butterfly arms (10m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's3-ws-1', name: 'Treading water (1 minute)', status: 'not-started' },
                { id: 's3-ws-2', name: 'Surface dive - feet first', status: 'not-started' },
                { id: 's3-ws-3', name: 'Swimming with clothes on (15m)', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 4 Level
        // ====================================================================
        'Swimmer 4': {
            'Endurance': [
                { id: 's4-end-1', name: 'Front crawl (75m)', status: 'not-started' },
                { id: 's4-end-2', name: 'Back crawl (75m)', status: 'not-started' },
                { id: 's4-end-3', name: 'Breaststroke (50m)', status: 'not-started' },
                { id: 's4-end-4', name: 'Continuous swim (150m)', status: 'not-started' }
            ],
            'Butterfly': [
                { id: 's4-fly-1', name: 'Butterfly (15m)', status: 'not-started' }
            ],
            'Starts & Turns': [
                { id: 's4-st-1', name: 'Racing dive', status: 'not-started' },
                { id: 's4-st-2', name: 'Front crawl flip turn', status: 'not-started' },
                { id: 's4-st-3', name: 'Breaststroke turn', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's4-ws-1', name: 'Treading water (2 minutes)', status: 'not-started' },
                { id: 's4-ws-2', name: 'Survival swim (5 minutes)', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 5 Level
        // ====================================================================
        'Swimmer 5': {
            'Endurance': [
                { id: 's5-end-1', name: 'Front crawl (100m)', status: 'not-started' },
                { id: 's5-end-2', name: 'Back crawl (100m)', status: 'not-started' },
                { id: 's5-end-3', name: 'Breaststroke (75m)', status: 'not-started' },
                { id: 's5-end-4', name: 'Butterfly (25m)', status: 'not-started' },
                { id: 's5-end-5', name: 'Continuous swim (300m)', status: 'not-started' }
            ],
            'Individual Medley': [
                { id: 's5-im-1', name: '100m Individual Medley', status: 'not-started' }
            ],
            'Starts & Turns': [
                { id: 's5-st-1', name: 'Backstroke start', status: 'not-started' },
                { id: 's5-st-2', name: 'Backstroke flip turn', status: 'not-started' },
                { id: 's5-st-3', name: 'Butterfly turn', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's5-ws-1', name: 'Treading water (3 minutes)', status: 'not-started' },
                { id: 's5-ws-2', name: 'Survival swim (10 minutes)', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Swimmer 6 Level
        // ====================================================================
        'Swimmer 6': {
            'Advanced Endurance': [
                { id: 's6-end-1', name: 'Front crawl (200m)', status: 'not-started' },
                { id: 's6-end-2', name: 'Back crawl (200m)', status: 'not-started' },
                { id: 's6-end-3', name: 'Breaststroke (100m)', status: 'not-started' },
                { id: 's6-end-4', name: 'Butterfly (50m)', status: 'not-started' },
                { id: 's6-end-5', name: 'Continuous swim (400m)', status: 'not-started' }
            ],
            'Individual Medley': [
                { id: 's6-im-1', name: '200m Individual Medley', status: 'not-started' }
            ],
            'Speed Work': [
                { id: 's6-speed-1', name: 'Sprint front crawl (25m)', status: 'not-started' },
                { id: 's6-speed-2', name: 'Sprint backstroke (25m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 's6-ws-1', name: 'Survival swim (15 minutes)', status: 'not-started' },
                { id: 's6-ws-2', name: 'Basic rescue skills', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Adult Beginner Level
        // ====================================================================
        'Adult Beginner': {
            'Water Comfort': [
                { id: 'ab-wc-1', name: 'Entering and exiting pool safely', status: 'not-started' },
                { id: 'ab-wc-2', name: 'Walking in waist-deep water', status: 'not-started' },
                { id: 'ab-wc-3', name: 'Getting face wet', status: 'not-started' }
            ],
            'Breathing': [
                { id: 'ab-br-1', name: 'Blowing bubbles at surface', status: 'not-started' },
                { id: 'ab-br-2', name: 'Bobbing with breath control', status: 'not-started' }
            ],
            'Floating': [
                { id: 'ab-fl-1', name: 'Front float with support', status: 'not-started' },
                { id: 'ab-fl-2', name: 'Back float with support', status: 'not-started' },
                { id: 'ab-fl-3', name: 'Independent front float', status: 'not-started' },
                { id: 'ab-fl-4', name: 'Independent back float', status: 'not-started' }
            ],
            'Basic Movement': [
                { id: 'ab-mov-1', name: 'Front glide (3m)', status: 'not-started' },
                { id: 'ab-mov-2', name: 'Flutter kick with kickboard', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Adult Intermediate Level
        // ====================================================================
        'Adult Intermediate': {
            'Submersion': [
                { id: 'ai-sub-1', name: 'Full face submersion', status: 'not-started' },
                { id: 'ai-sub-2', name: 'Opening eyes underwater', status: 'not-started' }
            ],
            'Front Crawl': [
                { id: 'ai-fc-1', name: 'Front glide (5m)', status: 'not-started' },
                { id: 'ai-fc-2', name: 'Flutter kick (10m)', status: 'not-started' },
                { id: 'ai-fc-3', name: 'Front crawl arms (10m)', status: 'not-started' },
                { id: 'ai-fc-4', name: 'Front crawl with breathing (15m)', status: 'not-started' }
            ],
            'Back Crawl': [
                { id: 'ai-bc-1', name: 'Back glide (5m)', status: 'not-started' },
                { id: 'ai-bc-2', name: 'Flutter kick on back (10m)', status: 'not-started' },
                { id: 'ai-bc-3', name: 'Back crawl (15m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 'ai-ws-1', name: 'Treading water (15 seconds)', status: 'not-started' },
                { id: 'ai-ws-2', name: 'Jump into deep water', status: 'not-started' }
            ]
        },
        
        // ====================================================================
        // Adult Advanced Level
        // ====================================================================
        'Adult Advanced': {
            'Front Crawl': [
                { id: 'aa-fc-1', name: 'Front crawl (25m)', status: 'not-started' },
                { id: 'aa-fc-2', name: 'Bilateral breathing', status: 'not-started' },
                { id: 'aa-fc-3', name: 'Front crawl (50m)', status: 'not-started' }
            ],
            'Back Crawl': [
                { id: 'aa-bc-1', name: 'Back crawl (25m)', status: 'not-started' },
                { id: 'aa-bc-2', name: 'Back crawl (50m)', status: 'not-started' }
            ],
            'Breaststroke': [
                { id: 'aa-br-1', name: 'Breaststroke kick (10m)', status: 'not-started' },
                { id: 'aa-br-2', name: 'Breaststroke arms (10m)', status: 'not-started' },
                { id: 'aa-br-3', name: 'Breaststroke (25m)', status: 'not-started' }
            ],
            'Endurance': [
                { id: 'aa-end-1', name: 'Continuous swim (100m)', status: 'not-started' }
            ],
            'Water Safety': [
                { id: 'aa-ws-1', name: 'Treading water (1 minute)', status: 'not-started' },
                { id: 'aa-ws-2', name: 'Surface dive', status: 'not-started' }
            ]
        }
    };

    // Return the skills for the requested level
    // If level doesn't exist in skillSets, return empty object
    // This prevents errors when an invalid level is provided
    return skillSets[level] || {};
}

// ============================================================================
// Start Server
// ============================================================================

/**
 * Start the Express server
 * 
 * The server listens on the specified PORT for incoming HTTP requests
 * Once started, the application is accessible at http://localhost:PORT
 * 
 * The callback function runs once the server is successfully listening
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
