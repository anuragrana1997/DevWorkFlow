USE devworkflow;

-- USERS
INSERT INTO users (
    first_name,
    last_name,
    email,
    hashed_password,
    privilege
) VALUES
('Rick', 'Nomad', 'rick@example.com', '$2b$10$examplehash1', 1),
('Grey', 'Williams', 'grey@example.com', '$2b$10$examplehash2', 2),
('Nish', 'Vaid', 'nish@example.com', '$2b$10$examplehash3', 2),
('Arvin', 'Sinh', 'arvin@example.com', '$2b$10$examplehash4', 2),
('Vishal', 'Sharma', 'vishal@example.com', '$2b$10$examplehash5', 2),
('Emily', 'Carter', 'emily@example.com', '$2b$10$examplehash6', 2),
('Daniel', 'Lee', 'daniel@example.com', '$2b$10$examplehash7', 2),
('Sophia', 'Martinez', 'sophia@example.com', '$2b$10$examplehash8', 2);

-- PROJECTS
-- project_status: 0 = pending, 1 = active, 2 = completed
INSERT INTO projects (project_name, project_status) VALUES
('DevWorkflow Platform', 1),
('Bug Tracking Dashboard', 1),
('Internal Analytics Tool', 0),
('Legacy API Migration', 2);

-- TASKS
-- task_status: 0 = pending, 1 = in progress, 2 = completed
INSERT INTO tasks
(project_id, assignee_id, task_heading, task_description, task_status)
VALUES
(1, 1, 'Set up Express server', 'Create the initial Node.js and Express application structure.', 2),
(1, 2, 'Create MySQL connection pool', 'Configure MySQL connection pooling using environment variables.', 2),
(1, 3, 'Build project API', 'Create REST endpoints for creating and retrieving projects.', 1),
(1, 4, 'Build task API', 'Create CRUD endpoints for project tasks.', 1),
(1, 5, 'Add authentication', 'Implement login and role-based access control.', 0),
(2, 6, 'Design dashboard UI', 'Create the initial React dashboard layout.', 1),
(2, 7, 'Create bug filtering', 'Add filters for status, assignee, and project.', 0),
(2, 8, 'Implement bug metrics', 'Display bug counts and completion statistics.', 0),
(3, 2, 'Define analytics requirements', 'Document metrics required for the analytics tool.', 1),
(3, 3, 'Create reporting queries', 'Write MySQL queries for project and task statistics.', 0),
(4, 4, 'Audit legacy endpoints', 'Identify endpoints that need migration.', 2),
(4, 5, 'Migrate user endpoints', 'Replace legacy user APIs with the new service.', 2);

-- COMMENTS
INSERT INTO comments (user_id, task_id, comment_description) VALUES
(1, 1, 'Initial database schema has been created.'),
(2, 2, 'MySQL connection pool is configured and tested.'),
(3, 3, 'Project API implementation is in progress.'),
(4, 4, 'Task validation needs to be added before merging.'),
(5, 5, 'Authentication middleware design is ready for review.'),
(6, 6, 'Dashboard wireframe has been completed.'),
(7, 7, 'Filtering requirements have been documented.'),
(8, 8, 'Metrics should include pending, active, and completed tasks.'),
(1, 3, 'Please keep API responses consistent across endpoints.'),
(3, 10, 'Reporting query draft is ready for testing.');

-- ACTIVITY LOG
-- hours_logged is kept as whole numbers because the current column is DECIMAL without a scale.
INSERT INTO activity_log
(user_id, task_id, log_description, hours_logged)
VALUES
(1, 1, 'Created Express application skeleton and health-check route.', 3),
(2, 2, 'Configured MySQL pool and environment variables.', 4),
(3, 3, 'Implemented project creation endpoint.', 3),
(3, 3, 'Added project retrieval and validation logic.', 2),
(4, 4, 'Created task model and initial CRUD routes.', 4),
(5, 5, 'Researched authentication and authorization flow.', 2),
(6, 6, 'Created React dashboard layout and navigation.', 5),
(7, 7, 'Designed bug filtering logic.', 2),
(8, 8, 'Defined dashboard metrics and aggregation requirements.', 3),
(2, 9, 'Documented analytics requirements with the team.', 2),
(3, 10, 'Created initial SQL reporting queries.', 3),
(4, 11, 'Reviewed legacy API endpoints and dependencies.', 4),
(5, 12, 'Migrated user endpoints and tested API responses.', 6);
