# Road Charge France

A Flask web app game about planning an efficient electric-car trip across France.

## Game concept

You start from a random French city, point A, with a random electric car at 100% charge. Your goal is to reach point B. Point B is always farther than one full-charge range, so you must stop at charging stations.

Current level: Easy

- Car starts at 100% charge
- All charging stations are free
- Charging stations can be used instantly
- Objective: minimize total distance and recharge stops

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

## Structure

```text
app.py
api/new-game
game_data.py
templates/index.html
static/css/style.css
static/js/game.js
```

## Next gameplay upgrades

- Add charger power and charging time
- Add battery percentage between legs
- Add road-speed based travel time
- Add paid charging stations
- Add weather and traffic penalties
- Add medium/hard difficulty levels
