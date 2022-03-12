--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Drop Tables     --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS passwords CASCADE;
DROP TABLE IF EXISTS blog CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS player_stats CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS divisions CASCADE;
DROP TABLE IF EXISTS team_season_division CASCADE;
DROP TABLE IF EXISTS game_season_division CASCADE;
DROP TABLE IF EXISTS referees CASCADE;
DROP TABLE IF EXISTS referees_games CASCADE;
DROP TABLE IF EXISTS player_team_season CASCADE;
DROP TABLE IF EXISTS suspensions CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS goalie_stats CASCADE;
DROP TABLE IF EXISTS news_tags CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS user_role CASCADE;
DROP TABLE IF EXISTS settings CASCADE;


--==--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--
--==--==--==--==--==--    Create Tables    --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER, -- ????? should i do this?
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "email" VARCHAR,
  "admin_type" VARCHAR,
  "is_suspended" BOOLEAN NOT NULL DEFAULT false,
  "suspended_at" TIMESTAMP,
  "invite_token" VARCHAR,
  "invite_date" TIMESTAMP,
  "reinvite_date" TIMESTAMP,
  "last_login" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER      -- REFERENCES users(id)
);

CREATE TABLE "passwords" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER,        -- REFERENCES users(id),
  "salt" VARCHAR,
  "pw" VARCHAR
);

CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY, 
  "name" VARCHAR,
  "description" VARCHAR
);

CREATE TABLE "user_role" (
  "id" SERIAL PRIMARY KEY, 
  "user_id" INTEGER NOT NULL,
  "role_id" INTEGER NOT NULL
);

-- CREATE TABLE "news" (
--   "id" SERIAL PRIMARY KEY,
--   "title" VARCHAR,
--   "allow_collapse" BOOLEAN NOT NULL DEFAULT false,
--   "body" VARCHAR,
--   "display_order" INTEGER,
--   "created_at" TIMESTAMP,
--   "created_by" INTEGER,        -- REFERENCES users(id),
--   "updated_at" TIMESTAMP,
--   "updated_by" INTEGER,        -- REFERENCES users(id),
--   "deleted_at" TIMESTAMP,
--   "deleted_by" INTEGER,        -- REFERENCES users(id),
--   "hidden_at" TIMESTAMP,
--   "hidden_by" INTEGER          -- REFERENCES users(id),
-- );

-- CREATE TABLE "tags" (
--   "id" SERIAL PRIMARY KEY, 
--   "name" VARCHAR
-- );

-- CREATE TABLE "news_tags" (
--   "id" SERIAL PRIMARY KEY,
--   "tag_id" INTEGER,           -- REFERENCES tags(id)
--   "news_id" INTEGER           -- REFERENCES news(id)
-- );

