# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`miso` is an experimental agent-based coding system that uses **feature-modular specification** to maintain code through hierarchical markdown documentation. The core concept is to keep a tree of short (250-300 word) specification snippets that serve as the "source of truth" for the system, from which code can be generated in any language.

## Architecture

The project follows a specification-first approach with this structure:

- `spec/` - Contains the hierarchical feature specification tree
  - `miso.md` - Root specification describing the system
  - `miso/` - Child specifications adding detail to the root
    - `agents.md` - Agent workflow specifications  
    - `editor.md` - Web-based snippet editor specifications
    - `snippets.md` - Guidelines for writing good snippets
    - `agents/workflow.md` - Detailed agent implementation workflow

Each specification snippet should:
- Start with a `#` title followed by an *emphasized* one-line summary
- Stay under 250 words maximum
- Have at most 6 child snippets for readability
- Add detail through child snippets rather than editing the parent

## Agent Workflow

When implementing user requests, follow this five-level abstraction approach:

1. **Specification**: Add/modify feature specification snippets in `spec/`
2. **Test Writing**: Create `testing.md` with executable requirements as concise bullet points
3. **Pseudocode**: Create `pseudocode.md` with human-readable descriptions and natural language pseudocode
4. **Implementation**: Create `implementation.md` with actual code examples in the target language  
5. **Code**: Write runnable code in a `code/` subfolder within the feature's metafolder

## Development Commands

**Current Implementation Status:**

✅ **Editor Feature**: Complete Flask/JavaScript web editor with two-column interface
- Run: `./editor.sh` (auto-kills existing processes on port 5000)
- URL: http://localhost:5000
- Files: `spec/miso/.editor/code/` (Flask app, HTML, CSS, JS)

✅ **Observability System**: Playwright browser monitoring for agent visibility
- Files: `spec/miso/agents/.observability/code/`
- Monitor endpoints: `/api/monitor/screenshot`, `/api/monitor/state`, `/api/monitor/logs`

✅ **Breadcrumbs Navigation**: Clickable path navigation (replaced back button)
- Shows: `miso > agents > workflow` style trails
- Files: `spec/miso/editor/.breadcrumbs/`

✅ **Testing System**: Complete TDD-inspired testing workflow with Jest infrastructure
- Central infrastructure: `spec/miso/agents/workflow/.testing/code/` (Jest, test discovery)
- Test commands: `npm test` (system-wide), `npx jest path/to/feature.test.js` (feature-specific)
- Working tests: Breadcrumbs feature fully tested with 12 passing tests

## Recent Session Summary (2025-07-22 Part 2)

**Testing System Development:**
1. **Comprehensive Testing Workflow** - Implemented complete TDD-inspired testing system
   - Created central testing infrastructure with Jest and jsdom
   - Implemented automatic test discovery across all feature metafolders
   - Added working breadcrumbs tests with 12 passing test cases
   
2. **Updated Miso Workflow** - Revised 5-level abstraction to be test-driven
   - Moved test writing to 2nd position: specification → test writing → pseudocode → implementation → code
   - Tests now serve as executable requirements derived from specifications
   - Refined language from "testing" to "test writing" for precision

**Testing Architecture:**
- Central infrastructure: `spec/miso/agents/workflow/.testing/code/` (package.json, Jest config, test discovery)
- Feature-specific tests: Tests live in feature `code/` folders (e.g., `spec/miso/editor/.breadcrumbs/code/breadcrumbs.test.js`)
- Test commands: `npm test` (system-wide), `npx jest feature.test.js` (feature-specific)
- Test format: Single-sentence bullet points organized by category, under 250 words

**Documentation Updates:**
- `spec/miso/agents/workflow.md` - Updated 5-level workflow with test writing
- `spec/miso/agents/workflow/testing.md` - Complete testing specification
- `spec/miso/agents/workflow/testing/organization.md` - Test file organization principles
- `spec/miso/agents/workflow/.testing/implementation.md` - Testing command reference

## Previous Session Summary (2025-07-22 Part 1)

**Bugfixes Applied Using Miso Workflow:**
1. **Resizable Columns** - Fixed missing column resize functionality in editor
   - Added splitter element between content and child views
   - Implemented drag handlers with min/max width constraints
   - Added visual feedback with hover effects on splitter
2. **Mobile Navigation** - Fixed "Error loading snippet" on swipe-back gesture
   - Corrected parent path construction in `navigateUp()` function
   - Proper handling of path segments and .md extension addition

**Implementation Details:**
- HTML: Added `<div class="splitter" id="splitter"></div>` between columns
- CSS: Added `.splitter` styles with `col-resize` cursor and hover effects
- JavaScript: Added `setupResizeHandlers()` method with mouse event handling
- Fixed path logic: `"miso/agents.md"` → `"miso.md"` (not empty string)

**Meta Documentation Updated:**
- `spec/miso/.editor/pseudocode.md` - Added resize and navigation functions
- `spec/miso/.editor/implementation.md` - Updated with technical fixes

## Previous Session Summary (2025-01-22)

**Implemented:**
1. **Editor Feature** - Full specification → pseudocode → implementation → code workflow
2. **Observability System** - Playwright monitoring with agent-accessible endpoints  
3. **Breadcrumbs Navigation** - Enhanced UX replacing simple back buttons
4. **Bugfix Workflow** - New workflow for rapid fixes while maintaining spec integrity
5. **Launch Script** - `editor.sh` for easy startup with port cleanup

**Key Fixes Applied:**
- JavaScript initialization with "miso.md" instead of empty path
- Flask route handling for both empty and explicit paths
- Breadcrumbs path parsing (avoid duplicate "miso" segments)
- Snippet title format (remove .md extensions from titles)

**Documentation Added:**
- `spec/miso/agents/workflow/bugfix.md` - Fix-first, document-after workflow
- Complete pseudocode/implementation docs for all features
- Updated snippet guidelines to prevent title formatting issues

## Key Principles

- The specification tree is the authoritative source, not the generated code
- Specifications should enable complete code regeneration in any language/platform
- Keep snippets brief and hierarchical for both human and LLM readability
- Agent conversations should focus on understanding and modifying the feature tree first, then generating code
- Use bugfix workflow for rapid iteration: fix code first, then update specifications