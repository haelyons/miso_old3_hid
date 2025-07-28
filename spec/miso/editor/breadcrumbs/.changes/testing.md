# testing changes feature

**Changes Page Requirements:**
- /~recent URL displays recent changes page instead of root redirect
- Recent changes page shows list of recently modified snippets
- Each item uses horizontal child-view format (title and summary on same line)
- Modification date appears after summary or on separate line
- Items are sorted by modification date (newest first)
- Only shows feature specification files, not metafolder implementation files

**Recent Link Requirements:**
- Recent link appears on the right side of breadcrumbs bar
- Link text displays as "(recent)" in subtle styling
- Link is positioned with appropriate spacing from breadcrumb trail
- Link does NOT appear on the recent changes page itself
- Clicking recent link navigates to /~recent URL

**Navigation Integration:**
- Root URL (/) redirects to /miso to show main specification
- Clicking any item in changes list navigates to that snippet's URL
- Recent link works with browser back/forward buttons
- URL updates correctly when recent link is clicked
- All navigation maintains consistent scroll-to-top behavior

**Visual Styling:**
- Recent link uses subtle color (lighter than breadcrumb text)
- Link has hover effect to indicate clickability
- Typography is smaller or less prominent than main breadcrumbs
- Overall breadcrumbs bar maintains clean, uncluttered appearance
- Changes page maintains existing child-item styling

**Error Handling:**
- Handles snippets with missing titles gracefully
- Handles file system access errors
- Falls back to basic display if timestamp unavailable
- Graceful fallback if changes API fails