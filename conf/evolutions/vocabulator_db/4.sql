# --- Words

# --- !Ups

CREATE TABLE t_word (
  id            BIGSERIAL     NOT NULL PRIMARY KEY,
  word_group_id BIGINT        NOT NULL REFERENCES t_word_group (id),
  word          VARCHAR(1024) NOT NULL
);

ALTER TABLE t_word ADD CONSTRAINT word_min_length CHECK (length(word) > 0);

CREATE INDEX t_word_word_group_id ON t_word (word_group_id);

# --- !Downs

DROP TABLE t_word;