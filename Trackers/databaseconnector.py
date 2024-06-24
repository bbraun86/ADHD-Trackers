import mysql.connector
from mysql.connector import Error
from flask import Flask, request, jsonify

app = Flask(__name__)

def insert_tracker_data(data):
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='heart_tracker',
            user='heart_tracker_user',
            password='89!jklFz3Wre'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            sql_insert_query = """INSERT INTO tracker_data (data) VALUES (%s)"""
            cursor.execute(sql_insert_query, (data,))
            connection.commit()
            print("Record inserted successfully into tracker_data table")

    except Error as e:
        print("Failed to insert record into MySQL table", e)
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

@app.route('/saveData', methods=['POST'])
def save_data():
    data = request.json
    try:
        insert_tracker_data(data)
        return jsonify({"message": "Data saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/getData', methods=['GET'])
def get_data():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='heart_tracker',
            user='heart_tracker_user',
            password='89!jklFz3Wre'
        )
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tracker_data ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        if row:
            return jsonify(row), 200
        else:
            return jsonify({"error": "No data found"}), 404
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
