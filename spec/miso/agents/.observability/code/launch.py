#!/usr/bin/env python3
"""
Launch script to start both Flask editor and Playwright monitoring
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def install_playwright():
    """Install Playwright and browser dependencies"""
    print("Installing Playwright...")
    subprocess.run([sys.executable, "-m", "pip", "install", "playwright==1.40.0"])
    subprocess.run([sys.executable, "-m", "playwright", "install"])

def start_flask_server():
    """Start the Flask editor server"""
    flask_path = Path("../../.editor/code/app.py")
    if not flask_path.exists():
        print(f"Flask app not found at {flask_path}")
        print(f"Current directory: {Path.cwd()}")
        print(f"Looking for: {flask_path.resolve()}")
        # Try alternative path
        alt_path = Path("../../../../spec/miso/.editor/code/app.py")
        if alt_path.exists():
            flask_path = alt_path
            print(f"Found Flask app at alternative path: {flask_path}")
        else:
            return None
    
    print("Starting Flask server...")
    # Change to the miso root directory for relative imports
    root_dir = Path("../../../../../").resolve()
    flask_process = subprocess.Popen([
        sys.executable, str(flask_path.resolve())
    ], cwd=root_dir)
    
    # Give Flask time to start
    time.sleep(3)
    return flask_process

def start_monitoring():
    """Start Playwright monitoring"""
    print("Starting browser monitoring...")
    monitor_process = subprocess.Popen([
        sys.executable, "monitor.py"
    ])
    
    return monitor_process

def main():
    """Main launch function"""
    print("=== Miso Editor with Observability ===")
    
    # Check if Playwright is installed
    try:
        import playwright
    except ImportError:
        install_playwright()
    
    # Start Flask server
    flask_process = start_flask_server()
    if not flask_process:
        print("Failed to start Flask server")
        return
    
    # Start monitoring
    monitor_process = start_monitoring()
    
    print("\n✅ Both Flask editor and Playwright monitor are running!")
    print("📱 Editor available at: http://localhost:5000")
    print("👁️  Monitoring logs in: logs/ directory")
    print("🔗 Agent endpoints:")
    print("   - http://localhost:5000/api/monitor/screenshot")
    print("   - http://localhost:5000/api/monitor/state") 
    print("   - http://localhost:5000/api/monitor/logs")
    print("   - http://localhost:5000/api/monitor/console")
    print("\n🛑 Press Ctrl+C to stop both services")
    
    try:
        # Wait for processes
        flask_process.wait()
        monitor_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down...")
        flask_process.terminate()
        monitor_process.terminate()
        print("✅ Services stopped")

if __name__ == "__main__":
    main()