# Editor Pseudocode

## Overview
The editor is a web application with a Flask backend serving snippet data and a JavaScript frontend providing the two-column interface.

## Core Functions

### Backend Functions

`get_snippet_tree()` - Scan the spec/ directory and build a hierarchical representation of all snippets with their relationships.

`get_snippet_content(path)` - Read a specific markdown file and return its title, summary, and full content.

`get_snippet_children(path)` - Return list of child snippets for a given snippet path, including title and one-line summary for each.

`serve_static_files()` - Serve HTML, CSS, and JavaScript files for the web interface.

### Frontend Functions

`render_content_view(snippet_data)` - Display the selected snippet as rendered markdown in the left column.

`render_child_view(children_data)` - Display child snippets as clickable titles with summaries in the right column.

`handle_navigation(snippet_path)` - Load new snippet content and update both views when user clicks on a child or navigates up.

`navigate_to_parent()` - Calculate parent snippet path by removing last segment and adding .md extension.

`handle_mobile_gestures()` - Detect left/right swipes on mobile and show/hide child view accordingly.

`handle_column_resize()` - Allow users to drag the splitter between columns to resize them on desktop.

## Data Flow

1. User visits root URL
2. Server returns HTML page with JavaScript client
3. Client automatically requests "miso.md" snippet data via AJAX (default root snippet)
4. Server loads miso.md from spec/ directory and returns snippet data including children
5. Client renders content view with miso snippet and child view with its children (snippets, editor, agents)
6. User clicks child snippet → client requests new snippet data → views update
7. User navigates up → client requests parent snippet → views update

## Critical Implementation Details

`initialize_client()` - JavaScript must default to loading "miso.md" as the root snippet, not empty path
`resolve_snippet_paths()` - Flask server must correctly resolve paths relative to spec/ directory when running from miso root
`handle_empty_path_requests()` - Server should handle both empty path and "miso.md" requests to show root snippet