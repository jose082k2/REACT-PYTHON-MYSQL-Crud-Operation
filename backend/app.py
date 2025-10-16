from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

# MySQL config
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'react_python_crud'

mysql = MySQL(app)

@app.route('/')
def home():
    return "Flask backend is running!"

# Get all users
@app.route('/users', methods=['GET'])
def get_users():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()  
    cursor.close()
    return jsonify(users)

#  new user
@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    age = data.get('age')
    cursor = mysql.connection.cursor()
    cursor.execute(
        "INSERT INTO users(name,email,age) VALUES(%s,%s,%s)",
        (name,email,age)
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message":"User added successfully"})

# Update
@app.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    age = data.get('age')
    cursor = mysql.connection.cursor()
    cursor.execute(
        "UPDATE users SET name=%s,email=%s,age=%s WHERE id=%s",
        (name,email,age,id)
    )
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message":"User updated successfully"})

# Delete
@app.route('/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    cursor = mysql.connection.cursor()
    cursor.execute("DELETE FROM users WHERE id=%s", (id,))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message":"User deleted successfully"})

if __name__ == "__main__":
    app.run(debug=True)
