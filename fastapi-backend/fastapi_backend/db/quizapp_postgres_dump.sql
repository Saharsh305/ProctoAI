-- PostgreSQL SQL Dump
-- Converted from MySQL (phpMyAdmin) dump
-- Original: quizapp database

BEGIN;

SET timezone = 'UTC';

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.log_time := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_transaction_log()
RETURNS TRIGGER AS $$
BEGIN
    NEW.transaction_log := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE longqa (
  longqa_qid BIGSERIAL PRIMARY KEY,
  test_id VARCHAR(100) NOT NULL,
  qid VARCHAR(25) NOT NULL,
  q TEXT NOT NULL,
  marks INTEGER DEFAULT NULL,
  uid BIGINT DEFAULT NULL
);

CREATE TABLE longtest (
  longtest_qid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  qid INTEGER NOT NULL,
  ans TEXT NOT NULL,
  marks INTEGER NOT NULL,
  uid BIGINT NOT NULL
);

CREATE TABLE practicalqa (
  pracqa_qid BIGSERIAL PRIMARY KEY,
  test_id VARCHAR(100) NOT NULL,
  qid VARCHAR(25) NOT NULL,
  q TEXT NOT NULL,
  compiler SMALLINT NOT NULL,
  marks INTEGER NOT NULL,
  uid BIGINT NOT NULL
);

CREATE TABLE practicaltest (
  pid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  qid VARCHAR(25) NOT NULL,
  code TEXT,
  input TEXT,
  executed VARCHAR(125) DEFAULT NULL,
  marks INTEGER NOT NULL,
  uid BIGINT NOT NULL
);

CREATE TABLE proctoring_log (
  pid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  voice_db INTEGER DEFAULT 0,
  img_log TEXT NOT NULL,
  user_movements_updown SMALLINT NOT NULL,
  user_movements_lr SMALLINT NOT NULL,
  user_movements_eyes SMALLINT NOT NULL,
  phone_detection SMALLINT NOT NULL,
  person_status SMALLINT NOT NULL,
  log_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uid BIGINT NOT NULL
);

CREATE TRIGGER trg_proctoring_log_timestamp
  BEFORE UPDATE ON proctoring_log
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

CREATE TABLE questions (
  questions_uid BIGSERIAL PRIMARY KEY,
  test_id VARCHAR(100) NOT NULL,
  qid VARCHAR(25) NOT NULL,
  q TEXT NOT NULL,
  a VARCHAR(100) NOT NULL,
  b VARCHAR(100) NOT NULL,
  c VARCHAR(100) NOT NULL,
  d VARCHAR(100) NOT NULL,
  ans VARCHAR(10) NOT NULL,
  marks INTEGER NOT NULL,
  uid BIGINT NOT NULL
);

CREATE TABLE students (
  sid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  qid VARCHAR(25) DEFAULT NULL,
  ans TEXT,
  uid BIGINT NOT NULL
);

CREATE TABLE studenttestinfo (
  stiid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  time_left TIME NOT NULL,
  completed SMALLINT DEFAULT 0,
  uid BIGINT NOT NULL
);

CREATE TABLE teachers (
  tid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  test_type VARCHAR(75) NOT NULL,
  start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "end" TIMESTAMP NOT NULL DEFAULT '1970-01-01 00:00:00',
  duration INTEGER NOT NULL,
  show_ans INTEGER NOT NULL,
  password VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  neg_marks INTEGER NOT NULL,
  calc SMALLINT NOT NULL,
  proctoring_type SMALLINT NOT NULL DEFAULT 0,
  uid BIGINT NOT NULL
);

CREATE TABLE users (
  uid BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  register_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_type VARCHAR(25) NOT NULL,
  user_image TEXT NOT NULL,
  user_login SMALLINT NOT NULL,
  examcredits INTEGER NOT NULL DEFAULT 7
);

CREATE TABLE window_estimation_log (
  wid BIGSERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  test_id VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  window_event SMALLINT NOT NULL,
  transaction_log TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uid BIGINT NOT NULL
);

CREATE TRIGGER trg_window_estimation_log_timestamp
  BEFORE UPDATE ON window_estimation_log
  FOR EACH ROW
  EXECUTE FUNCTION update_transaction_log();

CREATE INDEX idx_longqa_uid ON longqa (uid);
CREATE INDEX idx_longtest_uid ON longtest (uid);
CREATE INDEX idx_practicalqa_uid ON practicalqa (uid);
CREATE INDEX idx_practicaltest_uid ON practicaltest (uid);
CREATE INDEX proctor_email_index ON proctoring_log (email);
CREATE INDEX proctor_email_test_id_index ON proctoring_log (email, test_id);
CREATE INDEX idx_proctoring_log_uid ON proctoring_log (uid);
CREATE INDEX idx_questions_uid ON questions (uid);
CREATE INDEX idx_students_uid ON students (uid);
CREATE INDEX idx_studenttestinfo_uid ON studenttestinfo (uid);
CREATE INDEX idx_teachers_uid ON teachers (uid);
CREATE UNIQUE INDEX idx_users_email ON users (email);
CREATE INDEX idx_window_estimation_log_uid ON window_estimation_log (uid);

ALTER TABLE longqa
  ADD CONSTRAINT longqa_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE longtest
  ADD CONSTRAINT longtest_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE practicalqa
  ADD CONSTRAINT practicalqa_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE practicaltest
  ADD CONSTRAINT practicaltest_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE proctoring_log
  ADD CONSTRAINT proctoring_log_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE questions
  ADD CONSTRAINT questions_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE students
  ADD CONSTRAINT students_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE studenttestinfo
  ADD CONSTRAINT studenttestinfo_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE teachers
  ADD CONSTRAINT teachers_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

ALTER TABLE window_estimation_log
  ADD CONSTRAINT window_estimation_log_ibfk_1 FOREIGN KEY (uid) REFERENCES users (uid);

COMMIT;
