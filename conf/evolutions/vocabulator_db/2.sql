# --- Words

# --- !Ups

CREATE TABLE t_word (
  id   BIGSERIAL     NOT NULL PRIMARY KEY,
  word VARCHAR(1024) NOT NULL
);

--@formatter:off
ALTER TABLE t_word ADD CONSTRAINT word_min_length CHECK (length(word) > 0);
--@formatter:on

# --- !Downs

DROP TABLE t_word;