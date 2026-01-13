CREATE TABLE IF NOT EXISTS app_user (
  id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  username VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(30) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_app_user_email ON app_user (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS uq_app_user_username ON app_user (lower(username));

CREATE TABLE IF NOT EXISTS password_reset_token (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_password_reset_token_hash ON password_reset_token (token_hash);
CREATE INDEX IF NOT EXISTS ix_password_reset_user_id ON password_reset_token (user_id);
CREATE INDEX IF NOT EXISTS ix_password_reset_expires_at ON password_reset_token (expires_at);
