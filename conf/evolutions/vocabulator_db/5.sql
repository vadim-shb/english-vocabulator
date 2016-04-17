# --- meanings of words

# --- !Ups

CREATE TABLE t_word_meaning (
  id                BIGSERIAL     NOT NULL PRIMARY KEY,
  word_id           BIGINT        NOT NULL REFERENCES t_word (id),
  position_in_order INTEGER       NOT NULL,
  meaning           VARCHAR(1024) NOT NULL
);

ALTER TABLE t_word_meaning ADD CONSTRAINT meaning_min_length CHECK (length(meaning) > 0);

CREATE INDEX t_word_meaning_word_id ON t_word_meaning (word_id);

# --- !Downs

DROP TABLE t_word_meaning;