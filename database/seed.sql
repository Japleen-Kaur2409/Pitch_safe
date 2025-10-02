-- Reset tables (optional if schema.sql already dropped them)
TRUNCATE TABLE players_games_records CASCADE;
TRUNCATE TABLE players_personal_info CASCADE;
TRUNCATE TABLE players CASCADE;
TRUNCATE TABLE coaches_credentials CASCADE;

-- 1. Coaches
INSERT INTO coaches_credentials (username, password, team_name)
VALUES
    ('coach_john', 'securepass1', 'Blue Jays'),
    ('coach_sarah', 'securepass2', 'Red Sox');

-- 2. Players
INSERT INTO players (first_name, last_name, team_name, coach_id)
VALUES
    ('Mike', 'Smith', 'Blue Jays', 1),
    ('Tom', 'Johnson', 'Blue Jays', 1),
    ('Alex', 'Williams', 'Red Sox', 2);

-- 3. Players personal info
INSERT INTO players_personal_info (player_id, date_of_birth, bats, throws, height, weight, level, how_acquired, signing_bonus, school)
VALUES
    (1, '2000-05-15', 'R', 'R', '6ft', 185, 'College', 'Drafted', 50000, 'UCLA'),
    (2, '1999-08-20', 'L', 'R', '5ft11', 175, 'High School', 'Walk-on', NULL, 'Boston HS'),
    (3, '2001-01-10', 'R', 'L', '6ft2', 190, 'College', 'Drafted', 75000, 'MIT');

-- 4. Players games records
INSERT INTO players_games_records (player_id, game_date, pitch_type, release_speed, spin_rate, release_pos_x, release_pos_y, release_pos_z)
VALUES
    (1, '2025-04-01', 'Fastball', 92.5, 2200, 1.2, 5.5, 6.1),
    (1, '2025-04-05', 'Slider', 85.0, 2100, 1.1, 5.6, 6.0),
    (2, '2025-04-02', 'Curveball', 78.5, 2400, 1.0, 5.3, 6.2),
    (3, '2025-04-03', 'Changeup', 80.2, 2000, 1.3, 5.7, 6.3);