CREATE TABLE "players" (
  "id" SERIAL,
  "player_id" INTEGER PRIMARY KEY,
  "first_name" VARCHAR(255),
  "last_name" VARCHAR(255),
  "email" VARCHAR(255),
  "graduation_year" INTEGER,
--   "registered_date" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "player_season_stats" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,         -- REFERENCES players(id)
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "player_number" INTEGER NOT NULL DEFAULT 0,
  "games_played" INTEGER NOT NULL DEFAULT 0,
  "goals" INTEGER NOT NULL DEFAULT 0,
  "assists" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "penalties_count" INTEGER NOT NULL DEFAULT 0,
  "penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0,
  "game_winning_goals" INTEGER NOT NULL DEFAULT 0,
  "man_up_goals" INTEGER NOT NULL DEFAULT 0,
  "man_down_goals" INTEGER NOT NULL DEFAULT 0,
  "goals_per_game" INTEGER NOT NULL DEFAULT 0,
  "assists_per_game" INTEGER NOT NULL DEFAULT 0,
  "points_per_game" INTEGER NOT NULL DEFAULT 0,
  "shots" INTEGER NOT NULL DEFAULT 0,
  "shots_on_goal" INTEGER NOT NULL DEFAULT 0,
  "shooting_percentage" INTEGER NOT NULL DEFAULT 0,
  "ground_balls" INTEGER NOT NULL DEFAULT 0,
  "ground_balls_percentage" INTEGER NOT NULL DEFAULT 0,
  "interceptions" INTEGER NOT NULL DEFAULT 0,
  "take_aways" INTEGER NOT NULL DEFAULT 0,
  "unforced_errors" INTEGER NOT NULL DEFAULT 0,

  "faceoff_wins" INTEGER NOT NULL DEFAULT 0,
  "faceoffs_taken" INTEGER NOT NULL DEFAULT 0,
  "faceoff_wins_percentage" INTEGER NOT NULL DEFAULT 0,

  "minutes_played" INTEGER NOT NULL DEFAULT 0,
  "goals_allowed" INTEGER NOT NULL DEFAULT 0,
  "goals_allowed_average" INTEGER NOT NULL DEFAULT 0,
  "goalie_shots_on_goal" INTEGER NOT NULL DEFAULT 0,
  "saves" INTEGER NOT NULL DEFAULT 0,
  "saves_percentage" INTEGER NOT NULL DEFAULT 0,
  "shutouts" INTEGER NOT NULL DEFAULT 0,
  "wins" INTEGER NOT NULL DEFAULT 0,
  "losses" INTEGER NOT NULL DEFAULT 0,
  "ties" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "seasons" (
  "id"  SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER,        -- REFERENCES users(id),
  "hidden_at" TIMESTAMP,
  "hidden_by" INTEGER,         -- REFERENCES users(id),
  "is_active" BOOLEAN NOT NULL DEFAULT false
);

ALTER SEQUENCE seasons_id_seq RESTART WITH 100;

-- CREATE TABLE "divisions" (
--   "id"  SERIAL PRIMARY KEY,
--   "name" VARCHAR,
--   "season_id" INTEGER,         -- REFERENCES seasons(id)
--   "created_at" TIMESTAMP,
--   "created_by" INTEGER,        -- REFERENCES users(id),
--   "updated_at" TIMESTAMP,
--   "updated_by" INTEGER,        -- REFERENCES users(id),
--   "deleted_at" TIMESTAMP,
--   "deleted_by" INTEGER,        -- REFERENCES users(id),
--   "hidden_at" TIMESTAMP,
--   "hidden_by" INTEGER          -- REFERENCES users(id),
-- );

CREATE TABLE "teams" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "team_season" (
  "id" SERIAL PRIMARY KEY,
  "team_id" INTEGER,           -- REFERENCES teams(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
  "games_played" INTEGER NOT NULL DEFAULT 0,
  "wins" INTEGER NOT NULL DEFAULT 0,
  "losses" INTEGER NOT NULL DEFAULT 0,
  "ties" INTEGER NOT NULL DEFAULT 0,
  -- "overtime_losses" INTEGER NOT NULL DEFAULT 0,
  "points" INTEGER NOT NULL DEFAULT 0,
  "goals_for" INTEGER NOT NULL DEFAULT 0,
  "goals_against" INTEGER NOT NULL DEFAULT 0,
  "penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0
);

CREATE TABLE "game_season" (
  "id" SERIAL PRIMARY KEY,
  "game_id" INTEGER,           -- REFERENCES games(id)
  "season_id" INTEGER,         -- REFERENCES seasons(id)
);

CREATE TABLE "player_team_season" (
  "id" SERIAL PRIMARY KEY,
  "player_id" INTEGER,        -- REFERENCES players(id)
  "team_id" INTEGER,          -- REFERENCES teams(id)
  "season_id" INTEGER         -- REFERENCES seasons(id)
);

CREATE TABLE "locations" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR,
  "address" VARCHAR,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "game_team_stats" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INTEGER,         -- REFERENCES games(id)
    "team_id" INTEGER,         -- REFERENCES teams(id)
    "season_id" INTEGER,       -- REFERENCES seasons(id)
    -- "opponent" VARCHAR,           -- CHANGE THIS TO REFERENCE
    -- "location" VARCHAR,           -- CHANGE THIS TO REFERENCE
    -- "goals_for" SMALLINT,
    -- "goals_against", SMALLINT,
    -- "ground_balls" SMALLINT,
    -- "shots" SMALLINT,
    -- "faceoffs_won" SMALLINT,
    -- "penalties_in_minutes" DECIMAL,

    -- "scores_first": SMALLINT,
    -- "scores_second": SMALLINT,
    -- "scores_third": SMALLINT,
    -- "scores_fourth": SMALLINT,
    -- "scores_overtime": SMALLINT,
    "us_goals_for" SMALLINT NOT NULL DEFAULT 0,
    "us_goals_against" SMALLINT NOT NULL DEFAULT 0,
    "us_ground_balls" SMALLINT NOT NULL DEFAULT 0,
    "us_shots" SMALLINT NOT NULL DEFAULT 0,
    "us_faceoffs_won" SMALLINT NOT NULL DEFAULT 0,
    "us_penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0,
    "opponent_goals_for" SMALLINT NOT NULL DEFAULT 0,
    "opponent_goals_against" SMALLINT NOT NULL DEFAULT 0,
    "opponent_ground_balls" SMALLINT NOT NULL DEFAULT 0,
    "opponent_shots" SMALLINT NOT NULL DEFAULT 0,
    "opponent_faceoffs_won" SMALLINT NOT NULL DEFAULT 0,
    "opponent_penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0,

    "us_scores_first" SMALLINT NOT NULL DEFAULT 0,
    "us_scores_second" SMALLINT NOT NULL DEFAULT 0,
    "us_scores_third" SMALLINT NOT NULL DEFAULT 0,
    "us_scores_fourth" SMALLINT NOT NULL DEFAULT 0,
    "us_scores_overtime" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_first" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_second" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_third" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_fourth" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_overtime" SMALLINT NOT NULL DEFAULT 0
);


INSERT INTO "game_team_stats" (
  season_id, opponent, location, 
  us_goals_for, us_goals_against, us_ground_balls, us_shots, us_faceoffs_won, us_penalties_in_minutes,
  opponent_goals_for, opponent_goals_against, opponent_ground_balls, opponent_shots, opponent_faceoffs_won, opponent_penalties_in_minutes,
  us_scores_first, us_scores_second, us_scores_third, us_scores_fourth, us_scores_overtime,
  opponent_scores_first, opponent_scores_second, opponent_scores_third, opponent_scores_fourth, opponent_scores_overtime
) 
VALUES (
  10001, 'Milton HS', '13025 Birmingham Hwy, Milton, GA 30004',
  16, 11, 10, 24, 20, 2.5,
  11, 16, 16, 22, 11, 5,
  2, 4, 3, 7, 0,
  2, 2, 4, 3, 0
);

-- ALTER TABLE games
-- ADD "result" VARCHAR;



CREATE TABLE "games" (
    "id" SERIAL,
    "game_id" INTEGER PRIMARY KEY,
    "season_id" INTEGER,                   -- REFERENCES seasons(id)
    "opponent" VARCHAR,                    -- REFERENCES oppentent(id)
    "location" VARCHAR,                    -- CHANGE THIS TO REFERENCE
    "result" VARCHAR,
    "is_home" BOOLEAN NOT NULL DEFAULT FALSE,
    "start_date" TIMESTAMP DEFAULT NOW(),
    "has_been_played" BOOLEAN NOT NULL DEFAULT FALSE,
    "goals_for" SMALLINT,
    "goals_against" SMALLINT,
    "goal_differential" SMALLINT
);


CREATE TABLE "game_player_stats" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INTEGER,         -- REFERENCES games(id)
    "team_id" INTEGER,         -- REFERENCES teams(id)
    "season_id" INTEGER,       -- REFERENCES seasons(id)
    "player_id" INTEGER,       -- REFERENCES players(player_id)
    "player_number" INTEGER,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "sog" INTEGER NOT NULL DEFAULT 0,
    "ground_balls" INTEGER NOT NULL DEFAULT 0,
    "interceptions" INTEGER NOT NULL DEFAULT 0,
    "takeaways" INTEGER NOT NULL DEFAULT 0,
    "unforced_errors" INTEGER NOT NULL DEFAULT 0,
    "penalties" INTEGER NOT NULL DEFAULT 0,
    "penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0
);

