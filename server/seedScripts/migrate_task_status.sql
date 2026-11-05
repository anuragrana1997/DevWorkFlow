-- Run once against an existing MySQL database before using the five task statuses.
-- Old value 2 meant complete; new value 2 means testing.
SELECT MAX(cc.CONSTRAINT_NAME) INTO @old_task_status_check
FROM information_schema.CHECK_CONSTRAINTS AS cc
JOIN information_schema.TABLE_CONSTRAINTS AS tc
  ON tc.CONSTRAINT_SCHEMA = cc.CONSTRAINT_SCHEMA AND tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
WHERE tc.TABLE_SCHEMA = DATABASE() AND tc.TABLE_NAME = 'tasks'
  AND cc.CHECK_CLAUSE LIKE '%task_status%';

SET @drop_task_status_check = IF(@old_task_status_check IS NULL, 'SELECT 1',
    CONCAT('ALTER TABLE tasks DROP CHECK `', @old_task_status_check, '`'));
PREPARE task_status_statement FROM @drop_task_status_check;
EXECUTE task_status_statement;
DEALLOCATE PREPARE task_status_statement;

UPDATE tasks SET task_status = 3 WHERE task_status = 2;
ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (task_status IN (0, 1, 2, 3, 4));
