const fs = require('fs');
const path = require('path');
const axios = require('axios');

class MLCsvUpdater {
  constructor(options = {}) {
    // Path to CSV on backend filesystem (where this node process can write)
    this.localCsvPath = options.localCsvPath || path.resolve(__dirname, '../../../ml_injury/final_dataset/yankees.csv');
    // Path to provide to ML service (container path); allow override via env
    this.mlCsvPath = options.mlCsvPath || process.env.ML_CSV_PATH_FOR_ML || '/app/final_dataset/yankees.csv';
    this.mlApiUrl = options.mlApiUrl || process.env.ML_API_URL || 'http://localhost:5002';
  }

  async appendRecordAndRun(savedRecord, { topKRatio = 0.10, startDate = '2024-04-01' } = {}) {
    // Ensure CSV exists
    if (!fs.existsSync(this.localCsvPath)) {
      throw new Error(`CSV not found at local path: ${this.localCsvPath}`);
    }

    // Read CSV header and existing lines
    const raw = fs.readFileSync(this.localCsvPath, 'utf8');
    const lines = raw.split(/\r?\n/);
    const header = lines[0];
    const columns = header.split(',').map(c => c.trim());

    // Find last row for this player to copy contextual values
    const playerName = (savedRecord.player_name || '').trim();
    const formattedPlayerName = this.formatPlayerName(playerName);
    let lastRowValues = null;
    let lastRowIndex = -1;
    
    for (let i = lines.length - 1; i >= 1; i--) {
      const line = lines[i];
      if (!line || !line.trim()) continue;
      
      // Parse CSV line (handle quoted values)
      const cols = this.parseCSVLine(line);
      if (cols.length > 0) {
        // Clean the player name from CSV: remove quotes and trim
        let rowPlayerName = (cols[0] || '').replace(/^"|"$/g, '').trim();
        // Also format it for comparison (in case it was "First Last" format in old data)
        const formattedRowName = this.formatPlayerName(rowPlayerName);
        
        if (formattedRowName === formattedPlayerName) {
          lastRowValues = cols;
          lastRowIndex = i;
          break;
        }
      }
    }

    // Build new row object keyed by column name and fill logically
    const newRow = {};
    columns.forEach(col => {
      newRow[col] = '';
    });

    // Core fields
    // Format player name as "Last, First" (without extra quotes; CSV quoting happens later)
    newRow['player_name'] = this.formatPlayerName(playerName);
    newRow['game_date'] = this.formatGameDate(savedRecord.game_date || new Date().toISOString().split('T')[0]);
    newRow['result'] = savedRecord.result != null ? String(savedRecord.result) : (lastRowValues ? (lastRowValues[columns.indexOf('result')] || '0') : '0');
    newRow['total_pitches'] = savedRecord.total_pitches != null ? String(savedRecord.total_pitches) : (lastRowValues ? (lastRowValues[columns.indexOf('total_pitches')] || '0') : '0');

    // Input speed/spin from form, or from lastRow
    const speed = savedRecord.release_speed != null ? String(savedRecord.release_speed) : 
      (lastRowValues ? (lastRowValues[columns.indexOf('release_speed_mean_all')] || '') : '');
    const spin = savedRecord.spin_rate != null ? String(savedRecord.spin_rate) : 
      (lastRowValues ? (lastRowValues[columns.indexOf('release_spin_rate_mean_all')] || '') : '');
    
    // Fill all columns by preference: (1) explicit input, (2) derived from pitch type, (3) copy from lastRow
    columns.forEach((col, colIdx) => {
      if (newRow[col] && newRow[col] !== '') return; // already set
      
      // Global mean/std columns for release_speed
      if (col === 'release_speed_mean_all') {
        newRow[col] = speed;
      }
      else if (col === 'release_spin_rate_mean_all') {
        newRow[col] = spin;
      }
      // Global positions
      else if (col === 'release_pos_x_mean_all') {
        newRow[col] = savedRecord.release_pos_x != null ? String(savedRecord.release_pos_x) : 
          (lastRowValues ? lastRowValues[colIdx] : '');
      }
      else if (col === 'release_pos_y_mean_all') {
        newRow[col] = savedRecord.release_pos_y != null ? String(savedRecord.release_pos_y) : 
          (lastRowValues ? lastRowValues[colIdx] : '');
      }
      else if (col === 'release_pos_z_mean_all') {
        newRow[col] = savedRecord.release_pos_z != null ? String(savedRecord.release_pos_z) : 
          (lastRowValues ? lastRowValues[colIdx] : '');
      }
      // Pitch-type specific columns (pct_CODE and CODE_release_speed_mean, etc.)
      else if (col.startsWith('pct_')) {
        const code = col.substring(4); // e.g., 'SI' from 'pct_SI'
        const pitchType = (savedRecord.pitch_type || '').toUpperCase();
        newRow[col] = (code === pitchType) ? '1' : '0';
      }
      else if (/_release_speed_mean$/.test(col) || /_release_spin_rate_mean$/.test(col) || /_release_pos_[xyz]_mean$/.test(col)) {
        // For pitch-type specific mean fields:
        // - If the user provided a `release_speed` or `spin_rate`, use those values for ALL
        //   `*_release_speed_mean` and `*_release_spin_rate_mean` columns respectively.
        // - For release position mean columns, prefer provided values for the matching pitch type
        //   (as before), otherwise copy from the last row when available.
        if (/_release_speed_mean$/.test(col)) {
          if (savedRecord.release_speed != null) {
            newRow[col] = String(savedRecord.release_speed);
          } else {
            newRow[col] = lastRowValues ? (lastRowValues[colIdx] || '') : '';
          }
        } else if (/_release_spin_rate_mean$/.test(col)) {
          if (savedRecord.spin_rate != null) {
            newRow[col] = String(savedRecord.spin_rate);
          } else {
            newRow[col] = lastRowValues ? (lastRowValues[colIdx] || '') : '';
          }
        } else if (/_release_pos_x_mean$/.test(col)) {
          // For position means, prefer provided value when pitch type matches, else copy
          const pitchType = (savedRecord.pitch_type || '').toUpperCase();
          const code = col.split('_')[0];
          if (code === pitchType && savedRecord.release_pos_x != null) {
            newRow[col] = String(savedRecord.release_pos_x);
          } else {
            newRow[col] = lastRowValues ? lastRowValues[colIdx] || '' : '';
          }
        } else if (/_release_pos_y_mean$/.test(col)) {
          const pitchType = (savedRecord.pitch_type || '').toUpperCase();
          const code = col.split('_')[0];
          if (code === pitchType && savedRecord.release_pos_y != null) {
            newRow[col] = String(savedRecord.release_pos_y);
          } else {
            newRow[col] = lastRowValues ? lastRowValues[colIdx] || '' : '';
          }
        } else if (/_release_pos_z_mean$/.test(col)) {
          const pitchType = (savedRecord.pitch_type || '').toUpperCase();
          const code = col.split('_')[0];
          if (code === pitchType && savedRecord.release_pos_z != null) {
            newRow[col] = String(savedRecord.release_pos_z);
          } else {
            newRow[col] = lastRowValues ? lastRowValues[colIdx] || '' : '';
          }
        }
      }
      // Any other column: copy from lastRow
      else if (lastRowValues && colIdx < lastRowValues.length) {
        newRow[col] = lastRowValues[colIdx] || '';
      }
    });

    // Construct CSV line in column order
    const line = columns.map(col => {
      // quote fields containing commas or quotes
      const val = newRow[col] !== undefined ? newRow[col] : '';
      if (val == null) return '';
      const s = String(val);
      if (s.includes(',') || s.includes('"')) return `"${s.replace(/"/g, '""')}"`;
      return s;
    }).join(',');

    // Insert line at correct position (after lastRowIndex if found, else append)
    if (lastRowIndex >= 0) {
      // Insert after the last row of this player
      lines.splice(lastRowIndex + 1, 0, line);
      fs.writeFileSync(this.localCsvPath, lines.join('\n'), 'utf8');
    } else {
      // Player not found; append to end
      fs.appendFileSync(this.localCsvPath, '\n' + line, 'utf8');
    }

    // Trigger ML service to re-run predictions. Try multiple candidate paths to account for Docker mounts.
    const candidates = [];
    if (this.mlCsvPath) candidates.push(this.mlCsvPath);

    // Derive candidate by mapping localCsvPath to container /app/backend/... if possible
    try {
      const lp = path.resolve(this.localCsvPath);
      const backendIndex = lp.indexOf(path.sep + 'backend' + path.sep);
      if (backendIndex >= 0) {
        const suffix = lp.substring(backendIndex + 1); // remove leading slash
        candidates.push(path.posix.join('/app', suffix.replace(/\\/g, '/')));
      }
    } catch (e) {
      // ignore
    }

    // Also try common locations
    const filename = path.basename(this.localCsvPath);
    candidates.push(`/app/final_dataset/${filename}`);
    candidates.push(`/app/backend/ml_injury/final_dataset/${filename}`);

    // Remove duplicates while preserving order
    const seen = new Set();
    const uniqueCandidates = candidates.filter(c => {
      if (!c) return false;
      if (seen.has(c)) return false;
      seen.add(c);
      return true;
    });

    let lastErr = null;
    for (const candidate of uniqueCandidates) {
      try {
        const url = this.mlApiUrl.replace(/\/$/, '') + '/predict';
        const resp = await axios.post(url, {
          csv_path: candidate,
          top_k_ratio: topKRatio,
          start_date: startDate
        }, { timeout: 120000 });

        if (resp.data && resp.data.success) {
          return resp.data.data; // array of predictions
        }
        lastErr = new Error(resp.data && resp.data.error ? resp.data.error : 'ML service returned failure');
      } catch (err) {
        lastErr = err;
        // try next candidate
      }
    }

    throw new Error(`Failed to run ML after append (tried paths: ${uniqueCandidates.join(', ')}): ${lastErr && lastErr.message}`);
  }

