import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [currentImage, setCurrentImage] = useState('');

  // TODO FUNCTION HANDLE VIEW IMAGE
  const viewImage = (url: string): void => {
    setCurrentImage(url);
    onOpen();
  };

  console.log(1);

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={[1, 1, 2, 3]} spacing={40}>
        {cards.map(card => (
          <Card key={card.id} data={card} viewImage={viewImage} />
        ))}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={currentImage} />
    </>
  );
}
