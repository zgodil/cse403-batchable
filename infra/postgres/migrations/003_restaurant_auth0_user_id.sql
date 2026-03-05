-- Link each restaurant to an Auth0 user (sub claim) so we can resolve "my restaurant" from JWT.
ALTER TABLE Restaurant ADD COLUMN IF NOT EXISTS auth0_user_id VARCHAR(255) UNIQUE;
