import { useState } from 'react';
import { gameRecordService } from '../services/gameRecordService';

export default function GameRecordForm({ playerId, onSuccess }) {
  const [formData, setFormData] = useState({
    player_id: playerId || '',
    game_date: '',
    pitch_type: '',
    release_speed: '',
    spin_rate: '',
    release_pos_x: '',
    release_pos_y: '',
    release_pos_z: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'player_id' || name === 'release_speed' || name === 'spin_rate' || 
              name === 'release_pos_x' || name === 'release_pos_y' || name === 'release_pos_z' 
              ? (value === '' ? '' : Number(value)) 
              : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.player_id || !formData.game_date || !formData.pitch_type || 
          !formData.release_speed || !formData.spin_rate) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      await gameRecordService.addGameRecord(formData);
      setSuccess('Game record added successfully!');
      
      // Reset form
      setFormData({
        player_id: playerId || '',
        game_date: '',
        pitch_type: '',
        release_speed: '',
        spin_rate: '',
        release_pos_x: '',
        release_pos_y: '',
        release_pos_z: '',
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to add game record');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '16px',
  };

  const fullWidthStyle = {
    gridColumn: '1 / -1',
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f9f9f9',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e0e0e0',
    }}>
      <h2 style={{ marginTop: '0', marginBottom: '20px', color: '#333' }}>Add Game Record</h2>

      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fee',
          color: '#c33',
          border: '1px solid #fcc',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: '12px',
          backgroundColor: '#efe',
          color: '#3c3',
          border: '1px solid #cfc',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '14px',
        }}>
          {success}
        </div>
      )}

      <div style={containerStyle}>
        {/* Player ID - Can be edited if not pre-filled */}
        <div style={fullWidthStyle}>
          <label style={labelStyle}>
            Player ID *
            <input
              type="number"
              name="player_id"
              placeholder="Enter Player ID"
              value={formData.player_id}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
        </div>

        {/* Game Date */}
        <div>
          <label style={labelStyle}>
            Game Date *
            <input
              type="date"
              name="game_date"
              value={formData.game_date}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
        </div>

        {/* Pitch Type */}
        <div>
          <label style={labelStyle}>
            Pitch Type *
            <select
              name="pitch_type"
              value={formData.pitch_type}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">-- Select Pitch Type --</option>
              <option value="Fastball">Fastball</option>
              <option value="Curveball">Curveball</option>
              <option value="Slider">Slider</option>
              <option value="Changeup">Changeup</option>
              <option value="Sinker">Sinker</option>
              <option value="Cutter">Cutter</option>
              <option value="Splitter">Splitter</option>
            </select>
          </label>
        </div>

        {/* Release Speed */}
        <div>
          <label style={labelStyle}>
            Release Speed (mph) *
            <input
              type="number"
              step="0.1"
              name="release_speed"
              placeholder="e.g., 92.5"
              value={formData.release_speed}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
        </div>

        {/* Spin Rate */}
        <div>
          <label style={labelStyle}>
            Spin Rate (RPM) *
            <input
              type="number"
              name="spin_rate"
              placeholder="e.g., 2200"
              value={formData.spin_rate}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </label>
        </div>

        {/* Release Position X */}
        <div>
          <label style={labelStyle}>
            Release Pos X (optional)
            <input
              type="number"
              step="0.01"
              name="release_pos_x"
              placeholder="e.g., 1.2"
              value={formData.release_pos_x}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        {/* Release Position Y */}
        <div>
          <label style={labelStyle}>
            Release Pos Y (optional)
            <input
              type="number"
              step="0.01"
              name="release_pos_y"
              placeholder="e.g., 5.5"
              value={formData.release_pos_y}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>

        {/* Release Position Z */}
        <div>
          <label style={labelStyle}>
            Release Pos Z (optional)
            <input
              type="number"
              step="0.01"
              name="release_pos_z"
              placeholder="e.g., 6.1"
              value={formData.release_pos_z}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s',
          marginTop: '16px',
        }}
        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0056b3')}
        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#007bff')}
      >
        {loading ? 'Submitting...' : 'Add Game Record'}
      </button>

      <p style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>
        * Required fields. The Record ID is auto-generated by the database.
      </p>
    </form>
  );
}