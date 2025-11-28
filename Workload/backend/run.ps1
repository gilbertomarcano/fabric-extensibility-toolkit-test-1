# Install requirements
python -m pip install -r requirements.txt

# Run the server
# reload=True allows auto-reload on code changes
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
