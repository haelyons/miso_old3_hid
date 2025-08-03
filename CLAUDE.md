# CLAUDE.md

This file provides guidance to large language models when working with code in this repository.

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
- Start with a `#` title followed by an *emphasized* or _emphasized_ one-line summary
- Stay under 250 words maximum
- Have at most 6 child snippets for readability
- Add detail through child snippets rather than editing the parent

## Agent Workflow

There are 2 user request modes. One is prototype, and the other production. 

When implementing user requests in prototype mode, follow this two-level abstraction approach:

1. **Specification**: Add/modify feature specification snippets in `spec/`
2. **References**: Read provided reference implementations (if any) and relevant dimensions (ie. aesthetic / functionality)
3. **Code**: Write runnable code in a `code/` subfolder with the feature's metafolder (preluded with a `.` - so `.code`)

When implementing user requests in production mode, follow this five-level abstraction approach:

1. **Specification**: Add/modify feature specification snippets in `spec/`
2. **Test Writing**: Create `testing.md` with executable requirements as concise bullet points
3. **Pseudocode**: Create `pseudocode.md` with human-readable descriptions and natural language pseudocode
4. **Implementation**: Create `implementation.md` with actual code examples in the target language  
5. **Code**: Write runnable code in a `code/` subfolder with the feature's metafolder (preluded with a `.` - so `.code`)

You will receive a specification, and a workflow mode (prototype or production). Run through the steps without any user interaction. All code should be in a top level spec/<project>/.code/ directory.