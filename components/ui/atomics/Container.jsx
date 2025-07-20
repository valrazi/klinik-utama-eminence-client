import { Flex, Table } from "@chakra-ui/react";

export default function Container({
    title,
    children
}) {
  return (
    <Flex direction="column" flex="1" rounded="xl" w="full" borderWidth="1px" borderColor="black">
      <Flex
        bg="black"
        roundedTop="xl"
        justify="center"
        align="center"
        borderBottomWidth="1px"
        borderBottomColor="gray.500"
        p="3"
      >
        <span style={{ color:'white',   fontSize: "12px", fontWeight: "bold" }}>{title}</span>
      </Flex>

      <Flex direction="column" minH="200px" my="3">
        {children}
      </Flex>
    </Flex>
  );
}
