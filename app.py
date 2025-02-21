from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Путь к файлу с результатами
scores_file = 'scores.json'

# Функция для чтения результатов
def read_scores():
    if os.path.exists(scores_file):
        try:
            with open(scores_file, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {"maxScore": 0}
    return {"maxScore": 0}

# Функция для записи результата в файл
def write_score(score):
    data = read_scores()
    if score > data["maxScore"]:
        data["maxScore"] = score
        with open(scores_file, 'w') as f:
            json.dump(data, f)

@app.route('/')
def index():
    scores = read_scores()
    return render_template('index.html', max_score=scores["maxScore"])

@app.route('/save_score', methods=['POST'])
def save_score():
    score = request.json.get('score')
    write_score(score)
    return jsonify({"status": "success"}), 200

if __name__ == '__main__':
    app.run(debug=True)
