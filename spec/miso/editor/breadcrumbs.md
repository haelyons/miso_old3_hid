# breadcrumbs
*clickable navigation trail showing the path from root to current snippet*

Instead of a simple "back" button, breadcrumbs provide context and flexible navigation by showing the full path from the root snippet to the current location.

Breadcrumbs appear as a horizontal trail at the top of the content view: `miso > agents > workflow` where each segment is clickable and navigates directly to that level.

**Benefits over back button:**
- Shows full context of where you are in the snippet tree
- Allows jumping directly to any parent level, not just immediate parent
- Takes minimal visual space while providing maximum navigation utility
- Familiar UX pattern users expect in hierarchical interfaces

**Visual Design:**
- Appears above the main content in the content view
- Uses `>` or `/` separators between clickable segment titles
- Current snippet is not clickable (end of trail)
- Subtle styling that doesn't compete with main content