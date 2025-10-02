import { useEffect, useState } from "react";

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerId, setPlayerId] = useState("");
  const [playerInfo, setPlayerInfo] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/api/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    // Clear previous error
    setError("");
    
    // Check if input is empty
    if (!playerId.trim()) {
      setError("Please enter a player ID");
      setPlayerInfo(null);
      return;
    }

    setSearchLoading(true);
    setPlayerInfo(null);

    console.log(`Fetching: http://localhost:5001/api/players/${playerId}/info`);

    fetch(`http://localhost:5001/api/players/${playerId}/info`)
      .then((res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Player with ID ${playerId} not found`);
          } else {
            throw new Error(`Server error (Status: ${res.status})`);
          }
        }
        return res.json();
      })
      .then((data) => {
        console.log("Player data received:", data);
        setPlayerInfo(data);
        setSearchLoading(false);
        setError(""); // Clear any errors on success
      })
      .catch((err) => {
        console.error("Error fetching player info:", err);
        setError(err.message);
        setSearchLoading(false);
        setPlayerInfo(null);
      });
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SafePitch - Players List</h1>
      
      {loading ? (
        <p className="text-gray-600">Loading players...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Players</h2>
          <ul className="space-y-2">
            {players.map((player) => (
              <li key={player.player_id} className="flex items-center p-3 hover:bg-gray-50 rounded">
                <span className="text-gray-500 mr-3">ID: {player.player_id}</span>
                <span className="font-medium">{player.first_name} {player.last_name}</span>
                <span className="ml-auto text-blue-600">{player.team_name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search Player Personal Info</h2>
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter Player ID (e.g., 1, 2, 3)"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {searchLoading && (
          <div className="text-center py-4">
            <p className="text-gray-600">Loading player info...</p>
          </div>
        )}

        {playerInfo && !searchLoading && (
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-3 text-green-700">Player Information Found</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium text-gray-600">Player ID:</span>
                <span className="ml-2">{playerInfo.player_id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Date of Birth:</span>
                <span className="ml-2">{new Date(playerInfo.date_of_birth).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Bats:</span>
                <span className="ml-2">{playerInfo.bats === 'R' ? 'Right' : 'Left'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Throws:</span>
                <span className="ml-2">{playerInfo.throws === 'R' ? 'Right' : 'Left'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Height:</span>
                <span className="ml-2">{playerInfo.height}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Weight:</span>
                <span className="ml-2">{playerInfo.weight} lbs</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Level:</span>
                <span className="ml-2">{playerInfo.level}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">How Acquired:</span>
                <span className="ml-2">{playerInfo.how_acquired}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Signing Bonus:</span>
                <span className="ml-2">{playerInfo.signing_bonus ? `$${playerInfo.signing_bonus.toLocaleString()}` : "N/A"}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">School:</span>
                <span className="ml-2">{playerInfo.school || "N/A"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;