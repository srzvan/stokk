import * as React from "react";
import { ChakraProvider, Box, Grid, Flex, extendTheme, Badge, Heading } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ColorModeSwitcher } from "../ColorModeSwitcher";

const theme = extendTheme({
  styles: {
    global: {
      "html, body, #root": {
        height: "100%",
      },
    },
  },
});

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Grid h="100%" templateRows="auto 1fr auto">
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
          <ColorModeSwitcher />
        </Flex>
        <Grid as="main" templateColumns="7.5rem 3fr 1fr 7.5rem" templateRows="150px 1fr 1fr" gap="1.5rem" fontSize="xl">
          <Box p={3} border="1px dashed gray" as="p" gridColumn="2 / span 1" gridRow="1 / span 3">
            Stock chart goes here 📈
          </Box>
          <Box p={3} border="1px dashed gray" as="p" gridColumn="3 / span 1" gridRow="1 / span 1">
            Search goes here 🔎
          </Box>
          <Box p={3} border="1px dashed gray" as="p" gridColumn="3 / span 1" gridRow="2 / span 1">
            Date Interval goes here 📅
          </Box>
        </Grid>
        <Box as="footer" p={5} fontSize="xl" textAlign="center">
          <p>
            Made with{" "}
            <span role="img" aria-labelledby="Heart">
              💖
            </span>{" "}
            by Răzvan Sbîngu
          </p>
        </Box>
      </Grid>
    </ChakraProvider>
  );
};
