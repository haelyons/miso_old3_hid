# testing
*ensuring code works correctly through systematic validation*

Test writing is a critical second level in the miso workflow, serving as executable requirements that ensure generated code functions as specified and remains robust over time.

**Test Writing Level Integration:**
The complete workflow becomes: specification → test writing → pseudocode → implementation → code

**Test Specification Format:**
- Create `testing.md` in the feature's metafolder alongside `pseudocode.md` and `implementation.md`
- Organize tests into logical categories (Core Functionality, Integration, Error Handling, etc.)
- Write each test as a single-sentence bullet point describing what should be validated
- Keep total specification under 250 words following miso brevity principles

**Test Implementation:**
- Store actual test files in the `code/` subfolder with the main implementation
- Follow established testing patterns in the target language/framework
- Ensure tests can regenerate working validation alongside the main code

**Validation Principle:**
Tests serve as executable specifications that validate the system matches its documented behavior. Like all miso components, test specifications should enable complete regeneration of working test suites that prove the system functions correctly.

**Integration with Workflows:**
- Standard workflow: Write test specifications immediately after feature specification, before technical design
- Bugfix workflow: Update test specifications first to specify tests covering the bug scenario and validation of the fix