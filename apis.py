import nltk

nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")
from flask import Flask, request, jsonify, Blueprint
import pickle
import random
import json
import re
import numpy as np
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from string import punctuation
from sklearn.feature_extraction.text import TfidfVectorizer
from keras.models import load_model
from flask_cors import CORS
import os

# ... (rest of the code remains unchanged)


lemma = WordNetLemmatizer()
combined_api = Blueprint("combined_api", __name__)
CORS(combined_api)

# Load your saved model for the bully detection API
with open("bully_detection_model.pkl", "rb") as model_file:
    bully_model = pickle.load(model_file)

# Load the TF-IDF vectorizer used during model training for the bully detection API
with open("tfidf_vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Load your chatbot-related data and model for the chatbot API
if os.path.exists("Chatbot data\intents.json"):
    # Load training data
    with open("Chatbot data\intents.json", "r") as f:
        intents = json.load(f)

    with open("Chatbot data\words.pkl", "rb") as f:
        words = pickle.load(f)

    with open("Chatbot data\classes.pkl", "rb") as f:
        classes = pickle.load(f)

    # Load pre-trained model
    chatbot_model = load_model("Chatbot data\chatbot_model.h5")


def DataPrep(text):
    text = re.sub("<.*?>", "", text)
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@\S+", "", text)
    text = re.sub(r"#\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    tokens = nltk.word_tokenize(text)

    # remove puncs
    punc = list(punctuation)
    words = [w for w in tokens if w not in punc]

    # remove stop words
    stop_words = set(stopwords.words("english"))
    words = [w.lower() for w in words if not w.lower() in stop_words]

    # lemmatization
    words = [lemma.lemmatize(w) for w in words]

    text = " ".join(words)

    return text


def predict_bully(message):
    preprocessed_message = DataPrep(message)
    message_vector = vectorizer.transform([preprocessed_message])
    prediction = bully_model.predict(message_vector)
    prediction = int(prediction[0])
    return prediction


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemma.lemmatize(word) for word in sentence_words]
    return sentence_words


def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)


def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = chatbot_model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list


def get_response(intents_list, intents_json):
    tag = intents_list[0]["intent"]
    list_of_intents = intents_json["intents"]
    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i["responses"])
            break
    return result


@combined_api.route("/predict", methods=["POST"])
def bully_detection_endpoint():
    data = request.get_json()
    message = data["message"]

    # Use the bully detection model to get a prediction
    bully_prediction = predict_bully(message)

    return jsonify({"bully_prediction": bully_prediction})


@combined_api.route("/chat", methods=["POST"])
def chatbot_endpoint():
    data = request.get_json()
    message = data["message"]

    # Use the chatbot to get a response
    chatbot_response_result = chatbot_response(message)

    return jsonify({"chatbot_response": chatbot_response_result})


def chatbot_response(message):
    ints = predict_class(message)

    if ints:
        # Check if ints is not empty
        res = get_response(ints, intents)
    else:
        # Handle the case where no intents were recognized
        res = "I'm sorry, I didn't understand your message."

    return res


def chatbot_response(message):
    ints = predict_class(message)

    if ints:
        # Check if ints is not empty
        res = get_response(ints, intents)
    else:
        # Handle the case where no intents were recognized
        res = "I'm sorry, I didn't understand your message."

    return res


# Initialize the Flask app and register the blueprint
app = Flask(__name__)
app.register_blueprint(combined_api)

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
