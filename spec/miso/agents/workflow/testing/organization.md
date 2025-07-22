# organization
*where test files should be stored in the miso system*

Test files should live with their features, not in centralized test directories. This keeps tests close to the code they validate and maintains miso's feature-modular organization.

**Test File Location:**
Test files belong in the feature's `code/` folder alongside implementation files. For example, breadcrumbs tests go in `spec/miso/editor/.breadcrumbs/code/breadcrumbs.test.js`, not in a central test directory.

**Central Testing Infrastructure:**
The central testing infrastructure (`spec/miso/agents/workflow/.testing/code/`) contains only framework configuration and test discovery/running scripts:
- `package.json` - Jest configuration and dependencies for the entire system
- `test-setup.js` - Global mocks, utilities, and setup shared across all tests
- `run-tests.js` - Script to discover and execute tests from all feature `code/` folders

**Test Discovery:**
The central test runner automatically discovers `*.test.js` files in all feature `code/` directories throughout the specification tree, enabling system-wide test execution while keeping tests organized by feature.

**Benefits:**
- Tests stay close to the features they validate
- Feature deletion removes tests automatically  
- Each feature owns its complete testing implementation
- Central infrastructure handles only framework concerns