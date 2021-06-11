import * as React from "react";
import { Heading, Badge, Box } from "@chakra-ui/react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

function Logo() {
  return (
    <Heading as="h1" size="lg" mb={4}>
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
  );
}

export default Logo;
