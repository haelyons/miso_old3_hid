# Breadcrumbs Pseudocode

## Core Functions

### Path Analysis
`build_breadcrumb_trail(current_path)` - Parse the current snippet path and construct an array of breadcrumb segments, each containing title and navigation path.

`extract_snippet_titles(path_segments)` - For each path segment, load the corresponding snippet and extract its title for display in breadcrumbs.

### Breadcrumb Rendering
`render_breadcrumbs(trail_array)` - Generate HTML for the breadcrumb navigation, with clickable links for all segments except the current one.

`style_breadcrumb_separators()` - Add visual separators (>) between breadcrumb segments with appropriate spacing and styling.

### Navigation Handling
`handle_breadcrumb_click(target_path)` - When user clicks a breadcrumb segment, navigate to that snippet level and update both content and child views.

`update_breadcrumbs_on_navigation()` - Rebuild and re-render breadcrumbs whenever the user navigates to a new snippet.

## Data Flow

1. User navigates to a snippet (e.g., "miso/agents/workflow.md")
2. System parses path into segments: ["miso.md", "miso/agents.md", "miso/agents/workflow.md"]
3. System loads each segment's snippet to extract titles: ["miso", "agents", "workflow"]
4. System renders breadcrumbs: "miso > agents > workflow" (first two clickable, last is current)
5. User clicks "miso" → navigate to root and update breadcrumbs to just "miso"
6. User clicks "agents" → navigate to agents level and update breadcrumbs to "miso > agents"

## Integration Points
- Replace existing back button navigation in content view
- Breadcrumbs appear above main content, below any error messages
- Must work on both desktop and mobile layouts
- Should integrate with existing navigation state management