"use client"
import DebouncedSearchInput from "@/components/ui/atomics/InputSearch";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import TableData from "@/components/ui/atomics/TableData";
import { showConfirm, showError, showSuccess } from "@/utils/swal";
import { Button, Flex, Table } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function BackofficePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = (value) => {
        fetchUsers(value)
    };

    const fetchUsers = async (name = null) => {
        try {
            const data = await axios.get(`${API_URL}/schedule-lesson`)
            setTeachers(data.data.data)
        } catch (error) {
            alert('Get Data Error')
        }
    }

    const addData = () => {
        router.push('/backoffice/akademik/jadwal-pelajaran/add')
    }
    const headers = ["No", "Jadwal Pelajaran", "Actions"];

    const renderRow = (item, idx) => (
        <Table.Row key={item.id} style={{ borderBottom: '1px solid black' }}>
            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>

            <Table.Cell textAlign="center" display={'flex'} align="center" justifyContent={'center'}>
                <Image src={item.foto} alt="Gambar Jadwal Pelajaran" width={'128'} height={'128'}/>
            </Table.Cell>
            <Table.Cell textAlign="center">
                <Flex justify="center" gap="4" justifyContent={'center'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/akademik/jadwal-pelajaran/edit/' + item.id)
                        }}
                        backgroundColor={'yellow'}
                        color={'black'}
                        label="Kelola"
                    />
                </Flex>
            </Table.Cell>
        </Table.Row>
    );
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <Flex direction={'column'} gapY={'7'}>
            <Flex gapX={'2'}>
                {
                    teachers.length == 0
                        ? (
                            <NavigationButton
                                onClick={addData}
                                label="Tambah Jadwal Pelajaran" />
                        )
                        : null
                }
            </Flex>

            <TableData
                title="Data Jadwal Pelajaran"
                headers={headers}
                data={teachers}
                isLoading={loading}
                renderRow={renderRow}
            />
        </Flex>
    )
}