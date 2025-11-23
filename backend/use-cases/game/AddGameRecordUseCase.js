// backend/use-cases/game/AddGameRecordUseCase.js
const { AddGameRecordInputBoundary } = require('./interfaces/AddGameRecordInputBoundary');

class AddGameRecordUseCase extends AddGameRecordInputBoundary {
  constructor(gameDataAccess, outputBoundary, mlCsvUpdater = null, playerDataAccess = null) {
    super();
    this.gameDataAccess = gameDataAccess;
    this.outputBoundary = outputBoundary;
    this.mlCsvUpdater = mlCsvUpdater;
    this.playerDataAccess = playerDataAccess;
  }

  async execute(inputData) {
    try {
      // Validate input data
      this.validateInput(inputData);

      // Create game record entity
      const gameRecord = {
        player_id: inputData.playerId,
        game_date: inputData.gameDate,
        pitch_type: inputData.pitchType,
        release_speed: inputData.releaseSpeed,
        spin_rate: inputData.spinRate,
        release_pos_x: inputData.releasePosX,
        release_pos_y: inputData.releasePosY,
        release_pos_z: inputData.releasePosZ
      };

      // Save to database
      const savedRecord = await this.gameDataAccess.addGameRecord(gameRecord);

      // Optionally append to CSV and re-run ML to get updated predictions
      let mlData = null;
      if (this.mlCsvUpdater) {
        try {
          // Build a minimal savedRecord object expected by updater
          let playerName = savedRecord.player_name || null;
          if (!playerName && this.playerDataAccess) {
            try {
              const players = await this.playerDataAccess.getAllPlayers();
              const p = players.find(pp => parseInt(pp.player_id) === parseInt(savedRecord.player_id));
              if (p) {
                // Some data sources store names in different orders.
                // Flip to "last first" so downstream CSV formatter creates "Last, First".
                playerName = `${p.last_name} ${p.first_name}`;
                console.log(`[AddGameRecordUseCase] Resolved player id=${p.player_id} -> playerName='${playerName}'`);
              }
            } catch (e) {
              // ignore
            }
          }
          const rec = Object.assign({}, savedRecord, {
            player_name: playerName || String(savedRecord.player_id),
            release_speed: savedRecord.release_speed,
            spin_rate: savedRecord.spin_rate,
            game_date: savedRecord.game_date,
            total_pitches: savedRecord.total_pitches || ''
          });
          const results = await this.mlCsvUpdater.appendRecordAndRun(rec);
          // convert results (array) into player-keyed map like use-case normally produces
          mlData = {};
          (results || []).forEach(pred => {
            const name = pred.player_name;
            if (!mlData[name]) {
              mlData[name] = {
                player_name: name,
                injury_risk_prob: pred.injury_risk_prob,
                risk_level: pred.risk_level,
                game_date: pred.game_date
              };
            }
          });
        } catch (err) {
          // don't break the main flow; log and continue
          console.error('ML CSV updater error:', err.message);
        }
      }

      // Present success (include mlData if available)
      this.outputBoundary.presentSuccess({
        message: 'Game record added successfully',
        recordId: savedRecord.record_id,
        playerId: savedRecord.player_id,
        gameDate: savedRecord.game_date,
        pitchType: savedRecord.pitch_type,
        releaseSpeed: savedRecord.release_speed,
        spinRate: savedRecord.spin_rate,
        injuryRiskData: mlData
      });

    } catch (error) {
      this.outputBoundary.presentError(error.message);
    }
  }

  validateInput(inputData) {
    const errors = [];

    if (!inputData.playerId || inputData.playerId <= 0) {
      errors.push('Valid player ID is required');
    }

    if (!inputData.gameDate) {
      errors.push('Game date is required');
    }

    if (!inputData.pitchType) {
      errors.push('Pitch type is required');
    }

    if (!inputData.releaseSpeed || inputData.releaseSpeed <= 0) {
      errors.push('Valid release speed is required');
    }

    if (!inputData.spinRate || inputData.spinRate <= 0) {
      errors.push('Valid spin rate is required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}

module.exports = AddGameRecordUseCase;