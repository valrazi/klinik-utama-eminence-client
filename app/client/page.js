"use client";

import DialogSubmit from "@/components/ui/molecules/Dialog";
import Empty from "@/components/ui/molecules/Empty";
import Loading from "@/components/ui/molecules/Loading";
import { FormLabel } from "@chakra-ui/form-control";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientHomepage() {
    const today = dayjs().format("YYYY-MM-DD");

    const { data: session, status } = useSession();
    const router = useRouter();
    const [staffs, setStaffs] = useState([])
    const [service, setService] = useState()
    const [staff, setStaff] = useState()
    const [date, setDate] = useState()
    const [schedules, setSchedules] = useState([])
    const [schedule, setSchedule] = useState()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const fetchStaffs = async () => {
        try {
            setLoading(true)
            const data = await axios.get(`/api/staff`, {
                params: {
                    services: service
                }
            })
            console.log(data.data);
            setStaffs(data.data.staff)
        } catch (error) {
            console.log(error);
            alert('GET Staff Failed')
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableSchedule = async () => {
        try {
            setLoading(true)
            const data = await axios.get(`/api/schedule`, {
                params: {
                    services: service,
                    staffId: staff,
                    date
                }
            })
            console.log(data.data);
            setSchedules(data.data.schedules)
        } catch (error) {
            console.log(error);
            alert('GET Available Schedule Failed')
        } finally {
            setLoading(false)
        }
    }

    const submitBookingReservation = async () => {
        try {
            setLoading(true)
            const data = await axios.post(`/api/schedule`, {
                services: service,
                staffId: staff,
                date,
                schedule,
            })
            console.log(data.data);
            alert('Booking Reservation Sukses')
            router.push('/client/history')
        } catch (error) {
            console.log(error);
            alert('POST Schedule Failed')
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
    }, [session, status, router]);


    useEffect(() => {
        if (service) {
            setStaff(null)
            fetchStaffs()
        }
    }, [service])

    useEffect(() => {
        if (staff) {
            setDate(null)
        }
    }, [staff])

    useEffect(() => {
        if (date) {
            setSchedule(null)
            fetchAvailableSchedule()
        }
    }, [date])

    if (status === "loading") {
        return <p>Loading...</p>;
    }


    return (
        <Flex direction={'column'} width={'full'}>
            <Loading show={loading} />

            <Flex width={'full'} align={'center'} justify={'center'} direction={'column'}>
                <Text fontSize={'12px'} color={'gray.500'}>
                    Form Reservasi Mandiri
                </Text>
                <Heading fontSize={'24px'} fontWeight={'semibold'}>
                    Booking Reservasi Anda
                </Heading>

                <Flex width={'full'} direction={'column'} marginBottom={'4'}>
                    <FormLabel>Layanan</FormLabel>
                    <select
                        placeholder="Layanan"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '2px solid gray',
                            borderRadius: '6px',
                        }}>

                        <option value="" selected disabled>Pilih Layanan</option>
                        <option value={'injury'}>Injury</option>
                        <option value={'perform'}>Perform</option>
                        <option value={'massage'}>Massage</option>
                    </select>
                </Flex>

                {
                    service && (
                        <Flex width={'full'} direction={'column'} marginBottom={'4'}>
                            <FormLabel>
                                {
                                    (service && service == 'injury')
                                        ? 'Daftar Dokter'
                                        : 'Daftar Terapis'
                                }
                            </FormLabel>
                            <select
                                placeholder="Staff"
                                value={staff}
                                onChange={(e) => setStaff(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: '2px solid gray',
                                    borderRadius: '6px',
                                }}>

                                <option value="" selected disabled>Pilih Staff</option>
                                {
                                    staffs.map((s) => (
                                        <option value={s.id} key={s.id}>{s.name}</option>
                                    ))
                                }
                            </select>
                        </Flex>
                    )
                }

                {
                    staff && (
                        <Flex width={'full'} direction={'column'} marginBottom={'4'}>
                            <FormLabel>
                                Tanggal Reservasi
                            </FormLabel>
                            <Input
                                type="date"
                                placeholder="Pilih Tanggal"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                w="full"
                                border={'2px solid gray'}
                                p={'2'}
                                min={today}
                            />
                        </Flex>
                    )
                }

                {
                    date && (
                        <Flex width={'full'} direction={'column'} marginBottom={'4'}>
                            <FormLabel>
                                Jam Reservasi
                            </FormLabel>
                            {
                                schedules.length
                                    ? (
                                        <select
                                            placeholder="Jam Reservasi"
                                            value={schedule}
                                            onChange={(e) => setSchedule(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                border: '2px solid gray',
                                                borderRadius: '6px',
                                            }}>

                                            <option value="" selected disabled>Pilih Jam</option>
                                            {
                                                schedules.map((s) => (
                                                    <option value={`${s.start_time}-${s.end_time}`} key={s.id}>{`${s.start_time} - ${s.end_time}`}</option>
                                                ))
                                            }
                                        </select>
                                    )
                                    : (<Empty />)
                            }
                        </Flex>
                    )
                }

                {
                    schedule && (
                        <DialogSubmit
                            open={showModal}
                            setOpen={setShowModal}
                            titleText={'Submit Reservasi'}
                            bodyElement={
                                (
                                    <Heading>
                                        Apakah anda yakin ingin melakukan reservasi{" "}
                                        Layanan <strong>{service.toUpperCase()}</strong>{" "}
                                        dengan <strong>{staffs.find((s) => s.id == staff).name}</strong>{" "}
                                        pada tanggal <strong>{date}</strong> dan jam <strong>{schedule}</strong>
                                    </Heading>
                                )
                            }
                            triggerElement={
                                (
                                    <Button backgroundColor={'black'} color={'white'} _hover={{ color: 'red' }} size={'lg'} width={'full'} rounded={'xl'}>Booking Reservasi</Button>
                                )
                            }
                            onSubmit={submitBookingReservation}
                        />
                    )
                }


            </Flex>
        </Flex>
    );
}
