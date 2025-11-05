// backend/entities/Player.js
class Player {
  constructor(playerId, firstName, lastName, dateOfBirth, level, school, bats, throws, height, weight) {
    this.playerId = playerId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.level = level;
    this.school = school;
    this.bats = bats; // 'R', 'L', 'S' (switch)
    this.throws = throws; // 'R' or 'L'
    this.height = height;
    this.weight = weight;
    this.validationErrors = [];
  }

  // Business rule: Player must have valid personal information
  isValid() {
    this.validationErrors = [];

    if (!this.firstName || this.firstName.trim().length === 0) {
      this.validationErrors.push("First name is required");
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      this.validationErrors.push("Last name is required");
    }

    if (this.bats && !['R', 'L', 'S'].includes(this.bats)) {
      this.validationErrors.push("Bats must be 'R', 'L', or 'S'");
    }

    if (this.throws && !['R', 'L'].includes(this.throws)) {
      this.validationErrors.push("Throws must be 'R' or 'L'");
    }

    if (this.dateOfBirth) {
      const age = this.calculateAge();
      if (age < 10 || age > 60) {
        this.validationErrors.push("Player age must be between 10 and 60");
      }
    }

    if (this.weight && (this.weight < 100 || this.weight > 350)) {
      this.validationErrors.push("Weight must be between 100 and 350 lbs");
    }

    return this.validationErrors.length === 0;
  }

  calculateAge() {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getValidationErrors() {
    return this.validationErrors;
  }

  // Convert to plain object for data access layer
  toDataObject() {
    return {
      player_id: this.playerId,
      first_name: this.firstName,
      last_name: this.lastName,
      date_of_birth: this.dateOfBirth,
      level: this.level,
      school: this.school,
      bats: this.bats,
      throws: this.throws,
      height: this.height,
      weight: this.weight
    };
  }

  // Create from data access object
  static fromDataObject(data) {
    return new Player(
      data.player_id,
      data.first_name,
      data.last_name,
      data.date_of_birth,
      data.level,
      data.school,
      data.bats,
      data.throws,
      data.height,
      data.weight
    );
  }
}

module.exports = Player;