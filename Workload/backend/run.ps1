# Create virtual environment if it doesn't exist
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..."
    python3 -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Venv module missing. Attempting to install dependencies (requires sudo)..."
        sh -c "sudo apt-get update && sudo apt-get install -y python3-venv python3-pip"
        python3 -m venv .venv
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to create virtual environment even after attempting install. Please install python3-venv manually."
            exit 1
        }
    }
}

# Define path to python executable in venv
$python = "./.venv/bin/python"

# Install requirements using venv python
Write-Host "Installing requirements..."
& $python -m pip install -r requirements.txt

# Run the server using venv python
Write-Host "Starting server..."
& $python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
