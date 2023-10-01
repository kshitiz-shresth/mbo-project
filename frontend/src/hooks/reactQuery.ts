import { useQuery, UseQueryOptions } from 'react-query';

const fetchGraphQL = async (query: string) => {
  const response = await fetch('http://localhost:8080/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

const useGraphQLQuery = (
  query: string,
  options?: UseQueryOptions<any>
) => {
  return useQuery<any>(['graphql', query], () => fetchGraphQL(query), options);
};

export default useGraphQLQuery;
