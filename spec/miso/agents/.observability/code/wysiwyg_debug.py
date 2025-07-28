#!/usr/bin/env python3
"""
Focused console monitor for WYSIWYG bullet list debugging
"""
import asyncio
from playwright.async_api import async_playwright
import json
import time

async def debug_wysiwyg_bullets():
    """Monitor WYSIWYG editor specifically for bullet list conversion debugging"""
    
    playwright = await async_playwright().start()
    
    try:
        # Launch browser with stable options
        browser = await playwright.chromium.launch(
            headless=False,
            args=['--no-sandbox', '--disable-web-security', '--disable-features=VizDisplayCompositor']
        )
        
        context = await browser.new_context(
            viewport={"width": 1400, "height": 900},
            ignore_https_errors=True
        )
        
        page = await context.new_page()
        
        print("🔍 WYSIWYG Bullet List Debug Monitor")
        print("=" * 50)
        
        # Console message handler with filtering for our debug messages
        def handle_console(msg):
            text = msg.text
            # Only show our debug messages and errors
            if any(keyword in text for keyword in ['HTML TO MARKDOWN', 'Converting bullet', 'Before bullet cleanup', 'Final markdown']):
                print(f"🐛 {text}")
            elif msg.type == 'error':
                print(f"❌ ERROR: {text}")
        
        page.on("console", handle_console)
        
        # Navigate to editor
        print("🌐 Connecting to http://localhost:5000...")
        await page.goto("http://localhost:5000", timeout=15000)
        await page.wait_for_load_state("networkidle", timeout=15000)
        
        print("✅ Connected to miso editor")
        print("\n📝 Instructions:")
        print("1. Navigate to any snippet and click 'Edit'")
        print("2. Create some consecutive bullet items by typing '- item 1', '- item 2', etc.")
        print("3. Click 'Save' to see the HTML->Markdown conversion debug output")
        print("4. Console output will appear above")
        print("\n🛑 Press Ctrl+C to stop monitoring\n")
        
        # Keep monitoring
        try:
            while True:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping monitor...")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        
    finally:
        # Clean shutdown
        try:
            await browser.close()
            await playwright.stop()
        except:
            pass
        print("✅ Monitor stopped")

if __name__ == "__main__":
    asyncio.run(debug_wysiwyg_bullets())