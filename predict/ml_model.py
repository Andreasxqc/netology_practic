import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'lib', 'model.pkl')

with open(MODEL_PATH, 'rb') as file:
    model = pickle.load(file)
