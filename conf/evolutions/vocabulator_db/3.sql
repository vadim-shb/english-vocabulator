# --- Groups of words

# --- !Ups

CREATE TABLE t_word_group (
  id            BIGSERIAL     NOT NULL PRIMARY KEY,
  dictionary_id BIGINT        NOT NULL REFERENCES t_dictionary (id),
  name          VARCHAR(1024) NOT NULL
);

ALTER TABLE t_word_group ADD CONSTRAINT name_min_length CHECK (length(name) > 0);

CREATE INDEX t_word_group_vocabulary_id ON t_word_group (dictionary_id);

# --- !Downs

DROP TABLE t_word_group;