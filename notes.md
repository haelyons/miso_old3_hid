~notes

- we shouldn't be talking to the agent at all
- we should do all edits by editing the feature tree
- we should just add one-line "new feature" (name/one-liner)
- system should put it automatically into the tree at the right place
- snippets should be flaggable as "agent commands"
  i.e. we specify agent workflow precisely, as bullet points.

therefore:

- need to work on the markdown editor, it's a critical part of the IDE

the IDE should be managing the prompt context for you; that's sort of the point.
managing multiple micro-agents for you.

- how to do task X: we assemble the context and system prompt, fire off the LLM.
- we record the chat log and the changes made to the files

