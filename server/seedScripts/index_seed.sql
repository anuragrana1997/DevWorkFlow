USE devworkflow;

CREATE INDEX task_project_assignee_idx
ON tasks(task_id, project_id, assignee_id);

CREATE INDEX comment_user_idx
ON comments(comment_id, user_id, task_id);

CREATE INDEX log_user_task_idx
ON activity_log(log_id, user_id, task_id);
