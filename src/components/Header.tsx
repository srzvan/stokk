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
} from "@chakra-ui/react";
import * as React from "react";
import { FaSearch } from "react-icons/fa";

import Logo from "./Logo";
import Search from "./Search";

function Header() {
  const searchInputRef = React.useRef(null);
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();

  return (
    <Flex as="header" p={5} fontSize="2xl" direction="column" alignItems="center">
      <Logo />
      <Button variant="outline" size="md" colorScheme="blue" onClick={onOpen} fontSize="xl" rightIcon={<FaSearch />}>
        Search
      </Button>
      <Modal onClose={onClose} size="xl" isOpen={isOpen} motionPreset="scale" initialFocusRef={searchInputRef}>
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
}

export default Header;
