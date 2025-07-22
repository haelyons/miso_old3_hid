# agents
*how user-agent conversation should work*

The purpose of the agent workflow is to help the user understand and modify a running application, without having to know or understand its code. 

The typical workflow will look something like:

- user uses application (agent is able to monitor what user sees, and any console output from the browser, as well as debug information on the server)
- when the user encounters a problem or has an idea for a modification, they converse with the agent
- once the agent understands the request, the agent adds a new sub-feature, and the user is able to edit and validate this
- the agent then generates feature-specific meta-information such as pseudocode, code snippets, tests, and so on, within the feature's metafolder.
- once validated by the user, the LLM modifies the code in the `code/` folder
