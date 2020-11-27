import * as React from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

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
    <Flex as="header" p={5} fontSize="2xl" justifyContent="space-between" alignItems="center">
      <Heading as="h1" size="lg">
        <Badge
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          display="inline-flex"
          alignItems="center"
          colorScheme="red"
          fontSize="inherit"
          lineHeight="short"
        >
          <FaArrowDown />
          <Box as="span" marginLeft="2">
            st
          </Box>
        </Badge>
        <Badge
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          display="inline-flex"
          alignItems="center"
          colorScheme="green"
          fontSize="inherit"
          lineHeight="short"
        >
          <Box as="span" marginRight={2}>
            okk
          </Box>
          <FaArrowUp />
        </Badge>
      </Heading>
      <Button variant="ghost" size="md" colorScheme="teal" onClick={onOpen} fontSize="xl">
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
      <ColorModeSwitcher />
    </Flex>
  );
}

export default Header;
