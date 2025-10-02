-- Drop old tables if they exist (clean reset)
DROP TABLE IF EXISTS players_personal_info CASCADE;
DROP TABLE IF EXISTS players_games_records CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS coaches_credentials CASCADE;

-- Coaches credentials
CREATE TABLE coaches_credentials (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(150) NOT NULL,
    team_name VARCHAR(100) UNIQUE NOT NULL
);

-- Players (master list of players)
CREATE TABLE players (
    player_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    team_name VARCHAR(100) REFERENCES coaches_credentials(team_name),
    coach_id INT REFERENCES coaches_credentials(id)
);

-- Players games records (game log for each player)
CREATE TABLE players_games_records (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(player_id),
    game_date DATE NOT NULL,
    pitch_type VARCHAR(50) NOT NULL,
    release_speed FLOAT NOT NULL,
    spin_rate INT NOT NULL,
    release_pos_x FLOAT NOT NULL,
    release_pos_y FLOAT NOT NULL,
    release_pos_z FLOAT NOT NULL
);

-- Players personal information
CREATE TABLE players_personal_info (
    player_id INT PRIMARY KEY REFERENCES players(player_id),
    date_of_birth DATE NOT NULL,
    bats VARCHAR(1) NOT NULL,
    throws VARCHAR(1) NOT NULL,
    height VARCHAR(10) NOT NULL,
    weight INT NOT NULL,
    level VARCHAR(50) NOT NULL,
    how_acquired TEXT,
    signing_bonus INT,
    school VARCHAR(100)
);
