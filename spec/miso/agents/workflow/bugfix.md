# bugfix
*rapid iteration cycle for fixing working code while maintaining specification integrity*

When working code has bugs or needs immediate fixes, the standard workflow can be too slow. This creates a tension between rapid iteration and maintaining comprehensive specifications.

**The bugfix workflow solves this by allowing tactical code fixes followed by strategic specification updates:**

**Fix First (Tactical):**
- Identify and fix the bug directly in the `code/` folder
- Test the fix to ensure it works
- Get the system running properly as quickly as possible

**Document After (Strategic):**  
- Update `testing.md` to specify tests covering the bug scenario and validation of the fix
- Update `pseudocode.md` to reflect the conceptual changes
- Update `implementation.md` to capture the specific technical fixes
- Ensure specifications contain enough detail to regenerate the same working code

**Critical Principle:** The specifications remain the authoritative source of truth. Code fixes are temporary tactical moves that must be captured in the specifications to maintain system integrity.

**When to Use:** Use this workflow when you have working code that needs immediate fixes, rather than starting from specifications. This is common during testing, debugging, and iterative development phases.

**Anti-Pattern:** Never leave fixes in code without updating specifications. This breaks the miso principle that specifications should enable complete regeneration of working systems.