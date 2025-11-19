# Python ML environment
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install build dependencies needed for packages like scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt first for caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all Python code
COPY . .

# Expose port for Flask
EXPOSE 5002

# Start ML API
CMD ["python", "app.py"]