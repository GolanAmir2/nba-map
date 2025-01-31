import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from 'leaflet';

const TEAM_CITIES = {
  'ATL': { city: 'Atlanta', coords: [33.7490, -84.3880], logo: 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg' },
  'BOS': { city: 'Boston', coords: [42.3601, -71.0589], logo: 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg' },
  'BKN': { city: 'Brooklyn', coords: [40.6782, -73.9442], logo: 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg' },
  'CHA': { city: 'Charlotte', coords: [35.2271, -80.8431], logo: 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg' },
  'CHI': { city: 'Chicago', coords: [41.8781, -87.6298], logo: 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg' },
  'CLE': { city: 'Cleveland', coords: [41.4993, -81.6944], logo: 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg' },
  'DAL': { city: 'Dallas', coords: [32.7767, -96.7970], logo: 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg' },
  'DEN': { city: 'Denver', coords: [39.7392, -104.9903], logo: 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg' },
  'DET': { city: 'Detroit', coords: [42.3314, -83.0458], logo: 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg' },
  'GSW': { city: 'San Francisco', coords: [37.7749, -122.4194], logo: 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg' },
  'HOU': { city: 'Houston', coords: [29.7604, -95.3698], logo: 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg' },
  'IND': { city: 'Indianapolis', coords: [39.7684, -86.1581], logo: 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg' },
  'LAC': { city: 'Los Angeles', coords: [34.0522, -118.2437], logo: 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg' },
  'LAL': { city: 'Los Angeles', coords: [34.0522, -118.2437], logo: 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg' },
  'MEM': { city: 'Memphis', coords: [35.1495, -90.0490], logo: 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg' },
  'MIA': { city: 'Miami', coords: [25.7617, -80.1918], logo: 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg' },
  'MIL': { city: 'Milwaukee', coords: [43.0389, -87.9065], logo: 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg' },
  'MIN': { city: 'Minneapolis', coords: [44.9778, -93.2650], logo: 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg' },
  'NOP': { city: 'New Orleans', coords: [29.9511, -90.0715], logo: 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg' },
  'NYK': { city: 'New York', coords: [40.7128, -74.0060], logo: 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg' },
  'OKC': { city: 'Oklahoma City', coords: [35.4676, -97.5164], logo: 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg' },
  'ORL': { city: 'Orlando', coords: [28.5383, -81.3792], logo: 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg' },
  'PHI': { city: 'Philadelphia', coords: [39.9526, -75.1652], logo: 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg' },
  'PHX': { city: 'Phoenix', coords: [33.4484, -112.0740], logo: 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg' },
  'POR': { city: 'Portland', coords: [45.5155, -122.6789], logo: 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg' },
  'SAC': { city: 'Sacramento', coords: [38.5816, -121.4944], logo: 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg' },
  'SAS': { city: 'San Antonio', coords: [29.4241, -98.4936], logo: 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg' },
  'TOR': { city: 'Toronto', coords: [43.6532, -79.3832], logo: 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg' },
  'UTA': { city: 'Salt Lake City', coords: [40.7608, -111.8910], logo: 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg' },
  'WAS': { city: 'Washington DC', coords: [38.9072, -77.0369], logo: 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg' }
};

const fetchNBAScorers = async (season) => {
  try {
    // Format the season string (e.g., "2023" becomes "2023-24")
    const seasonStr = `${season}-${(Number(season) + 1).toString().slice(2)}`;
    
    const response = await fetch(`https://stats.nba.com/stats/leagueLeaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=${seasonStr}&SeasonType=Regular%20Season&StatCategory=PTS`, {
      headers: {
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Host': 'stats.nba.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://stats.nba.com/',
        'x-nba-stats-origin': 'stats',
        'x-nba-stats-token': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API Response:', data);

    const processedData = data.resultSet.rowSet
      .slice(0, 10)
      .map((player, index) => {
        const teamAbbr = player[4];
        const teamInfo = TEAM_CITIES[teamAbbr] || TEAM_CITIES['NYK'];
        
        return {
          name: player[2],
          team: teamAbbr,
          season: seasonStr,  // Use the formatted season string
          ppg: Number(player[23]).toFixed(1),
          totalPoints: Math.round(Number(player[23]) * Number(player[5])),
          location: teamInfo.city,
          coords: teamInfo.coords,
          logo: teamInfo.logo,
          rank: index + 1
        };
      });

    return processedData;
  } catch (error) {
    console.error("Detailed error:", error);
    throw new Error(`API Error: ${error.message}`);
  }
};

const NBAStatsMap = () => {
  const [season, setSeason] = useState("2023");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const topScorers = await fetchNBAScorers(season);
        setPlayers(topScorers); // Using the data directly without geocoding
      } catch (error) {
        setError("Failed to load NBA data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, [season]);

  const createCustomIcon = (logoUrl) => {
    return new Icon({
      iconUrl: logoUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center">NBA Top Scorers Map ({season})</h1>
      <select 
        onChange={(e) => setSeason(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <option key={i} value={`${2023 - i}`}>{2023 - i}</option>
        ))}
      </select>
      
      {loading && <div className="text-center my-4">Loading...</div>}
      {error && <div className="text-center text-red-500 my-4">{error}</div>}
      
      {!error && (
        <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {players.map((player, index) => (
            <Marker 
              key={index} 
              position={player.coords}
              icon={createCustomIcon(player.logo)}
            >
              <Popup>
                <div className="font-bold">{player.name}</div>
                <div className="text-sm text-gray-600">Rank: #{player.rank} in scoring</div>
                <div>Team: {player.team}</div>
                <div>City: {player.location}</div>
                <div>PPG: {player.ppg}</div>
                <div>Total Points: {player.totalPoints}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default NBAStatsMap;
