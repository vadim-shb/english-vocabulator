# --- Learn word collections

# --- !Ups

CREATE TABLE t_word_learn_collection (
  id      BIGSERIAL     NOT NULL PRIMARY KEY,
  user_id BIGINT        NOT NULL REFERENCES t_user (id),
  name    VARCHAR(1024) NOT NULL
);

--@formatter:off
ALTER TABLE t_word_learn_collection ADD CONSTRAINT name_min_length CHECK (length(name) > 0);
--@formatter:on
CREATE INDEX t_word_learn_collection__user_id ON t_word_learn_collection (user_id);

CREATE TABLE t_word_in_learn_collection (
  word_learn_collection_id BIGINT NOT NULL REFERENCES t_word_learn_collection (id),
  word_id                  BIGINT NOT NULL REFERENCES t_word (id)
);

CREATE INDEX t_word_in_learn_collection__word_learn_collection_id ON t_word_in_learn_collection (word_learn_collection_id);
CREATE INDEX t_word_in_learn_collection__word_id ON t_word_in_learn_collection (word_id);


# --- !Downs

DROP TABLE t_word_in_learn_collection;
DROP TABLE t_word_learn_collection;