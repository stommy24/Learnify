require('@testing-library/jest-dom');

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {}
  })
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/'
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/'
}));