# workflow
*how agents should implement user requests*

A user request should result in modifications at four levels of abstraction:

**specification** : the agent adds a new feature specification snippet, or modifies an existing one. To maintain brevity and keep the number of children below 7, the agent may also have to modify the tree structure.

**pseudocode** : in the metafolder, the agent should create a file called `pseudocode.md` that contains human-readable text and pseudocode sections (using back-ticks). The file should introduce the new function/command(s), show how to invoke them (natural language) and describe the intended output, using examples. Pseudocode should be natural language only; no actual code should be included.

**implementation** : also in the metafolder, the agent should create a file called `implementation.md`, derived from `pseudocode.md`. This should contain human-readable descriptions with code sections (back-ticks) in whatever actual programming language the user / agent prefers.

**code** : in the metafolder, the agent should write and maintain all runnable code and scripts required to implement the feature, stored in a `code/` subfolder.