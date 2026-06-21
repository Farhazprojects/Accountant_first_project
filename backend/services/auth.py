from flask import Flask, jsonify, request
import jwt

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'

def generate_jwt(user_id):
    return jwt.encode({
        'user_id': user_id,
        'role': 'admin'
    }, app.config['SECRET_KEY'], algorithm='HS256')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if email == 'admin@example.com' and password == 'admin123':
        token = generate_jwt(1)
        return jsonify(access_token=token)
    return jsonify(error='Invalid credentials'), 401