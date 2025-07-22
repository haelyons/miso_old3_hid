# tests
*validation of breadcrumb navigation functionality*

## Core Functionality Tests
- Root snippet shows single "miso" breadcrumb with no separators or links
- Second level shows "miso > agents" with clickable "miso" and current "agents"  
- Deep nesting creates proper trail like "miso > agents > workflow" with correct clickability
- Path parsing correctly builds intermediate paths (miso.md, miso/agents.md, etc.)

## Title Fetching Tests
- API success displays actual snippet titles instead of filenames in breadcrumbs
- API failure gracefully falls back to filename without .md extension
- Mixed API results show combination of titles and filename fallbacks

## Navigation Tests  
- Clicking breadcrumb segments navigates to correct snippet path
- Current (last) breadcrumb segment is not clickable and has no handler
- Event delegation handles all breadcrumb clicks through single document listener

## Integration Tests
- Breadcrumbs automatically rebuild and re-render when navigating between snippets
- Breadcrumbs replace old back button navigation completely
- Breadcrumbs appear above content with proper DOM positioning

## Mobile Tests
- Mobile viewport applies smaller font and tighter spacing via CSS media queries  
- Long paths remain readable and functional on narrow screens
- Touch events work identical to desktop clicks for navigation

## Error Handling Tests
- Complete network failure still renders breadcrumbs with filename fallbacks
- Invalid or empty paths handle gracefully without JavaScript errors