# Create virtual environment if it doesn't exist
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..."
    python3 -m venv .venv
}

# Define path to python executable in venv
$python = "./.venv/bin/python"

# Install requirements using venv python
Write-Host "Installing requirements..."
& $python -m pip install -r requirements.txt

# Run the server using venv python
Write-Host "Starting server..."
& $python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
