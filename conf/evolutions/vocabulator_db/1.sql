# --- Users

# --- !Ups

CREATE TABLE t_user (
  id             BIGSERIAL    NOT NULL PRIMARY KEY,
  username       VARCHAR(255) NOT NULL UNIQUE,
  password_cache VARCHAR(255) NOT NULL
);

ALTER TABLE t_user ADD CONSTRAINT username_min_length CHECK (length(username) > 0);

CREATE INDEX t_user_username ON t_user (username);
CREATE INDEX t_user_password_cache ON t_user (password_cache);

INSERT INTO t_user (username, password_cache) VALUES ('user', '');

# --- !Downs

DROP TABLE t_user;