-- CREATE TABLE "game_season_stats" (
--     "id" SERIAL PRIMARY KEY,
-- )


-- CREATE TABLE "games" (
--   "id" SERIAL PRIMARY KEY,
--   "has_been_played" BOOLEAN NOT NULL DEFAULT false,
--   -- "home_team" INTEGER,           -- REFERENCES teams(id)
--   -- "opponent_id" INTEGER,           -- REFERENCES teams(id)
--   -- "location_id" INTEGER,         -- REFERENCES locations(id)
--   "opponent" VARCHAR,           -- REFERENCES teams(id)
--   "location" VARCHAR,         -- REFERENCES locations(id)

--   "start_date" TIMESTAMP,
--   "home_score" INTEGER NOT NULL DEFAULT 0,
--   "home_first_score" INTEGER NOT NULL DEFAULT 0,
--   "home_second_score" INTEGER NOT NULL DEFAULT 0,
--   "home_third_score" INTEGER NOT NULL DEFAULT 0,
--   "home_first_sog" INTEGER NOT NULL DEFAULT 0,
--   "home_second_sog" INTEGER NOT NULL DEFAULT 0,
--   "home_third_sog" INTEGER NOT NULL DEFAULT 0,
--   "home_first_pim" INTEGER NOT NULL DEFAULT 0,
--   "home_second_pim" INTEGER NOT NULL DEFAULT 0,
--   "home_third_pim" INTEGER NOT NULL DEFAULT 0,
--   "away_score" INTEGER NOT NULL DEFAULT 0,
--   "away_first_score" INTEGER NOT NULL DEFAULT 0,
--   "away_second_score" INTEGER NOT NULL DEFAULT 0,
--   "away_third_score" INTEGER NOT NULL DEFAULT 0,
--   "away_first_sog" INTEGER NOT NULL DEFAULT 0,
--   "away_second_sog" INTEGER NOT NULL DEFAULT 0,
--   "away_third_sog" INTEGER NOT NULL DEFAULT 0,
--   "away_first_pim" INTEGER NOT NULL DEFAULT 0,
--   "away_second_pim" INTEGER NOT NULL DEFAULT 0,
--   "away_third_pim" INTEGER NOT NULL DEFAULT 0,
--   "game_notes" VARCHAR,
--   "created_at" TIMESTAMP,
--   "created_by" INTEGER,        -- REFERENCES users(id),
--   "updated_at" TIMESTAMP,
--   "updated_by" INTEGER,        -- REFERENCES users(id),
--   "deleted_at" TIMESTAMP,
--   "deleted_by" INTEGER         -- REFERENCES users(id),
-- );

