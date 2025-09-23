"use client";

import {
  Container,
  Heading,
  Text,
  VStack,
  Table,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function ReceiptPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchReservation = async () => {
      try {
        const res = await axios.get(`/api/reservation/${id}`);
        if (res.data.success) {
          // Adapt this depending on how your DB returns items
          setOrder(res.data.data);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error("Error fetching reservation:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  if (loading) {
    return (
      <Container py={8}>
        <Spinner size="lg" />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container py={8}>
        <Text>Reservation not found.</Text>
      </Container>
    );
  }

  // ⚡ Adapt: if your API returns `items` JSON, use it directly
  const items = order.items || [
    { name: "Sample Item", qty: 1, price: 10000 },
  ];

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <Container py={8}>
      <VStack align="start" spacing={1} mb={6}>
        <Heading size="lg">Receipt</Heading>
        <Text fontSize="sm" color="fg.muted">
          Services: {order.service.toUpperCase()}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Customer: {order.patient_name || "Unknown"}
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Order Date: {order.created_at
            ? dayjs(order.created_at).format('DD MMMM YYYY')
            : "-"}
        </Text>
      </VStack>

      {/* Table */}
      <Table.Root size="sm" variant="outline">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Item</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Qty</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Subtotal</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
              <Table.Cell>
                {`${order.service.toUpperCase()} - ${order.staff_name}`}
                <br></br>
                {`${dayjs(order.schedule_date).format('DD MMMM YYYY')} : ${order.start_time} - ${order.end_time}`}
              </Table.Cell>
              <Table.Cell textAlign="end">1</Table.Cell>
              <Table.Cell textAlign="end">
                Rp -
              </Table.Cell>
              <Table.Cell textAlign="end">
                Rp -
              </Table.Cell>
            </Table.Row>
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={3} textAlign="end" fontWeight="bold">
              Total
            </Table.Cell>
            <Table.Cell textAlign="end" fontWeight="bold">
              Rp -
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table.Root>

      {/* Print button */}
      <Button
        my={2}
        size="sm"
        px={2}
        backgroundColor="black"
        color="white"
        _hover={{ color: "red" }}
        onClick={() => window.print()}
        sx={{
          "@media print": {
            display: "none",
          },
        }}
      >
        Print Receipt
      </Button>
    </Container>
  );
}
