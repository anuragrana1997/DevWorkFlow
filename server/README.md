# DevWorkFlow

Task statuses are stored as `TINYINT`: `0` open, `1` in progress, `2` testing,
`3` complete, and `4` closed. Project statuses remain `TINYINT`: `0` open,
`1` in progress, and `2` complete.

For an existing MySQL database created with the old three-status task schema,
run `seedScripts/migrate_task_status.sql` once before starting the updated app.
It converts existing completed tasks from `2` to `3` and expands the task
status check constraint. New databases created from `create_seed.sql` already
have the five-status constraint.
