// backend/entities/Game.js
class Game {
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

  isValid() {
    // Basic validation rules
    if (!this.player_id || this.player_id <= 0) return false;
    if (!this.game_date) return false;
    if (!this.pitch_type) return false;
    if (!this.release_speed || this.release_speed <= 0) return false;
    if (!this.spin_rate || this.spin_rate <= 0) return false;
    
    return true;
  }

  getFormattedDate() {
    if (!this.game_date) return '';
    const date = new Date(this.game_date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

module.exports = Game;