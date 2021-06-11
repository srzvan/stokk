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

type HeaderProps = {
  query: string;
  setQuery: (newQuery: string) => void;
  setShouldFetchDailyStockTimeSeries: (shouldFetchDailyStockTimeSeries: boolean) => void;
};

function Header(props: HeaderProps) {
  const { query, setQuery, setShouldFetchDailyStockTimeSeries } = props;

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
            <Search
              inputRef={searchInputRef}
              query={query}
              setQuery={setQuery}
              closeModal={onToggle}
              setShouldFetchDailyStockTimeSeries={setShouldFetchDailyStockTimeSeries}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Header;
