# Observability Pseudocode

## Overview
Use Playwright to provide complete browser visibility to agents, eliminating the need for users to manually relay what they see in the browser.

## Core Functions

### Browser Launch and Control

`launch_browser_monitor()` - Start Playwright, launch browser pointing to the Flask editor, begin monitoring session.

`capture_screenshot(timestamp)` - Take full-page screenshot and save with timestamp for agent analysis.

`extract_page_state()` - Get current URL, page title, DOM content, console logs, and network activity.

### Continuous Monitoring

`monitor_browser_activity()` - Run continuous loop that captures page state changes, user interactions, and console output.

`log_user_interactions()` - Track clicks, scrolls, navigation events, and form inputs.

`capture_console_output()` - Record JavaScript console.log, console.error, and other browser console activity.

`monitor_network_requests()` - Log all HTTP requests/responses, including API calls to Flask backend.

### Agent Integration

`create_monitoring_endpoints()` - Add Flask routes that agents can call to get current browser state, screenshots, or interaction logs.

`generate_status_report()` - Create comprehensive report of current browser state for agent consumption.

`save_session_recording()` - Record entire browser session as video for later analysis.

## Data Flow

1. Agent requests editor to be launched
2. Playwright launches browser and navigates to Flask editor
3. Continuous monitoring begins - screenshots, state capture, log collection
4. User interacts with editor (clicks, navigation, etc.)
5. All interactions and state changes are logged in real-time
6. Agent can query monitoring endpoints to get current state
7. Agent can request specific screenshots or session recordings
8. All data is structured for easy agent parsing and analysis

## Output Formats

Screenshots saved as timestamped PNG files that agents can read directly.
Browser state exported as JSON with URL, DOM snapshot, console logs, network activity.
Interaction logs as structured events with timestamps and element details.
Session recordings as MP4 files for comprehensive review.