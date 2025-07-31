"use client"
import DebouncedSearchInput from "@/components/ui/atomics/InputSearch";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import TableData from "@/components/ui/atomics/TableData";
import { showConfirm, showError, showSuccess } from "@/utils/swal";
import { Button, Flex, Heading, Table } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {LuPlus} from 'react-icons/lu'
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
            const data = await axios.get(`${API_URL}/news-report`, {
                params: {
                    judul_berita: name
                }
            })
            setTeachers(data.data.data)
        } catch (error) {
            alert('Get Teacher Data Error')
        }
    }

    const deleteUser = async (id) => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menghapus Data Guru Ini?',
            })
            if(isConfirmed) {
                await axios.delete(`${API_URL}/news-report/${id}`)
                showSuccess("Delete data success")
                fetchUsers()
            }
        } catch (error) {
            showError("Delete data Failed")
        }
    }
    const addData = () => {
        router.push('/backoffice/berita-laporan/add')
    }
    const headers = ["No", "Foto Berita", "Judul Berita", "Tanggal Upload", "Actions"];

    const renderRow = (item, idx) => (
        <Table.Row key={item.id} style={{borderBottom: '1px solid black'}}>
            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>
            
            <Table.Cell textAlign="center">
                <img style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover'
                }} src={item.foto}/>
            </Table.Cell>
            <Table.Cell textAlign="center">{item.judul_berita}</Table.Cell>
            <Table.Cell textAlign="center">{dayjs(item.createdAt).format('dddd, DD MMMM YYYY')}</Table.Cell>
            <Table.Cell textAlign="center">
                <Flex justify="center" gap="4" justifyContent={'center'}>
                    <NavigationButton
                    onClick={() => {
                        router.push('/backoffice/berita-laporan/edit/' + item.id)
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
            <Heading textAlign={'center'} fontSize={'32px'} fontWeight={'bold'} color={'#8B7B25'}>Berita Program</Heading>
            <Flex gapX={'2'}>
                {/* <DebouncedSearchInput
                    onSearch={handleSearch}
                    placeholder="Search users..."
                    delay={500}
                /> */}
                <NavigationButton
                    onClick={addData}
                    backgroundColor="#8B7B25"
                    label={
                        (
                            <Flex gapX={'1'} align={'center'}>
                                <LuPlus/>
                                <span>Berita</span>
                            </Flex>
                        )
                    } />
            </Flex>

            <TableData
                title="Berita & Informasi"
                headers={headers}
                data={teachers}
                isLoading={loading}
                renderRow={renderRow}
            />
        </Flex>
    )
}