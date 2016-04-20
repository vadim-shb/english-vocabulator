# --- Groups of words

# --- !Ups

CREATE TABLE t_word_group (
  id   BIGSERIAL     NOT NULL PRIMARY KEY,
  name VARCHAR(1024) NOT NULL
);

--@formatter:off
ALTER TABLE t_word_group ADD CONSTRAINT name_min_length CHECK (length(name) > 0);
--@formatter:on
CREATE INDEX t_word_group_name ON t_word_group (name);

CREATE TABLE t_word_in_group (
  word_group_id BIGINT NOT NULL REFERENCES t_word_group (id),
  word_id       BIGINT NOT NULL REFERENCES t_word (id)
);

CREATE INDEX t_word_in_group__word_group_id ON t_word_in_group (word_group_id);
CREATE INDEX t_word_in_group__word_id ON t_word_in_group (word_id);


# --- !Downs

DROP TABLE t_word_in_group;
DROP TABLE t_word_group;
