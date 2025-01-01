import React, { FC, ReactElement } from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface WrapperProps {
  children: ReactElement;
}

const TestWrapper: FC<WrapperProps> = ({ children }) => {
  const testQueryClient = createTestQueryClient();
  return React.createElement(
    QueryClientProvider,
    { client: testQueryClient },
    children
  );
};

export function renderWithClient(ui: ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}

export * from '@testing-library/react'; 