CREATE TABLE "registrations" (
  "id"  SERIAL PRIMARY KEY,
  "user_id" INTEGER,            -- REFERENCES users(id),
  "player_id" INTEGER,          -- REFERENCES players(id),
  "season_id" INTEGER,          -- REFERENCES seasons(id),
  "payment_frequency" VARCHAR(255) NOT NULL DEFAULT 'full', -- monthly / half / full
  "paid_amount" INTEGER NOT NULL DEFAULT 0,
  "paid_at" TIMESTAMP,
  "completed_at" TIMESTAMP,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,        -- REFERENCES users(id),
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER,        -- REFERENCES users(id),
  "deleted_at" TIMESTAMP,
  "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "settings" (
  "id" SERIAL PRIMARY KEY,
  "disable_tags" BOOLEAN NOT NULL DEFAULT FALSE,
  "color_scheme" JSONB, -- figure out how to default jsonb
  "logo_url" VARCHAR,
  "banner_url" VARCHAR,
  "show_banner" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,    -- REFERENCES users(id)
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER     -- REFERENCES users(id),
);


--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--
--==--==--==--==--==--     Add Foreign Keys     --==--==--==--==--==--
--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

ALTER TABLE "users" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");

ALTER TABLE "passwords" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "news" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "news" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "players" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "players" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "player_stats" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "player_stats" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "player_stats" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "seasons" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "seasons" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "divisions" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "divisions" ADD FOREIGN KEY ("hidden_by") REFERENCES "users" ("id");

ALTER TABLE "teams" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "teams" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "team_season_division" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "team_season_division" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "team_season_division" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");

