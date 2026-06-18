from flask import Flask, jsonify, render_template

from game_data import create_game

app = Flask(__name__)


@app.get('/')
def index():
    return render_template('index.html')


@app.get('/api/new-game')
def new_game():
    return jsonify(create_game())


if __name__ == '__main__':
    app.run(debug=True)
