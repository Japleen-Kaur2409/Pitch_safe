// frontend/src/use-cases/data-transfer/GameInputData.js
class GameInputData {
  constructor(playerId, date, opponent, inningsPitched, hits, runs, earnedRuns, walks, strikeouts, homeRuns, pitchesThrown, notes) {
    this.playerId = playerId;
    this.date = date;
    this.opponent = opponent;
    this.inningsPitched = inningsPitched;
    this.hits = hits;
    this.runs = runs;
    this.earnedRuns = earnedRuns;
    this.walks = walks;
    this.strikeouts = strikeouts;
    this.homeRuns = homeRuns;
    this.pitchesThrown = pitchesThrown;
    this.notes = notes;
  }
}

export default GameInputData;