"use client";

import DialogSubmit from "@/components/ui/molecules/Dialog";
import Empty from "@/components/ui/molecules/Empty";
import Loading from "@/components/ui/molecules/Loading";
import { FormLabel } from "@chakra-ui/form-control";
import { Badge, Box, Button, Card, Flex, Heading, Icon, Input, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarDays, FaClock } from "react-icons/fa6";

export default function ClientHomepage() {
    const today = dayjs().format("YYYY-MM-DD");

    const { data: session, status } = useSession();
    const router = useRouter();
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const fetchReservations = async () => {
        try {
            setLoading(true)
            const data = await axios.get(`/api/reservation`)
            setReservations(data.data.reservations)
        } catch (error) {
            console.log(error);
            alert('GET reservation Failed')
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        }
        fetchReservations()
    }, [session, status, router]);




    if (status === "loading") {
        return <p>Loading...</p>;
    }


    return (
        <Flex direction={'column'} width={'full'}>
            <Loading show={loading} />

            <Flex width={'full'} align={'center'} justify={'center'} direction={'column'}>
                <Flex width={'full'} direction={'column'} marginBottom={'4'}>
                    {
                        reservations.length
                            ? (
                                <>
                                    {reservations.map((r) => (
                                        <Card.Root
                                            key={r.id}
                                            borderWidth="1px"
                                            borderRadius="lg"
                                            shadow="md"
                                            _hover={{ shadow: "xl", transform: "translateY(-2px)" }}
                                            transition="all 0.2s ease-in-out"
                                            my={'2'}
                                        >
                                            <Card.Header pb={2}>
                                                <Flex justify="space-between" align="center">
                                                    <Box>
                                                        <Text fontSize="sm" color="gray.500">
                                                            Layanan
                                                        </Text>
                                                        <Heading size="md" fontWeight={'semibold'}>{r.service_id.toUpperCase()}</Heading>
                                                    </Box>
                                                    <Badge
                                                        backgroundColor={r.status === "booked" ? "green" : "red"}

                                                        color={r.status === "booked" ? "white" : "white"}
                                                        rounded="md"
                                                        px={2}
                                                        py={1}
                                                    >
                                                        {r.status}
                                                    </Badge>
                                                </Flex>
                                            </Card.Header>

                                            <Card.Body>
                                                <Stack spacing={3}>
                                                    <Box>
                                                        <Text fontSize="sm" color="gray.500">
                                                            Patient
                                                        </Text>
                                                        <Text fontWeight="bold">
                                                            {r.patient_name} ({r.patient_whatsapp_number})
                                                        </Text>
                                                    </Box>

                                                    <Box>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {
                                                                r.service_id == 'injury'
                                                                ? 'Dokter'
                                                                : 'Terapis'
                                                            }
                                                        </Text>
                                                        <Text fontWeight="semibold">{r.staff_name}</Text>
                                                    </Box>

                                                    <Box>
                                                        <Flex align="center" gap={2}>

                                                            <Icon color="gray.500" >
                                                                <FaCalendarDays />

                                                            </Icon>

                                                            <Text fontWeight="medium">
                                                                {new Date(r.schedule_date).toLocaleDateString("id-ID", {
                                                                    weekday: "long",
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </Text>
                                                        </Flex>
                                                        <Flex align="center" gap={2} mt={1}>

                                                            <Icon color="gray.500" >
                                                                <FaClock />
                                                            </Icon>

                                                            <Text>
                                                                {r.start_time.slice(0, 5)} - {r.end_time.slice(0, 5)}
                                                            </Text>
                                                        </Flex>
                                                    </Box>
                                                </Stack>
                                            </Card.Body>
                                        </Card.Root>
                                    ))}
                                </>
                            )
                            : (<Empty />)
                    }
                </Flex>


            </Flex>
        </Flex>
    );
}
