# Import necessary libraries
from flask import Flask, request, jsonify
import pickle
from flask_cors import CORS

import re
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from string import punctuation
from sklearn.feature_extraction.text import TfidfVectorizer
lemma = WordNetLemmatizer()

## Data Preprocessing
def DataPrep(text) : 
    text = re.sub('<.*?>', '', text)
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'@\S+', '', text)
    text = re.sub(r'#\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    tokens = nltk.word_tokenize(text) 
    
    #remove puncs
    punc = list(punctuation) 
    words = [w for w in tokens if w not in punc]
    
    #remove stop words
    stop_words = set(stopwords.words('english'))
    words = [w.lower() for w in words if not w.lower() in stop_words]
    
    # lemmatization 
    words = [lemma.lemmatize(w) for w in words] 
    
    text = ' '.join(words) 
    
    return text

# Load your saved model
with open('bully_detection_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load the TF-IDF vectorizer used during model training
with open('tfidf_vectorizer.pkl', 'rb') as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

# Create a Flask app
app = Flask(__name__)

CORS(app)

# Define an endpoint for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Get the text message from the request
    data = request.get_json()
    message = data['message']
    print(message)
    # Preprocess the message (implement your DataPrep function)
    preprocessed_message = DataPrep(message)

    # Vectorize the preprocessed message using the loaded vectorizer
    message_vector = vectorizer.transform([preprocessed_message])

    # Use your model to make a prediction
    prediction = model.predict(message_vector)
    print(f"Prediction: {prediction[0]}")
    prediction = int(prediction[0])
    # Return the prediction as JSON response
    return jsonify({'prediction': prediction})

# Run the Flask app
if __name__ == '__main__':
    app.run()