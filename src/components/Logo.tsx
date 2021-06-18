import * as React from "react";
import { Heading, Badge, Box } from "@chakra-ui/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export const Logo: React.FC = () => (
  <Heading as="h1" size="lg" mb={4}>
    <Badge
      colorScheme="red"
      fontSize="inherit"
      lineHeight="short"
      alignItems="center"
      display="inline-flex"
      borderTopRightRadius={0}
      borderBottomRightRadius={0}
    >
      <FaArrowDown />
      <Box as="span" marginLeft="2">
        st
      </Box>
    </Badge>
    <Badge
      fontSize="inherit"
      lineHeight="short"
      alignItems="center"
      colorScheme="green"
      display="inline-flex"
      borderTopLeftRadius={0}
      borderBottomLeftRadius={0}
    >
      <Box as="span" marginRight={2}>
        okk
      </Box>
      <FaArrowUp />
    </Badge>
  </Heading>
);
