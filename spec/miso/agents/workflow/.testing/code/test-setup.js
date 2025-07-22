// Test setup and globals
global.fetch = jest.fn();

// Mock DOM methods that aren't available in jsdom
Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    search: '',
    pathname: '/',
    origin: 'http://localhost',
    protocol: 'http:',
    host: 'localhost'
  },
  writable: true
});

// Reset mocks before each test
beforeEach(() => {
  fetch.mockClear();
  document.body.innerHTML = '';
});