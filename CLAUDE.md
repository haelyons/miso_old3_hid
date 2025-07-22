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

When implementing user requests, follow this four-level abstraction approach:

1. **Specification**: Add/modify feature specification snippets in `spec/`
2. **Pseudocode**: Create `pseudocode.md` with human-readable descriptions and natural language pseudocode
3. **Implementation**: Create `implementation.md` with actual code examples in the target language  
4. **Code**: Write runnable code in a `code/` subfolder within the feature's metafolder

## Development Commands

This project currently has no package.json, Makefile, or build system configured. All development is specification-driven through the markdown files in `spec/`.

## Key Principles

- The specification tree is the authoritative source, not the generated code
- Specifications should enable complete code regeneration in any language/platform
- Keep snippets brief and hierarchical for both human and LLM readability
- Agent conversations should focus on understanding and modifying the feature tree first, then generating code