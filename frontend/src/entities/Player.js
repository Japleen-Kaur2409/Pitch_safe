// frontend/src/entities/Player.js
/**
 * Player Entity
 * 
 * Represents a baseball player with their physical attributes and statistics.
 * Encapsulates business logic for player data validation and calculations.
 * 
 * @class Player
 */
class Player {
  /**
   * Creates a new Player instance
   * 
   * @param {Object} params - Player parameters
   * @param {number} params.player_id - Unique player identifier
   * @param {string} params.first_name - Player's first name
   * @param {string} params.last_name - Player's last name
   * @param {number} params.team_id - Associated team ID
   * @param {string} params.position - Player's position (e.g., 'P' for pitcher)
   * @param {string} params.bats - Batting hand: 'R' (Right), 'L' (Left), 'S' (Switch)
   * @param {string} params.throws - Throwing hand: 'R' (Right) or 'L' (Left)
   * @param {string} params.height - Height in format: 6'2"
   * @param {number} params.weight - Weight in pounds
   * @param {Date} params.date_of_birth - Birth date for age calculation
   * @param {string} params.school - Educational institution
   * @param {string} params.level - Competition level (e.g., 'MLB', 'College')
   */
  constructor({ 
    player_id, 
    first_name, 
    last_name, 
    team_id, 
    position, 
    bats, 
    throws, 
    height, 
    weight, 
    date_of_birth, 
    school, 
    level 
  }) {
    this.player_id = player_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.team_id = team_id;
    this.position = position;
    this.bats = bats;
    this.throws = throws;
    this.height = height;
    this.weight = weight;
    this.date_of_birth = date_of_birth;
    this.school = school;
    this.level = level;
  }

// Gets the player's full name
  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

// Calculates the player's current age
  getAge() {
    if (!this.date_of_birth) return null;
    const birthDate = new Date(this.date_of_birth);
    const today = new Date();
    return Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
  }

// Gets human-readable batting hand description
  getBattingHand() {
    return this.bats === 'R' ? 'Right' : this.bats === 'L' ? 'Left' : 'Switch';
  }

// Gets human-readable throwing hand description
  getThrowingHand() {
    return this.throws === 'R' ? 'Right' : this.throws === 'L' ? 'Left' : 'Unknown';
  }
}

export default Player;