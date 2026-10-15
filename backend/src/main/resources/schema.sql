-- Older tables were created with a check allowing only READ/COMPLETED; drop it so LECTURE can be saved.
ALTER TABLE IF EXISTS chapter_progress DROP CONSTRAINT IF EXISTS chapter_progress_status_check;
