// frontend/src/frameworks-drivers/views/RosterView.jsx
import React, { useState } from 'react';
import PlayerCard from '../components/PlayerCard';

const RosterView = ({
players,
loading,
error,
playerMLBIds,
onPlayerClick,
getPlayerImage
}) => {
if (loading) {
return (
<div style={{ color: "white", textAlign: "center", padding: "20px" }}>
Loading players...
</div>
);
}

if (error) {
return (
<div style={{ color: "white", textAlign: "center", padding: "20px" }}>
Error loading players: {error}
</div>
);
}

if (players.length === 0) {
return (
<div style={{ color: "white", textAlign: "center", padding: "20px" }}>
No players found. Please add players to your roster.
</div>
);
}

const getMarkerColor = (fatigueScore) => {
if (fatigueScore >= 50) return '#e74c3c';
if (fatigueScore >= 30) return '#f39c12';
if (fatigueScore >= 15) return '#f1c40f';
return '#2ecc71';
};

return (
<div>
{/* ---- FATIGUE SPECTRUM SECTION ---- */}
<div style={{ marginBottom: "24px", paddingTop: "10px" }}>
<h2 style={{
fontSize: "22px",
fontWeight: 700,
marginBottom: "20px",
textAlign: "center",
color: "white",
textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
}}>
Fatigue Spectrum
</h2>

{/* Main container with extra height for player markers below */}
<div style={{
position: "relative",
height: "300px",
marginBottom: "20px",
width: "100%",
}}>
{/* LEFT ARROW (High fatigue) */}
<div style={{
position: "absolute",
left: "0",
top: "20px",
}}>
<svg width="80" height="80" viewBox="0 0 100 100">
<path d="M 80 20 L 20 50 L 80 80 Z" fill="#e74c3c" />
</svg>
</div>

{/* Gradient Line with Zone Labels */}
<div style={{
position: "absolute",
top: "55px",
left: "90px",
right: "90px",
height: "24px",
background: "linear-gradient(to right, #e74c3c 0%, #f39c12 30%, #f1c40f 50%, #2ecc71 100%)",
borderRadius: "12px",
boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
}}>
{/* Zone markers */}
<div style={{
position: "absolute",
left: "0%",
top: "-32px",
fontSize: "11px",
color: "white",
fontWeight: 700,
textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
whiteSpace: "nowrap",
}}>
Critical (100%)
</div>
<div style={{
position: "absolute",
right: "0%",
top: "-32px",
fontSize: "11px",
color: "white",
fontWeight: 700,
textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
whiteSpace: "nowrap",
}}>
Optimal (0%)
</div>
</div>

{/* Right Arrow (Low/Good fatigue) */}
<div style={{
position: "absolute",
right: "0",
top: "20px",
}}>
<svg width="80" height="80" viewBox="0 0 100 100">
<path d="M 20 20 L 80 50 L 20 80 Z" fill="#2ecc71" />
</svg>
</div>

{/* ==== PLAYER MARKERS ON FATIGUE LINE ==== */}
{players.map((player) => {
const fatigueScore = player.fatigue_score || 0;
const mlbId = playerMLBIds[player.player_id];
const imageUrls = mlbId ? getPlayerImage(mlbId) : null;
const markerColor = getMarkerColor(fatigueScore);

// Position: inverted so high fatigue is on the left
// 100% fatigue = left (critical), 0% fatigue = right (optimal)
const leftPosition = `${100 - fatigueScore}%`;

return (
<div
key={player.player_id}
style={{
position: "absolute",
left: leftPosition,
top: "30px",
transform: "translateX(-50%)",
display: "flex",
flexDirection: "column",
alignItems: "center",
cursor: "pointer",
zIndex: 10,
}}
onClick={() => onPlayerClick(player, players.indexOf(player))}
onMouseEnter={(e) => {
e.currentTarget.style.transform = "translateX(-50%) scale(1.15)";
e.currentTarget.style.zIndex = "20";
}}
onMouseLeave={(e) => {
e.currentTarget.style.transform = "translateX(-50%) scale(1)";
e.currentTarget.style.zIndex = "10";
}}
title={`${player.first_name} ${player.last_name} - Fatigue: ${fatigueScore.toFixed(1)}%`}
>
{/* Player Image Marker */}
<div style={{
width: "56px",
height: "56px",
background: "white",
borderRadius: "50%",
display: "flex",
alignItems: "center",
justifyContent: "center",
boxShadow: `0 4px 12px ${markerColor}80`,
border: `3px solid ${markerColor}`,
overflow: "hidden",
}}>
{imageUrls?.primary ? (
<img
src={imageUrls.primary}
alt={`${player.first_name} ${player.last_name}`}
style={{
width: "56px",
height: "56px",
objectFit: "cover",
}}
onError={(e) => {
e.currentTarget.style.display = "none";
if (e.currentTarget.nextSibling) {
e.currentTarget.nextSibling.style.display = "flex";
}
}}
/>
) : null}
<div style={{
width: "56px",
height: "56px",
display: imageUrls?.primary ? "none" : "flex",
alignItems: "center",
justifyContent: "center",
fontSize: "26px",
background: "linear-gradient(135deg, #e8d5d5 0%, #d5c8e8 100%)",
}}>
👤
</div>
</div>

{/* Player ID below marker */}
<div style={{
fontSize: "11px",
marginTop: "6px",
textAlign: "center",
fontWeight: 700,
color: "white",
textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
whiteSpace: "nowrap",
}}>
#{player.player_id}
</div>

{/* Fatigue score label */}
<div style={{
fontSize: "10px",
marginTop: "2px",
textAlign: "center",
fontWeight: 600,
color: "white",
textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
background: "rgba(0, 0, 0, 0.3)",
borderRadius: "4px",
padding: "2px 4px",
}}>
{fatigueScore.toFixed(0)}%
</div>
</div>
);
})}
</div>
</div>

{/* Player List */}
<div style={{
  margin: "-180px auto 120px auto",  // top right bottom left
  maxWidth: "420px",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}}>
{players
.sort((a, b) => (b.fatigue_score || 0) - (a.fatigue_score || 0))
.map((player, index) => (
<PlayerCard
key={player.player_id}
player={player}
index={index}
playerMLBIds={playerMLBIds}
onPlayerClick={onPlayerClick}
getPlayerImage={getPlayerImage}
/>
))}
</div>
</div>
);
};

export default RosterView;