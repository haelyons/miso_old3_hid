from playwright.async_api import async_playwright
import asyncio
import json
from datetime import datetime
from pathlib import Path
import os

class BrowserMonitor:
    def __init__(self, flask_url="http://localhost:5000", output_dir="logs"):
        self.flask_url = flask_url
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.output_dir / "screenshots").mkdir(exist_ok=True)
        (self.output_dir / "states").mkdir(exist_ok=True)
        
        self.browser = None
        self.context = None
        self.page = None
        self.monitoring = False
        
        # Log files
        self.interaction_log = self.output_dir / "interactions.jsonl"
        self.network_log = self.output_dir / "network.jsonl"
        self.console_log = self.output_dir / "console.jsonl"
    
    async def launch_browser(self, headless=False):
        """Launch browser and navigate to Flask editor"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=headless,
            args=['--no-sandbox', '--disable-web-security']  # More stable browser launch
        )
        self.context = await self.browser.new_context(
            viewport={"width": 1200, "height": 800},
            ignore_https_errors=True
        )
        
        self.page = await self.context.new_page()
        
        # Setup event listeners
        self.page.on("console", self._handle_console)
        self.page.on("request", self._handle_request)
        self.page.on("response", self._handle_response)
        
        try:
            # Navigate to Flask app with timeout
            await self.page.goto(self.flask_url, timeout=10000)
            await self.page.wait_for_load_state("networkidle", timeout=10000)
            print(f"✅ Browser launched and navigated to {self.flask_url}")
        except Exception as e:
            print(f"⚠️  Navigation warning: {e}")
            print(f"Browser still available at {self.flask_url}")
        
        return self.page
    
    async def take_screenshot(self, name=None):
        """Capture full page screenshot"""
        if not self.page:
            return None
            
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        filename = f"{name}_{timestamp}.png" if name else f"{timestamp}.png"
        screenshot_path = self.output_dir / "screenshots" / filename
        
        await self.page.screenshot(path=screenshot_path, full_page=True)
        
        # Create/update latest.png symlink
        latest_path = self.output_dir / "screenshots" / "latest.png"
        if latest_path.exists():
            latest_path.unlink()
        latest_path.symlink_to(filename)
        
        return screenshot_path
    
    async def capture_page_state(self):
        """Extract comprehensive page state"""
        if not self.page:
            return None
        
        state = {
            "timestamp": datetime.now().isoformat(),
            "url": self.page.url,
            "title": await self.page.title(),
            "viewport": await self.page.viewport_size(),
            "current_snippet": await self.page.evaluate("() => window.editor ? window.editor.currentPath : ''"),
        }
        
        # Save state
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        state_file = self.output_dir / "states" / f"{timestamp}.json"
        with open(state_file, 'w') as f:
            json.dump(state, f, indent=2)
        
        # Create/update latest.json symlink
        latest_path = self.output_dir / "states" / "latest.json"
        if latest_path.exists():
            latest_path.unlink()
        latest_path.symlink_to(f"{timestamp}.json")
        
        return state
    
    async def monitor_continuously(self, interval=3):
        """Run continuous monitoring loop"""
        self.monitoring = True
        print(f"Starting continuous monitoring (interval: {interval}s)")
        
        while self.monitoring:
            try:
                # Capture state and screenshot
                await self.capture_page_state()
                await self.take_screenshot("auto")
                
                await asyncio.sleep(interval)
                
            except Exception as e:
                print(f"Monitoring error: {e}")
                await asyncio.sleep(interval)
    
    def _handle_console(self, msg):
        """Log console messages"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "type": msg.type,
            "text": msg.text,
            "location": f"{msg.location.get('url', '')}:{msg.location.get('lineNumber', '')}"
        }
        
        with open(self.console_log, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    
    def _handle_request(self, request):
        """Log network requests"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "type": "request",
            "method": request.method,
            "url": request.url,
            "headers": dict(request.headers)
        }
        
        with open(self.network_log, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    
    def _handle_response(self, response):
        """Log network responses"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "type": "response",
            "status": response.status,
            "url": response.url,
            "headers": dict(response.headers)
        }
        
        with open(self.network_log, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    
    def _handle_click(self, event_data):
        """Log click interactions"""
        # This is a simplified version - Playwright's click event handling is complex
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "type": "click",
            "url": self.page.url if self.page else "unknown"
        }
        
        with open(self.interaction_log, 'a') as f:
            f.write(json.dumps(log_entry) + '\n')
    
    async def cleanup(self):
        """Clean up browser resources"""
        self.monitoring = False
        try:
            if self.page:
                await self.page.close()
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if hasattr(self, 'playwright') and self.playwright:
                await self.playwright.stop()
        except Exception as e:
            print(f"Cleanup warning: {e}")
        print("Browser monitor cleaned up")

async def main():
    """Main monitoring function"""
    monitor = BrowserMonitor()
    
    try:
        # Launch browser
        await monitor.launch_browser(headless=False)
        
        # Take initial screenshot
        await monitor.take_screenshot("initial")
        await monitor.capture_page_state()
        
        # Start continuous monitoring
        await monitor.monitor_continuously(interval=3)
        
    except KeyboardInterrupt:
        print("\nStopping monitoring...")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await monitor.cleanup()

if __name__ == "__main__":
    asyncio.run(main())