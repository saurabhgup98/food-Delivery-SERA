import { useCallback } from 'react';

export const useSearch = () => {
  const handleSearch = useCallback((query: string) => {
    // TODO: Implement search functionality
    // This could navigate to explore page with search params
    // or trigger a search API call
  }, []);

  return { handleSearch };
};