  formatDate(d) {
    if (!d) return '';
    if (d instanceof Date) return d.toISOString().split('T')[0];
    return d;
  }

  // Format player name: if "First Last", convert to "Last, First"; handle already-formatted names
  // This removes quotes and converts format, so output is always clean "Last, First" without quotes
  formatPlayerName(name) {
    if (!name) return '';
    // Remove existing quotes if present
    let cleaned = name.replace(/^"|"$/g, '').trim();
    // If no comma, assume "First Last" format and convert to "Last, First"
    if (!cleaned.includes(',')) {
      const parts = cleaned.split(/\s+/);
      if (parts.length >= 2) {
        // Format: First Middle Last -> Last, First Middle (or just First Last -> Last, First)
        const lastName = parts[parts.length - 1];
        const firstName = parts.slice(0, parts.length - 1).join(' ');
        return `${lastName}, ${firstName}`;
      }
    }
    return cleaned;
  }

  // Format date: Convert ISO (2025-11-22) to M/D/YYYY (11/22/2025)
  formatGameDate(dateStr) {
    if (!dateStr) return '';
    
    // If it's already in M/D/YYYY or similar short format, return as-is
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    
    // If it's ISO format (YYYY-MM-DD), convert to M/D/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return `${parseInt(month)}/${parseInt(day)}/${year}`;
    }
    
    // If it's a Date object, convert to M/D/YYYY
    if (dateStr instanceof Date) {
      const m = dateStr.getMonth() + 1;
      const d = dateStr.getDate();
      const y = dateStr.getFullYear();
      return `${m}/${d}/${y}`;
    }
    
    return dateStr;
  }

  // Parse a CSV line handling quoted fields
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quotes
          insideQuotes = !insideQuotes;
        }
      } else if (char === ',' && !insideQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add last field
    result.push(current.trim());
    return result;
  }
}

module.exports = MLCsvUpdater;
