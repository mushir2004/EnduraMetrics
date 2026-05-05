import pandas as pd
import os

def clean_and_extract_data(input_filename, output_filename):
    print(f"Loading raw dataset: {input_filename}...")
    
    # Define the relative paths from the perspective of the backend folder
    input_path = os.path.join("..", "data", input_filename)
    output_path = os.path.join("..", "data", output_filename)
    
    try:
        # Read the Excel file, skipping the unit rows
        df = pd.read_excel(input_path, sheet_name='Sheet1', header=None, skiprows=2)
        
        # Define exact column names based on our previous analysis
        col_names = [
            "Date", "Time", "Step", "Temp_C", "Dist_km", "Rad_cm", "Spd_kph", 
            "Req_Ld_kg", "Act_Ld_kg", "Req_Inf_psi", "Act_Inf_psi", 
            "Camb_deg", "Defl_mm", "Tire_Spd_rpm", "CAT_C", "Ir_A_C", 
            "Ir_B_C", "Ir_C_C", "Explanations"
        ]
        
        # Keep only the relevant 19 columns
        df = df.iloc[:, :19]
        df.columns = col_names
        
        print("Cleaning data types...")
        # Convert measurement columns to numeric, coercing any errors to NaN
        for col in df.columns[3:18]:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
        # Drop rows where critical sensor data is missing
        df = df.dropna(subset=['Defl_mm', 'Ir_A_C'])
        
        # Drop the 'Explanations' text column as it's not needed for the ML model
        df_ml = df.drop(columns=['Explanations'])
        
        # Save the clean dataframe to a CSV for fast loading during training
        df_ml.to_csv(output_path, index=False)
        print(f"Success! Clean data saved to: {output_path}")
        print(f"Total processed rows ready for ML: {len(df_ml)}")

    except Exception as e:
        print(f"Error processing data: {e}")

if __name__ == "__main__":
    # Ensure this script is run from the /backend directory
    clean_and_extract_data("AGING TYRE RFID_2.xlsx", "endurametrics_clean.csv")