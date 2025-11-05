// frontend/src/frameworks-drivers/services/mlbApiService.js
class MLBApiService {
  constructor() {
    this.baseURL = 'https://statsapi.mlb.com/api/v1';
  }

  async getPlayerId(firstName, lastName) {
    try {
      const searchQuery = `${firstName} ${lastName}`;
      console.log('Searching for player:', searchQuery);
      
      const response = await fetch(
        `${this.baseURL}/people/search?names=${encodeURIComponent(searchQuery)}`
      );
      
      if (!response.ok) {
        console.error('MLB API error:', response.status, response.statusText);
        return null;
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      if (data.people && data.people.length > 0) {
        // Try to find exact match first
        const exactMatch = data.people.find(p => {
          const fullName = p.fullName?.toLowerCase() || '';
          const firstName = p.firstName?.toLowerCase() || '';
          const lastName = p.lastName?.toLowerCase() || '';
          const searchLower = searchQuery.toLowerCase();
          
          return fullName === searchLower || 
                 `${firstName} ${lastName}` === searchLower;
        });
        
        const playerId = exactMatch ? exactMatch.id : data.people[0].id;
        console.log('Found player ID:', playerId, 'for', searchQuery);
        return playerId;
      }
      
      console.log('No player found for:', searchQuery);
      return null;
    } catch (error) {
      console.error('Error fetching MLB player ID:', error);
      return null;
    }
  }

  // Fetch detailed player information from MLB API
  async getPlayerDetails(mlbPlayerId) {
    try {
      console.log('Fetching player details for MLB ID:', mlbPlayerId);
      
      const response = await fetch(
        `${this.baseURL}/people/${mlbPlayerId}`
      );
      
      if (!response.ok) {
        console.error('MLB API error fetching details:', response.status);
        return null;
      }
      
      const data = await response.json();
      console.log('Player details from MLB:', data);
      
      if (data.people && data.people.length > 0) {
        const player = data.people[0];
        
        // Convert height from inches to feet'inches"
        const heightInInches = player.height ? parseInt(player.height.replace(/[^\d]/g, '')) : null;
        let heightFormatted = null;
        if (heightInInches) {
          const feet = Math.floor(heightInInches / 12);
          const inches = heightInInches % 12;
          heightFormatted = `${feet}'${inches}"`;
        }
        
        // Calculate age from birthdate
        let age = null;
        if (player.birthDate) {
          const birthDate = new Date(player.birthDate);
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
        }
        
        return {
          height: heightFormatted || player.height,
          weight: player.weight,
          bats: player.batSide?.code || player.batSide?.description,
          throws: player.pitchHand?.code || player.pitchHand?.description,
          birthDate: player.birthDate,
          age: age,
          currentTeam: player.currentTeam?.name,
          primaryPosition: player.primaryPosition?.abbreviation,
          mlbDebutDate: player.mlbDebutDate
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching player details:', error);
      return null;
    }
  }

  // Try multiple image sources with fallbacks
  getPlayerImage(mlbPlayerId) {
    if (!mlbPlayerId) {
      console.warn('No MLB player ID provided for image');
      return null;
    }
    
    console.log('Getting image for MLB player ID:', mlbPlayerId);
    
    // Try these URLs in order via the image component's onError
    return {
      primary: `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${mlbPlayerId}/headshot/67/current`,
      fallback1: `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/r_max/w_180,q_auto:best/v1/people/${mlbPlayerId}/headshot/silo/current`,
      fallback2: `https://securea.mlb.com/mlb/images/players/head_shot/${mlbPlayerId}.jpg`,
      fallback3: `https://content.mlb.com/images/headshots/current/60x60/${mlbPlayerId}.jpg`
    };
  }
}

export const mlbApiService = new MLBApiService();