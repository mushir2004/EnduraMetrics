from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
import io

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

@app.post("/api/audit")
async def audit_file(file: UploadFile = File(...)):
    """
    Accepts an Excel file upload, runs basic compliance checks, and returns a JSON report.
    """
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel or CSV file.")

    try:
        # Read the file directly from memory
        contents = await file.read()
        
        # Handle the specific formatting of our EnduraMetrics datasets
        if file.filename.endswith('.csv'):
             df_audit = pd.read_csv(io.BytesIO(contents))
        else:
             df_audit = pd.read_excel(io.BytesIO(contents), sheet_name='Sheet1', header=None, skiprows=2)
             
             # Apply the known column names
             col_names = [
                "Date", "Time", "Step", "Temp_C", "Dist_km", "Rad_cm", "Spd_kph", 
                "Req_Ld_kg", "Act_Ld_kg", "Req_Inf_psi", "Act_Inf_psi", 
                "Camb_deg", "Defl_mm", "Tire_Spd_rpm", "CAT_C", "Ir_A_C", 
                "Ir_B_C", "Ir_C_C", "Explanations"
             ]
             df_audit = df_audit.iloc[:, :19]
             df_audit.columns = col_names
             
             for col in df_audit.columns[3:18]:
                 df_audit[col] = pd.to_numeric(df_audit[col], errors='coerce')

        # Run Compliance Checks
        avg_speed = df_audit['Spd_kph'].mean()
        max_load = df_audit['Act_Ld_kg'].max()
        max_temp = df_audit[['Ir_A_C', 'Ir_B_C', 'Ir_C_C']].max().max()
        
        # Determine Pass/Fail based on simple dummy criteria
        passed = bool(avg_speed >= 70 and max_load >= 4000)

        return {
            "filename": file.filename,
            "status": "PASS" if passed else "FAIL",
            "metrics": {
                "total_rows_analyzed": len(df_audit),
                "average_speed_kph": round(avg_speed, 2),
                "maximum_load_achieved_kg": float(max_load),
                "peak_surface_temp_C": float(max_temp)
            },
            "notes": "Test met all standard endurance parameters." if passed else "Warning: Target load or speed was not maintained."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")