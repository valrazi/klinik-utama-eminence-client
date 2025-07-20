"use client"
import DebouncedSearchInput from "@/components/ui/atomics/InputSearch";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import TableData from "@/components/ui/atomics/TableData";
import { showConfirm, showError, showSuccess } from "@/utils/swal";
import { Button, Flex, Table } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function BackofficePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const session = useSession()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = (value) => {
        fetchUsers(value)
    };

    const fetchUsers = async (name = null) => {
        try {
            const data = await axios.get(`${API_URL}/achievment`, {
                params: {
                    nama_prestasi: name
                }
            })
            setTeachers(data.data.data)
        } catch (error) {
            alert('Get Data Error')
        }
    }

    const deleteUser = async (id) => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menghapus Data Prestasi Siswa Ini?',
            })
            if (isConfirmed) {
                await axios.delete(`${API_URL}/achievment/${id}`)
                showSuccess("Delete data success")
                fetchUsers()
            }
        } catch (error) {
            showError("Delete data Failed")
        }
    }
    const addData = () => {
        router.push('/backoffice/akademik/prestasi-siswa/add')
    }
    const headers = ["No", "Nama Prestasi", "Kategori Peserta", "Tanggal Prestasi", "Actions"];

    const renderRow = (item, idx) => (
        <Table.Row key={item.id} style={{ borderBottom: '1px solid black' }}>
            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>

            <Table.Cell textAlign="center">{item.nama_prestasi}</Table.Cell>
            <Table.Cell textAlign="center">{item.kategori_peserta}</Table.Cell>
            <Table.Cell textAlign="center">{dayjs(item.tanggal_prestasi).format('dddd, DD MMMM YYYY')}</Table.Cell>
            <Table.Cell textAlign="center">
                {
                    session?.data?.user?.role == 'admin'
                        ? (
                            <Flex justify="center" gap="4" justifyContent={'center'}>
                                <NavigationButton
                                    onClick={() => {
                                        router.push('/backoffice/akademik/prestasi-siswa/edit/' + item.id)
                                    }}
                                    backgroundColor={'yellow'}
                                    color={'black'}
                                    label="Kelola"
                                />
                                <NavigationButton
                                    onClick={() => deleteUser(item.id)}
                                    backgroundColor={'red'}
                                    color={'black'}
                                    label="Hapus"
                                />
                            </Flex>
                        )
                        : null
                }
            </Table.Cell>
        </Table.Row>
    );
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <Flex direction={'column'} gapY={'7'}>
            <Flex gapX={'2'}>
                <DebouncedSearchInput
                    onSearch={handleSearch}
                    placeholder="Search users..."
                    delay={500}  // optional: set custom debounce delay
                />
                {
                    session?.data?.user?.role == 'admin'
                        ? (
                            <NavigationButton
                                onClick={addData}
                                label="Tambah Prestasi" />
                        )
                        : null
                }
            </Flex>

            <TableData
                title="Prestasi Siwa"
                headers={headers}
                data={teachers}
                isLoading={loading}
                renderRow={renderRow}
            />
        </Flex>
    )
}