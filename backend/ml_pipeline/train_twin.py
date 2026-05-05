import pandas as pd
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

def train_digital_twin():
    # Define paths relative to the backend folder
    data_path = os.path.join("..", "data", "endurametrics_clean.csv")
    model_path = os.path.join("..", "data", "digital_twin_model.pkl")

    print("Loading clean data...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Could not find {data_path}. Ensure you run this from the /backend directory.")
        return

    # Features (Inputs): What the engineer controls in the simulation
    X = df[['Req_Ld_kg', 'Spd_kph', 'Step']]
    
    # Targets (Outputs): What the simulation predicts
    y = df[['Defl_mm', 'Ir_A_C', 'Ir_B_C', 'Ir_C_C']]

    print("Splitting data into training and testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training the Digital Twin (Random Forest Regressor)...")
    # We use a Random Forest as it handles non-linear mechanical relationships very well
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    score = model.score(X_test, y_test)
    print(f"Model Training Complete! Accuracy (R^2 Score): {score:.4f}")

    print("Saving the model artifact...")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    print(f"Success! Model successfully saved to {model_path}")

if __name__ == "__main__":
    train_digital_twin()