import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        maxW={900}
        maxH={600}
        width="fit-content"
        background="pGray.800"
      >
        <ModalBody padding={0}>
          <Image
            maxW={900}
            maxH={600}
            objectFit="contain"
            src={imgUrl}
            alt="image"
          />
        </ModalBody>

        <ModalFooter
          justifyContent="start"
          paddingY={2}
          paddingX={3}
          fontSize={14}
        >
          <Link href={imgUrl}>Abrir original</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
