from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os

app = FastAPI(title="EnduraMetrics API")

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths to data and model
DATA_PATH = os.path.join("..", "data", "endurametrics_clean.csv")
MODEL_PATH = os.path.join("..", "data", "digital_twin_model.pkl")

# Global variables to hold data and model in memory
df = None
model = None

@app.on_event("startup")
def load_assets():
    global df, model
    print("Starting EnduraMetrics API...")
    
    try:
        df = pd.read_csv(DATA_PATH)
        print(f"Dataset loaded: {len(df)} rows.")
    except Exception as e:
        print(f"Warning: Could not load dataset at {DATA_PATH}. {e}")

    try:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        print("Digital Twin Model loaded successfully.")
    except Exception as e:
        print(f"Warning: Could not load model at {MODEL_PATH}. {e}")

# --- Pydantic Models for Input Validation ---
class SimulationRequest(BaseModel):
    Req_Ld_kg: float
    Spd_kph: float
    Step: int

# --- API Endpoints ---

@app.get("/")
def health_check():
    return {"status": "active", "service": "EnduraMetrics API"}

@app.post("/api/simulate")
def simulate_twin(request: SimulationRequest):
    """
    Takes requested load, speed, and step, and returns predicted deflection and temperatures.
    """
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded.")
    
    # Format input for the model
    input_data = pd.DataFrame([{
        'Req_Ld_kg': request.Req_Ld_kg,
        'Spd_kph': request.Spd_kph,
        'Step': request.Step
    }])
    
    # Make prediction
    prediction = model.predict(input_data)[0]
    
    return {
        "predicted_deflection_mm": round(prediction[0], 2),
        "predicted_Ir_A_C": round(prediction[1], 2),
        "predicted_Ir_B_C": round(prediction[2], 2),
        "predicted_Ir_C_C": round(prediction[3], 2),
    }

@app.get("/api/stream/{row_index}")
def stream_data(row_index: int):
    """
    Returns a specific row of data to simulate a live real-time sensor stream.
    """
    if df is None:
        raise HTTPException(status_code=500, detail="Dataset not loaded.")
    
    if row_index < 0 or row_index >= len(df):
        raise HTTPException(status_code=404, detail="Row index out of bounds.")
    
    row_data = df.iloc[row_index].to_dict()
    return {"index": row_index, "data": row_data}