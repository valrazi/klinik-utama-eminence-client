import { Flex, Table } from "@chakra-ui/react";
import Loading from "../molecules/Loading";
import Empty from "../molecules/Empty"; // Assuming you have this

export default function TableData({
  isLoading,
  title = "Table",
  headers = [],
  data = [],
  renderRow 
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

      <Flex direction="column" px="2" minH="300px" maxH="370px" overflowY="scroll" my="3">
        {isLoading ? (
          <Loading />
        ) : data && data.length > 0 ? (
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row style={{borderBottom: '1px solid black'}}>
                {headers.map((h, idx) => (
                  <Table.ColumnHeader key={idx} fontWeight="bold" textAlign="center">
                    {h}
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((item, idx) => renderRow(item, idx))}
            </Table.Body>
          </Table.Root>
        ) : (
          <Empty />
        )}
      </Flex>
    </Flex>
  );
}
