from flask import Flask

app = Flask(__name__)

# Import routes from API 1 and API 2 (assuming files are named 'api1.py' and 'api2.py')
from chatbot import routes as chatbot_routes
from bully_detection import routes as bully_detection_routes

# Register blueprints with prefixes for clarity
app.register_blueprint(
    chatbot_routes, url_prefix="/api/chatbot"
)  # Access API 1 routes like /chatbot/chat
app.register_blueprint(
    bully_detection_routes, url_prefix="/api/bully_detection"
)  # Access API 2 routes like /bully_detection/predict

if __name__ == "__main__":
    app.run(debug=True)
