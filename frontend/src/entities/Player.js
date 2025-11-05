// frontend/src/entities/Player.js
class Player {
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

  getFullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  getAge() {
    if (!this.date_of_birth) return null;
    const birthDate = new Date(this.date_of_birth);
    const today = new Date();
    return Math.floor((today - birthDate) / (365.25 * 24 * 60 * 60 * 1000));
  }

  getBattingHand() {
    return this.bats === 'R' ? 'Right' : this.bats === 'L' ? 'Left' : 'Switch';
  }

  getThrowingHand() {
    return this.throws === 'R' ? 'Right' : this.throws === 'L' ? 'Left' : 'Unknown';
  }
}

export default Player;