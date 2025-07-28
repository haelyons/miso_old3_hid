# pseudocode for changes feature

**Backend Functions:**

`get_all_snippet_files()` - Scan the spec/ directory recursively and return list of all .md files with their full paths, excluding metafolder files.

`get_file_modification_time(file_path)` - Get the last modified timestamp for a given file using filesystem metadata.

`extract_snippet_metadata(file_path)` - Read a snippet file and extract its title (first # line) and summary (first *italicized* line).

`build_recent_changes_list()` - Combine file scanning, timestamp extraction, and metadata parsing to create a sorted list of recently modified snippets.

**Frontend Functions:**

`detect_special_routes()` - Check if current URL is /~recent and show changes page, or redirect root to /miso.

`render_changes_page(changes_data)` - Create HTML for recent changes using existing child-item styling but with modification dates.

`render_breadcrumbs_with_recent_link()` - Modify breadcrumbs to include flexbox layout with recent link on right side.

`format_modification_date(timestamp)` - Convert timestamp to human-readable format like "2 days ago" or "July 28, 2025".

**Data Flow:**

1. User visits /~recent or clicks (recent) link
2. Frontend calls /api/changes endpoint
3. Backend scans all non-metafolder snippet files and gets modification times
4. Backend extracts title/summary from each file and sorts by modification date
5. Frontend renders changes page using child-item format with dates
6. Recent link appears in breadcrumbs on all other pages for easy access