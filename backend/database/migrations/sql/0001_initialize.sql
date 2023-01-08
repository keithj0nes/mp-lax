--==--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--
--==--==--==--==--==--    Create Tables    --==--==--==--==--==--
--==--==--==--==--==--==--==--==-==--==--==--==--==--==--==--==--


CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    -- "user_id" INTEGER, -- ????? should i do this?
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "email" VARCHAR,
    "password" VARCHAR,
    "admin_type" VARCHAR,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false,
    "suspended_at" TIMESTAMP,
    "invite_token" VARCHAR,
    "invite_date" TIMESTAMP,
    "reinvite_date" TIMESTAMP,
    "last_login" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER      -- REFERENCES users(id)
);

-- CREATE TABLE "roles" (
--   "id" SERIAL PRIMARY KEY, 
--   "name" VARCHAR,
--   "description" VARCHAR
-- );

-- CREATE TABLE "user_role" (
--   "id" SERIAL PRIMARY KEY, 
--   "user_id" INTEGER NOT NULL,
--   "role_id" INTEGER NOT NULL
-- );

CREATE TABLE "players" (
    "id" SERIAL,
    "player_id" VARCHAR PRIMARY KEY,
    "first_name" VARCHAR(255),
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "graduation_year" INTEGER,
    --   "registered_date" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER,        -- REFERENCES users(id),
    "updated_at" TIMESTAMP,
    "updated_by" INTEGER,        -- REFERENCES users(id),
    "deleted_at" TIMESTAMP,
    "deleted_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "player_season_stats" (
    "id" SERIAL PRIMARY KEY,
    "player_id" VARCHAR,         -- REFERENCES players(id)
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
    "created_at" TIMESTAMP DEFAULT NOW(),
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

CREATE TABLE "teams" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER         -- REFERENCES users(id),
);

CREATE TABLE "team_location" (
    "id" SERIAL PRIMARY KEY,
    "team_id" INTEGER,          -- REFERENCES teams(id),
    "location_id" INTEGER       -- REFERENCES locations(id),
);


-- CREATE TABLE "team_season" (
--   "id" SERIAL PRIMARY KEY,
--   "team_id" INTEGER,           -- REFERENCES teams(id)
--   "season_id" INTEGER,         -- REFERENCES seasons(id)
--   "games_played" INTEGER NOT NULL DEFAULT 0,
--   "wins" INTEGER NOT NULL DEFAULT 0,
--   "losses" INTEGER NOT NULL DEFAULT 0,
--   "ties" INTEGER NOT NULL DEFAULT 0,
--   -- "overtime_losses" INTEGER NOT NULL DEFAULT 0,
--   "points" INTEGER NOT NULL DEFAULT 0,
--   "goals_for" INTEGER NOT NULL DEFAULT 0,
--   "goals_against" INTEGER NOT NULL DEFAULT 0,
--   "penalties_in_minutes" DECIMAL NOT NULL DEFAULT 0
-- );

-- CREATE TABLE "game_season" (
--   "id" SERIAL PRIMARY KEY,
--   "game_id" INTEGER,           -- REFERENCES games(id)
--   "season_id" INTEGER         -- REFERENCES seasons(id)
-- );

-- CREATE TABLE "player_team_season" (
--   "id" SERIAL PRIMARY KEY,
--   "player_id" INTEGER,        -- REFERENCES players(id)
--   "team_id" INTEGER,          -- REFERENCES teams(id)
--   "season_id" INTEGER         -- REFERENCES seasons(id)
-- );

CREATE TABLE "locations" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "address" VARCHAR,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER        -- REFERENCES users(id),
);

CREATE TABLE "game_team_stats" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INTEGER,         -- REFERENCES games(id)
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


-- INSERT INTO "game_team_stats" (
--   season_id, opponent, location, 
--   us_goals_for, us_goals_against, us_ground_balls, us_shots, us_faceoffs_won, us_penalties_in_minutes,
--   opponent_goals_for, opponent_goals_against, opponent_ground_balls, opponent_shots, opponent_faceoffs_won, opponent_penalties_in_minutes,
--   us_scores_first, us_scores_second, us_scores_third, us_scores_fourth, us_scores_overtime,
--   opponent_scores_first, opponent_scores_second, opponent_scores_third, opponent_scores_fourth, opponent_scores_overtime
-- ) 
-- VALUES (
--   10001, 'Milton HS', '13025 Birmingham Hwy, Milton, GA 30004',
--   16, 11, 10, 24, 20, 2.5,
--   11, 16, 16, 22, 11, 5,
--   2, 4, 3, 7, 0,
--   2, 2, 4, 3, 0
-- );


CREATE TABLE "games" (
    -- "id" SERIAL,
    -- "game_id" INTEGER PRIMARY KEY,
    "game_id" SERIAL PRIMARY KEY,
    "season_id" INTEGER,                      -- REFERENCES seasons(id)
    "opponent_id" INTEGER,                    -- REFERENCES teams(id)
    "location_id" INTEGER,                    -- REFERENCES locations(id)
    "result" VARCHAR,
    "notes" VARCHAR,
    "is_home" BOOLEAN NOT NULL DEFAULT FALSE,
    "start_date" TIMESTAMP DEFAULT NOW(),
    "has_been_played" BOOLEAN NOT NULL DEFAULT FALSE,
    "goals_for" SMALLINT,
    "goals_against" SMALLINT,
    "goal_differential" SMALLINT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "created_by" INTEGER        -- REFERENCES users(id),
);

ALTER SEQUENCE games_game_id_seq RESTART WITH 1000;



CREATE TABLE "game_player_stats" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INTEGER,         -- REFERENCES games(id)
    "team_id" INTEGER,         -- REFERENCES teams(id)
    "season_id" INTEGER,       -- REFERENCES seasons(id)
    "player_id" VARCHAR,       -- REFERENCES players(player_id)
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

CREATE TABLE "orgs" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR,
    "slug" VARCHAR
);

CREATE TABLE "overtimes" (
    "id" SERIAL PRIMARY KEY,
    "game_id" INTEGER,         -- REFERENCES games(id)
    "us_scores_overtime" SMALLINT NOT NULL DEFAULT 0,
    "opponent_scores_overtime" SMALLINT NOT NULL DEFAULT 0
);
