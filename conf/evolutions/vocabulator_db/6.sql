# --- examples of words usage

# --- !Ups

CREATE TABLE t_word_usage_example (
  id                BIGSERIAL     NOT NULL PRIMARY KEY,
  word_id           BIGINT        NOT NULL REFERENCES t_word (id),
  position_in_order INTEGER       NOT NULL,
  example           VARCHAR(4000) NOT NULL,
  example_meaning   VARCHAR(4000) NOT NULL
);

ALTER TABLE t_word_usage_example ADD CONSTRAINT meaning_min_length CHECK (length(example) > 0);
ALTER TABLE t_word_usage_example ADD CONSTRAINT meaning_min_length CHECK (length(example_meaning) > 0);

CREATE INDEX t_word_usage_example_word_id ON t_word_usage_example (word_id);

# --- !Downs

DROP TABLE t_word_usage_example;