"use client"
import DebouncedSearchInput from "@/components/ui/atomics/InputSearch";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import TableData from "@/components/ui/atomics/TableData";
import { showConfirm, showError, showSuccess } from "@/utils/swal";
import { Button, Flex, Table } from "@chakra-ui/react";
import axios from "axios";
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
            const data = await axios.get(`${API_URL}/contact-information`, {
                params: {
                    nama_lengkap: name
                }
            })
            setTeachers(data.data.data)
        } catch (error) {
            alert('Get Contact Information Data Error')
        }
    }

    const deleteUser = async (id) => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menghapus Data Ini?',
            })
            if(isConfirmed) {
                await axios.delete(`${API_URL}/contact-information/${id}`)
                showSuccess("Delete data success")
                fetchUsers()
            }
        } catch (error) {
            showError("Delete data Failed")
        }
    }
    const addData = () => {
        router.push('/backoffice/layanan-kontak/add')
    }
    const headers = ["No", "Nama Lengkap", "Email", "No Telpon", "Actions"];

    const renderRow = (item, idx) => (
        <Table.Row key={item.id} style={{borderBottom: '1px solid black'}}>
            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>

            <Table.Cell textAlign="center">{item.nama_lengkap}</Table.Cell>
            <Table.Cell textAlign="center">{item.nama_mapel}</Table.Cell>
            <Table.Cell textAlign="center">{item.email}</Table.Cell>
            <Table.Cell textAlign="center">{item.no_telepon}</Table.Cell>
            <Table.Cell textAlign="center">
                <Flex justify="center" gap="4" justifyContent={'center'}>
                    <NavigationButton
                    onClick={() => {
                        router.push('/backoffice/layanan-kontak/edit/' + item.id)
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
                <NavigationButton
                    onClick={addData}
                    label="Tambah Data" />
            </Flex>

            <TableData
                title="Layanan Kontak"
                headers={headers}
                data={teachers}
                isLoading={loading}
                renderRow={renderRow}
            />
        </Flex>
    )
}