ALTER TABLE "game_season_division" ADD FOREIGN KEY ("game_id") REFERENCES "games" ("id");
ALTER TABLE "game_season_division" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "game_season_division" ADD FOREIGN KEY ("division_id") REFERENCES "divisions" ("id");

ALTER TABLE "player_team_season" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");
ALTER TABLE "player_team_season" ADD FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
ALTER TABLE "player_team_season" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");

ALTER TABLE "locations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "locations" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "games" ADD FOREIGN KEY ("home_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("away_team") REFERENCES "teams" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("location_id") REFERENCES "locations" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("scorekeeper_id") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "games" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");

ALTER TABLE "news_tags" ADD FOREIGN KEY ("tag_id") REFERENCES "tags" ("id");
ALTER TABLE "news_tags" ADD FOREIGN KEY ("news_id") REFERENCES "news" ("id");

ALTER TABLE "user_role" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "user_role" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "registrations" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "registrations" ADD FOREIGN KEY ("season_id") REFERENCES "seasons" ("id");
ALTER TABLE "registrations" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "registrations" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
ALTER TABLE "registrations" ADD FOREIGN KEY ("deleted_by") REFERENCES "users" ("id");
ALTER TABLE "registrations" ADD FOREIGN KEY ("player_id") REFERENCES "players" ("id");

ALTER TABLE "settings" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "settings" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");


--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--
--==--==--==--==--==--    Default Values    --==--==--==--==--==--
--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--==--

INSERT INTO "roles" (name, description) VALUES ('super', 'A Super Admin is top level tier');
INSERT INTO "roles" (name, description) VALUES ('admin', 'An Admin is responsible for managing the league, scorekeepers, team managers, and players');
INSERT INTO "roles" (name, description) VALUES ('scorekeeper', 'A Scorekeeper is responsible for inputting scores into a game');
INSERT INTO "roles" (name, description) VALUES ('manager', 'A Manager is responsible for managing specific teams and specific team''s players');
INSERT INTO "roles" (name, description) VALUES ('player', 'A Player is an individual who plays in the league');

INSERT INTO "tags" (name) VALUES ('announcement');
INSERT INTO "tags" (name) VALUES ('covid');
INSERT INTO "tags" (name) VALUES ('tournament');
INSERT INTO "tags" (name) VALUES ('champions');
INSERT INTO "tags" (name) VALUES ('league leaders');
INSERT INTO "tags" (name) VALUES ('evals');


--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--
--==--==--==--==--==--    Future Tables    --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--

-- CREATE TABLE "goalie_stats" (
--   "id" int,
--   "player_id" int,
--   "team_id" int,
--   "season" varchar,
--   "games_played" int,
--   "wins" int,
--   "losses" int,
--   "ties" int,
--   "over_time_losses" int,
--   "shots_allowed" int,
--   "goals_allowed" int,
--   "goals_allowed_average" int,
--   "saves" int,
--   "saves_percentage" int,
--   "shut_outs" int,
--   "empty_net_goals_against" int,
--   "time_on_ice" int
-- );

-- CREATE TABLE "referees" (
--   "id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "email" varchar,
--   "certification" varchar
-- );

-- CREATE TABLE "referees_games" (
--   "id" int,
--   "referee_id" int,
--   "game_id" int
-- );

-- CREATE TABLE "suspensions" (
--   "id" int,
--   "player_id" int,
--   "first_name" varchar,
--   "last_name" varchar,
--   "game_date" varchar,
--   "message" varchar,
--   "posted_by" int,
--   "posted_date" datetime
-- );



-- run on prod
CREATE TABLE "settings" (
  "id" SERIAL PRIMARY KEY,
  "disable_tags" BOOLEAN NOT NULL DEFAULT FALSE,
  "color_scheme" JSONB, -- figure out how to default jsonb
  "logo_url" VARCHAR,
  "banner_url" VARCHAR,
  "show_banner" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP,
  "created_by" INTEGER,     -- REFERENCES users(id)
  "updated_at" TIMESTAMP,
  "updated_by" INTEGER     -- REFERENCES users(id),
);


ALTER TABLE "settings" ADD FOREIGN KEY ("created_by") REFERENCES "users" ("id");
ALTER TABLE "settings" ADD FOREIGN KEY ("updated_by") REFERENCES "users" ("id");
-- run on prod