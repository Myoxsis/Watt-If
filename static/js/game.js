const franceBounds = [[41.0, -5.8], [51.6, 9.8]];
let map;
let game;
let selectedStations = [];
let markers = [];
let routeLine;

const $ = (id) => document.getElementById(id);

function distanceKm(a, b) {
  const radius = 6371;
  const toRad = (v) => (v * Math.PI) / 180;
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const dlat = toRad(b.lat - a.lat);
  const dlng = toRad(b.lng - a.lng);
  const h = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng / 2) ** 2;
  return Math.round(2 * radius * Math.asin(Math.sqrt(h)) * 10) / 10;
}

function makeIcon(label, className) {
  return L.divIcon({
    html: `<div class="${className}">${label}</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function points() {
  return [game.start, ...selectedStations, game.end];
}

function legStatus(a, b) {
  const d = distanceKm(a, b);
  return { distance: d, valid: d <= game.car.range_km };
}

function totalDistance() {
  const route = points();
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) total += distanceKm(route[i], route[i + 1]);
  return Math.round(total * 10) / 10;
}

function isRouteValid() {
  const route = points();
  for (let i = 0; i < route.length - 1; i++) {
    if (!legStatus(route[i], route[i + 1]).valid) return false;
  }
  return true;
}

function clearMap() {
  markers.forEach((m) => map.removeLayer(m));
  markers = [];
  if (routeLine) map.removeLayer(routeLine);
}

function addMarker(location, label, className, onClick) {
  const marker = L.marker([location.lat, location.lng], { icon: makeIcon(label, className) })
    .addTo(map)
    .bindTooltip(location.name, { direction: 'top' });
  if (onClick) marker.on('click', onClick);
  markers.push(marker);
}

function renderMap() {
  clearMap();
  addMarker(game.start, 'A', 'marker-start');
  addMarker(game.end, 'B', 'marker-end');

  game.stations.forEach((station) => {
    const selected = selectedStations.some((item) => item.id === station.id);
    addMarker(station, '⚡', selected ? 'marker-station marker-selected' : 'marker-station', () => {
      if (!selectedStations.some((item) => item.id === station.id)) selectedStations.push(station);
      render();
    });
  });

  routeLine = L.polyline(points().map((p) => [p.lat, p.lng]), {
    color: isRouteValid() ? '#5cff9d' : '#ff5d73',
    weight: 5,
    opacity: 0.85,
    dashArray: isRouteValid() ? null : '10 10',
  }).addTo(map);

  map.fitBounds(franceBounds, { padding: [24, 24] });
}

function renderRouteList() {
  const list = $('routeList');
  list.innerHTML = '';
  const route = points();
  route.forEach((point, index) => {
    const li = document.createElement('li');
    const next = route[index + 1];
    let detail = '';
    if (next) {
      const leg = legStatus(point, next);
      detail = `<small>${leg.distance} km to next ${leg.valid ? '✅' : '❌ exceeds range'}</small>`;
    }
    li.innerHTML = `<strong>${index === 0 ? 'A' : index === route.length - 1 ? 'B' : 'Stop'} · ${point.name}</strong>${detail}`;
    list.appendChild(li);
  });
}

function renderHints() {
  const hints = $('hints');
  hints.innerHTML = '';
  if (!game.hints.length) {
    hints.textContent = 'No one-stop solution. Try several stops.';
    return;
  }
  game.hints.forEach((hint) => {
    const div = document.createElement('div');
    div.className = 'hint';
    div.innerHTML = `<strong>${hint.station.name}</strong><small>${hint.legToStationKm} km then ${hint.legToEndKm} km · ${hint.totalKm} km total</small>`;
    hints.appendChild(div);
  });
}

function scoreRoute() {
  if (!isRouteValid()) return { value: '-', text: 'Invalid route: at least one leg is beyond your car range.' };
  const extraKm = Math.max(0, totalDistance() - game.directDistanceKm);
  const stopPenalty = selectedStations.length * 12;
  const efficiencyPenalty = Math.round((extraKm / game.directDistanceKm) * 100);
  const score = Math.max(0, 100 - stopPenalty - efficiencyPenalty);
  return { value: score, text: `${selectedStations.length} recharge stop(s), ${Math.round(extraKm)} km extra versus direct distance.` };
}

function render() {
  $('carName').textContent = game.car.name;
  $('carRange').textContent = game.car.range_km;
  $('battery').textContent = game.car.battery_kwh;
  $('startName').textContent = game.start.name;
  $('endName').textContent = game.end.name;
  $('directDistance').textContent = `${game.directDistanceKm} km`;
  $('routeDistance').textContent = `${totalDistance()} km`;
  $('stopCount').textContent = selectedStations.length;
  $('routeStatus').textContent = isRouteValid() ? 'Valid so far' : 'Leg too long';

  renderMap();
  renderRouteList();
  renderHints();

  const score = scoreRoute();
  $('scoreValue').textContent = score.value;
  $('scoreText').textContent = score.text;
}

async function newGame() {
  const response = await fetch('/api/new-game');
  game = await response.json();
  selectedStations = [];
  render();
}

function initMap() {
  map = L.map('map', { zoomControl: false });
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  map.fitBounds(franceBounds);
}

$('newGameBtn').addEventListener('click', newGame);
$('undoBtn').addEventListener('click', () => { selectedStations.pop(); render(); });
$('finishBtn').addEventListener('click', () => {
  const score = scoreRoute();
  if (score.value === '-') alert(score.text);
  else alert(`Route finished! Score: ${score.value}/100\n${score.text}`);
});

initMap();
newGame();
