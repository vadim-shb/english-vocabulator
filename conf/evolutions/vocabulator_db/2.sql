# --- Vocabularies

# --- !Ups

CREATE TABLE t_dictionary (
  id      BIGSERIAL     NOT NULL PRIMARY KEY,
  user_id BIGINT        NOT NULL REFERENCES t_user (id),
  name    VARCHAR(1024) NOT NULL
);

ALTER TABLE t_dictionary ADD CONSTRAINT name_min_length CHECK (length(name) > 0);

CREATE INDEX t_dictionary_user_id ON t_dictionary (user_id);

# --- !Downs

DROP TABLE t_dictionary;