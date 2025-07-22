# Testing Implementation Commands

## System-Wide Testing
```bash
cd spec/miso/agents/workflow/.testing/code
npm test
```
Discovers and runs all `*.test.js` files in feature `code/` directories throughout the system.

## Feature-Specific Testing
For any feature at path `spec/miso/A/B/`:

```bash
# Option 1: Direct Jest execution
cd spec/miso/agents/workflow/.testing/code
npx jest "../../../../A/.B/code/*.test.js"

# Option 2: Run from feature directory
cd spec/miso/A/.B/code
npx jest --config="../../../../agents/workflow/.testing/code/jest.config.js" *.test.js
```

## Component-Level Testing
Test all features within a component (e.g., all editor features):

```bash
cd spec/miso/agents/workflow/.testing/code
npx jest "../../../../editor/**/*.test.js"
```

## Test Development Workflow
```bash
# Install dependencies (one time)
cd spec/miso/agents/workflow/.testing/code
npm install

# Watch mode for active development
cd spec/miso/agents/workflow/.testing/code
npx jest --watch "../../../../A/.B/code/*.test.js"

# Verbose output for debugging
cd spec/miso/agents/workflow/.testing/code
npx jest --verbose "../../../../A/.B/code/*.test.js"
```

## Configuration Files
- `package.json` - Jest configuration and npm scripts
- `test-setup.js` - Global mocks and test environment setup
- `run-tests.js` - Automatic test discovery script

## Test File Locations
Tests live in feature metafolders: `spec/miso/A/.B/code/feature.test.js`