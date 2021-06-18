import {
  Flex,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaSearch } from 'react-icons/fa';

import { Logo } from './Logo';
import { Search } from './Search';

export const Header: React.FC = () => {
  const searchInputRef = React.useRef(null);
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <Flex
      p={5}
      as="header"
      fontSize="2xl"
      direction="column"
      alignItems="center"
    >
      <Logo />
      <Button
        size="md"
        fontSize="xl"
        onClick={onOpen}
        variant="outline"
        colorScheme="blue"
        rightIcon={<FaSearch />}
      >
        Search
      </Button>
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="scale"
        initialFocusRef={searchInputRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search for a stock symbol/company name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Search closeModal={onToggle} inputRef={searchInputRef} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
