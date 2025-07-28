from flask import Flask, jsonify, render_template, send_from_directory, request
import os
import markdown
import re
import json
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

class SnippetLoader:
    def __init__(self, spec_root="spec"):
        self.spec_root = Path(spec_root)
    
    def scan_directory(self, path):
        """Walk directory tree and build hierarchical structure"""
        full_path = self.spec_root / path if path != "." else self.spec_root
        if not full_path.exists():
            return []
        
        children = []
        for item in full_path.iterdir():
            if item.is_file() and item.suffix == '.md':
                children.append({
                    'type': 'file',
                    'name': item.name,
                    'path': str(item.relative_to(self.spec_root))
                })
            elif item.is_dir() and not item.name.startswith('.'):
                children.append({
                    'type': 'dir',
                    'name': item.name,
                    'path': str(item.relative_to(self.spec_root))
                })
        
        return sorted(children, key=lambda x: (x['type'], x['name']))
    
    def load_snippet(self, file_path):
        """Load markdown file and extract title, summary, content"""
        if file_path == "":
            file_path = "miso.md"
        
        full_path = self.spec_root / file_path
        if not full_path.exists():
            return None
        
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title (first # header)
        title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
        title = title_match.group(1) if title_match else "Untitled"
        
        # Extract summary (first *emphasized* text after title)
        summary_match = re.search(r'\*(.+?)\*', content)
        summary = summary_match.group(1) if summary_match else ""
        
        # Get parent path
        parent_path = str(full_path.parent.relative_to(self.spec_root))
        if parent_path == ".":
            parent_path = None
        
        # Get children
        dir_path = full_path.parent / full_path.stem
        children = []
        if dir_path.exists():
            for child_file in dir_path.glob('*.md'):
                child_content = child_file.read_text(encoding='utf-8')
                child_title_match = re.search(r'^# (.+)$', child_content, re.MULTILINE)
                child_title = child_title_match.group(1) if child_title_match else child_file.stem
                
                child_summary_match = re.search(r'\*(.+?)\*', child_content)
                child_summary = child_summary_match.group(1) if child_summary_match else ""
                
                children.append({
                    'title': child_title,
                    'summary': child_summary,
                    'path': str(child_file.relative_to(self.spec_root))
                })
        
        return {
            'title': title,
            'summary': summary,
            'content': content,
            'children': children,
            'parent_path': parent_path
        }

loader = SnippetLoader()

@app.route('/')
@app.route('/<path:snippet_path>')
def index(snippet_path=""):
    # Serve the same HTML but let JavaScript handle routing
    return render_template('index.html')

@app.route('/api/snippet')
@app.route('/api/snippet/<path:snippet_path>')
def get_snippet(snippet_path=""):
    snippet = loader.load_snippet(snippet_path)
    if snippet is None:
        return jsonify({'error': 'Snippet not found'}), 404
    return jsonify(snippet)

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/api/create-snippet', methods=['POST'])
def create_snippet():
    """Create a new snippet file"""
    data = request.get_json()
    parent_path = data['parent_path']
    filename = data['filename']
    title = data['title']
    summary = data['summary']
    
    # Determine target directory
    if parent_path == "miso.md":
        target_dir = Path("spec/miso")
    else:
        # Remove .md extension and use parent path to determine directory
        parent_without_ext = Path(parent_path).stem
        parent_dir = Path(parent_path).parent
        if str(parent_dir) == ".":
            target_dir = Path("spec") / parent_without_ext
        else:
            target_dir = Path("spec") / parent_dir / parent_without_ext
    
    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Create new file
    new_file_path = target_dir / f"{filename}.md"
    content = f"# {title}\n*{summary}*\n\n"
    
    with open(new_file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return jsonify({'path': str(new_file_path.relative_to("spec"))})

@app.route('/api/update-snippet', methods=['POST'])
def update_snippet():
    """Update snippet content"""
    data = request.get_json()
    snippet_path = data['path']
    new_content = data['content']
    
    full_path = Path("spec") / snippet_path
    
    if not full_path.exists():
        return jsonify({'error': 'Snippet not found'}), 404
    
    try:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/debug-log', methods=['POST'])
def debug_log():
    """Log debug messages from the client"""
    data = request.get_json()
    message = data.get('message', '')
    timestamp = data.get('timestamp', '')
    
    # Print to console for immediate feedback
    print(f"[{timestamp}] {message}")
    
    # Also write to file
    log_file = Path("debug.log")
    with open(log_file, 'a', encoding='utf-8') as f:
        f.write(f"[{timestamp}] {message}\n")
    
    return jsonify({'success': True})

# Observability endpoints
@app.route('/api/monitor/screenshot')
def get_latest_screenshot():
    """Return path to most recent screenshot for agent access"""
    screenshot_dir = Path("spec/miso/agents/.observability/code/logs/screenshots")
    latest_path = screenshot_dir / "latest.png"
    
    if latest_path.exists():
        return jsonify({
            "status": "success",
            "screenshot_path": str(latest_path.resolve()),
            "timestamp": datetime.fromtimestamp(latest_path.stat().st_mtime).isoformat()
        })
    else:
        return jsonify({"status": "no_screenshot", "message": "No screenshot available"}), 404

@app.route('/api/monitor/state')
def get_browser_state():
    """Return current browser state as JSON"""
    state_dir = Path("spec/miso/agents/.observability/code/logs/states")
    latest_path = state_dir / "latest.json"
    
    if latest_path.exists():
        with open(latest_path, 'r') as f:
            state = json.load(f)
        return jsonify(state)
    else:
        return jsonify({"status": "no_state", "message": "No state available"}), 404

@app.route('/api/monitor/logs')
def get_interaction_logs():
    """Return recent user interaction history"""
    log_file = Path("spec/miso/agents/.observability/code/logs/interactions.jsonl")
    
    if log_file.exists():
        logs = []
        with open(log_file, 'r') as f:
            for line in f:
                logs.append(json.loads(line.strip()))
        
        # Return last 50 interactions
        return jsonify({"interactions": logs[-50:]})
    else:
        return jsonify({"interactions": []})

@app.route('/api/monitor/console')
def get_console_logs():
    """Return recent console output"""
    log_file = Path("spec/miso/agents/.observability/code/logs/console.jsonl")
    
    if log_file.exists():
        logs = []
        with open(log_file, 'r') as f:
            for line in f:
                logs.append(json.loads(line.strip()))
        
        # Return last 100 console messages
        return jsonify({"console_logs": logs[-100:]})
    else:
        return jsonify({"console_logs": []})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)