# backend/ml_injury/training_pipeline/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import your ML functions
from flag_injury_risks import run_inference_on_csv

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict_injury_risk():
    try:
        data = request.get_json()
        csv_path = data.get('csv_path')
        top_k_ratio = data.get('top_k_ratio', 0.10)
        start_date = data.get('start_date', '2024-04-01')
        
        if not csv_path:
            return jsonify({'error': 'csv_path is required'}), 400
        
        # Check if file exists
        if not os.path.exists(csv_path):
            return jsonify({'error': f'CSV file not found: {csv_path}'}), 404
        
        # Run inference
        result_df = run_inference_on_csv(csv_path, top_k_ratio, start_date)
        
        # Convert to dict format
        results = result_df.to_dict(orient='records')
        
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        print(f"Error in predict_injury_risk: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(port=5002, debug=True)