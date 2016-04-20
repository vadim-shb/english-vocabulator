# --- Word learning process

# --- !Ups

CREATE TABLE t_word_learning (
  id                 BIGSERIAL NOT NULL PRIMARY KEY,
  user_id            BIGINT    NOT NULL REFERENCES t_user (id),
  word_id            BIGINT    NOT NULL REFERENCES t_word (id),
  word_importance    INT       NOT NULL,
  right_know_meaning INT       NOT NULL,
  right_write        INT       NOT NULL,
  right_pronounce    INT       NOT NULL,
  fail_know_meaning  INT       NOT NULL,
  fail_write         INT       NOT NULL,
  fail_pronounce     INT       NOT NULL
);

--@formatter:off
ALTER TABLE t_word_learning ADD CONSTRAINT word_importance_min CHECK (word_importance >= 0);
ALTER TABLE t_word_learning ADD CONSTRAINT word_importance_max CHECK (word_importance <= 10);
--@formatter:on


# --- !Downs

DROP TABLE t_word_learning;
