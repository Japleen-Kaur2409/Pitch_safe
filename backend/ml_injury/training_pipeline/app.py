# backend/ml_injury/training_pipeline/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Import your ML functions
from flag_injury_risks import run_inference_on_csv

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict_injury_risk():
    try:
        print("=== /predict endpoint called ===", file=sys.stderr, flush=True)
        data = request.get_json()
        print(f"Request data: {data}", file=sys.stderr, flush=True)
        
        csv_path = data.get('csv_path')
        top_k_ratio = data.get('top_k_ratio', 0.10)
        start_date = data.get('start_date', '2024-04-01')
        
        print(f"CSV path: {csv_path}", file=sys.stderr, flush=True)
        
        if not csv_path:
            return jsonify({'error': 'csv_path is required'}), 400
        
        # Check if file exists
        if not os.path.exists(csv_path):
            print(f"File not found: {csv_path}", file=sys.stderr, flush=True)
            return jsonify({'error': f'CSV file not found: {csv_path}'}), 404
        
        print(f"File found, running inference...", file=sys.stderr, flush=True)
        # Run inference
        result_df = run_inference_on_csv(csv_path, top_k_ratio, start_date)
        
        print(f"Inference complete, converting to dict...", file=sys.stderr, flush=True)
        # Convert to dict format
        results = result_df.to_dict(orient='records')
        
        print(f"Returning {len(results)} results", file=sys.stderr, flush=True)
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        print(f"Error in predict_injury_risk: {str(e)}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)