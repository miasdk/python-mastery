import subprocess
import sys
import os

def run_backend():
    """Run the FastAPI backend server"""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    subprocess.run([sys.executable, "-m", "uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"])

if __name__ == "__main__":
    run_backend()
