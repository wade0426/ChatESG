from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    message = data['message']
    response = message + " hello"
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)