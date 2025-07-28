#!/usr/bin/env python3
"""
Simple console monitor to capture debug output from WYSIWYG editor
"""
import asyncio
from playwright.async_api import async_playwright
import json

async def monitor_console():
    """Monitor browser console for WYSIWYG debug output"""
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=False)
    page = await browser.new_page()
    
    print("🔍 Starting console monitor...")
    print("Navigate to http://localhost:5000 and test the WYSIWYG editor")
    print("Console messages will appear below:")
    print("-" * 50)
    
    def handle_console(msg):
        if msg.type in ['log', 'info', 'warn', 'error']:
            print(f"[{msg.type.upper()}] {msg.text}")
    
    page.on("console", handle_console)
    
    # Navigate to the editor
    await page.goto("http://localhost:5000")
    await page.wait_for_load_state("networkidle")
    
    print("✅ Connected to editor. Test bullet items now...")
    
    # Keep the browser open and monitor console
    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping monitor...")
    finally:
        await browser.close()
        await playwright.stop()

if __name__ == "__main__":
    asyncio.run(monitor_console())