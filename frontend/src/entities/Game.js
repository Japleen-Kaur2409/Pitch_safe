// frontend/src/entities/Game.js
/**
 * Game Entity
 * 
 * Represents a single game performance record for a player.
 * Contains pitching statistics and calculated metrics.
 * 
 * @class Game
 */

class Game {
  /**
   * Creates a new Game instance
   * 
   * @param {Object} params - Game parameters
   * @param {number} params.record_id - Unique game record identifier
   * @param {number} params.player_id - Associated player ID
   * @param {Date} params.game_date - Date the game was played
   * @param {string} params.pitch_type - Type of pitch (e.g., 'Fastball', 'Slider')
   * @param {number} params.release_speed - Ball release speed in MPH
   * @param {number} params.spin_rate - Ball spin rate in RPM
   * @param {number} params.release_pos_x - X-axis release position
   * @param {number} params.release_pos_y - Y-axis release position
   * @param {number} params.release_pos_z - Z-axis release position
   * @param {string} params.opponent - Opposing team name
   * @param {number} params.innings_pitched - Number of innings pitched
   * @param {number} params.hits - Hits allowed
   * @param {number} params.runs - Runs allowed
   * @param {number} params.earned_runs - Earned runs allowed
   * @param {number} params.walks - Walks issued
   * @param {number} params.strikeouts - Strikeouts recorded
   * @param {number} params.home_runs - Home runs allowed
   * @param {number} params.pitches_thrown - Total pitches thrown
   * @param {string} params.notes - Additional game notes
   */
  constructor({
    record_id,
    player_id,
    game_date,
    pitch_type,
    release_speed,
    spin_rate,
    release_pos_x,
    release_pos_y,
    release_pos_z,
    opponent,
    innings_pitched,
    hits,
    runs,
    earned_runs,
    walks,
    strikeouts,
    home_runs,
    pitches_thrown,
    notes
  }) {
    this.record_id = record_id;
    this.player_id = player_id;
    this.game_date = game_date;
    this.pitch_type = pitch_type;
    this.release_speed = release_speed;
    this.spin_rate = spin_rate;
    this.release_pos_x = release_pos_x;
    this.release_pos_y = release_pos_y;
    this.release_pos_z = release_pos_z;
    this.opponent = opponent;
    this.innings_pitched = innings_pitched;
    this.hits = hits;
    this.runs = runs;
    this.earned_runs = earned_runs;
    this.walks = walks;
    this.strikeouts = strikeouts;
    this.home_runs = home_runs;
    this.pitches_thrown = pitches_thrown;
    this.notes = notes;
  }

// Formats the game date for display
  getFormattedDate() {
    if (!this.game_date) return '';
    const date = new Date(this.game_date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

// Calculates the strikeout percentage for this game
  calculateStrikePercentage() {
    if (!this.pitches_thrown || !this.strikeouts) return 0;
    return (this.strikeouts / this.pitches_thrown) * 100;
  }

// Calculates the Earned Run Average (ERA) for this game
  getEarnedRunAverage() {
    if (!this.innings_pitched || !this.earned_runs) return 0;
    return (this.earned_runs / this.innings_pitched) * 9;
  }
}

export default Game;