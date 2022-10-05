import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { Card, CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchImages = async ({
    pageParam = null,
  }): Promise<Record<string, unknown>> => {
    const { data } = await api.get('/api/images', {
      params: { after: pageParam },
    });

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: response => {
      return response.after || null;
    },
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData as Card[]} />

        {hasNextPage && (
          <Button
            mt={10}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
