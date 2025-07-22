# Observability Implementation Details

## Dependencies
```python
# requirements_observability.txt
playwright==1.40.0
asyncio
json
datetime
pathlib
```

## Core Monitoring Class
```python
from playwright.async_api import async_playwright
import asyncio
import json
from datetime import datetime
from pathlib import Path

class BrowserMonitor:
    def __init__(self, flask_url="http://localhost:5000", output_dir="logs"):
        self.flask_url = flask_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        self.browser = None
        self.page = None
        self.monitoring = False
    
    async def launch_browser(self, headless=False):
        # Launch browser and navigate to Flask editor
        # Enable request/response logging
        # Setup console message capture
    
    async def take_screenshot(self, name=None):
        # Capture full page screenshot with timestamp
        # Save to output directory for agent access
    
    async def capture_page_state(self):
        # Extract URL, title, DOM content, console logs
        # Return structured data for agent consumption
    
    async def monitor_continuously(self, interval=2):
        # Run monitoring loop every N seconds
        # Capture screenshots and state changes
        # Log user interactions and network activity
```

## Flask Integration
```python
# Add to existing Flask app
from flask import Flask, jsonify
import json
from datetime import datetime

@app.route('/api/monitor/screenshot')
def get_latest_screenshot():
    # Return path to most recent screenshot
    # Agent can use Read tool to view image
    
@app.route('/api/monitor/state')  
def get_browser_state():
    # Return current browser state as JSON
    # Includes URL, DOM snapshot, console logs
    
@app.route('/api/monitor/logs')
def get_interaction_logs():
    # Return recent user interaction history
    # Clicks, navigation, form inputs, etc.
    
@app.route('/api/monitor/network')
def get_network_activity():
    # Return recent network requests/responses
    # API calls, resource loading, errors
```

## Monitoring Script Structure
```python
# monitor.py - Main monitoring script
async def main():
    monitor = BrowserMonitor()
    
    # Launch browser and navigate to editor
    await monitor.launch_browser(headless=False)
    
    # Start continuous monitoring in background
    monitoring_task = asyncio.create_task(
        monitor.monitor_continuously(interval=2)
    )
    
    # Keep script running
    try:
        await monitoring_task
    except KeyboardInterrupt:
        await monitor.cleanup()

if __name__ == "__main__":
    asyncio.run(main())
```

## Output File Structure
```
logs/
├── screenshots/
│   ├── 2024-01-15_14-30-00.png
│   ├── 2024-01-15_14-30-02.png
│   └── latest.png (symlink)
├── states/
│   ├── 2024-01-15_14-30-00.json
│   └── latest.json (symlink)
├── interactions.jsonl
├── network.jsonl
└── console.jsonl
```

## Data Formats
```json
// Browser state format
{
    "timestamp": "2024-01-15T14:30:00Z",
    "url": "http://localhost:5000",
    "title": "Miso Editor",
    "dom_snapshot": "...",
    "viewport": {"width": 1200, "height": 800},
    "console_logs": [...],
    "network_requests": [...]
}

// Interaction log format
{
    "timestamp": "2024-01-15T14:30:00Z",
    "type": "click",
    "element": ".child-item",
    "coordinates": [120, 340],
    "snippet_path": "miso/editor.md"
}
```

## Integration Commands
```bash
# Install Playwright
pip install playwright
playwright install

# CRITICAL: Run Flask from miso root directory for correct path resolution
cd /path/to/miso
python spec/miso/.editor/code/app.py &

# Run monitoring from observability code directory
cd spec/miso/agents/.observability/code
python monitor.py &

# Agent can check latest state
curl http://localhost:5000/api/monitor/state
curl http://localhost:5000/api/monitor/screenshot
```

## Flask Integration Requirements
```python
# CRITICAL: Flask app.py must include these imports for observability endpoints
import json
from datetime import datetime
from pathlib import Path

# Must handle relative paths correctly when running from miso root
screenshot_dir = Path("spec/miso/agents/.observability/code/logs/screenshots")
state_dir = Path("spec/miso/agents/.observability/code/logs/states")
log_file = Path("spec/miso/agents/.observability/code/logs/interactions.jsonl")
```