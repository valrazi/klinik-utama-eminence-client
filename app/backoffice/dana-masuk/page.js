"use client"
import DateRangePickerComponent from "@/components/ui/atomics/Datepicker";
import DebouncedSearchInput from "@/components/ui/atomics/InputSearch";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import TableData from "@/components/ui/atomics/TableData";
import { showConfirm, showError, showSuccess } from "@/utils/swal";
import { Box, Button, Flex, Heading, Table, Text } from "@chakra-ui/react";
import axios from "axios";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LuDownload } from "react-icons/lu";
export default function BackofficePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const session = useSession()
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(false)
    const [exportDate, setExportDate] = useState([useState(dayjs().subtract(30, 'day').toDate()), useState(dayjs().toDate())])
    const [graph, setGraph] = useState({
        fitrahUang: 0,
        fitrahBeras: 0,
        maal: 0,
        infaq: 0
    })

    const handleSearch = (value) => {
        fetchUsers(value)
    };

    const fetchUsers = async (startAt = dayjs().subtract(30, 'days').format('YYYY-MM-DD'), endAt = dayjs().format('YYYY-MM-DD')) => {
        try {
            const data = await axios.get(`${API_URL}/payment`, {
                params: {
                    startAt,
                    endAt
                }
            })
            setTeachers(data.data.data)
        } catch (error) {
            alert('Get Data Error')
        }
    }

    const fetchGraph = async (startAt = dayjs().subtract(30, 'days').format('YYYY-MM-DD'), endAt = dayjs().format('YYYY-MM-DD')) => {
        try {
            const data = await axios.get(`${API_URL}/payment/graph`, {
                params: {
                    startAt,
                    endAt
                }
            })
            setGraph({
                fitrahBeras: data.data.data.totalZakatFitrahBeras,
                infaq: data.data.data.totalInfaq,
                fitrahUang: data.data.data.totalZakatFitrahUang,
                maal: data.data.data.totalZakatMaal
            })
        } catch (error) {
            alert('Get Data Error')
        }
    }


    const handleExportCSV = async () => {

        try {
            const response = await axios.get(`${API_URL}/payment/export`, {
                params: { startAt: exportDate[0], endAt: exportDate[1] },
                responseType: 'blob', // important for file download
            });

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `export-${exportDate[0]}_to_${exportDate[1]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Failed to export CSV:', err);
        }
    };
    const addData = () => {
        router.push('/backoffice/dana-masuk/add')
    }
    const headers = ["No", "Nama Lengkap", "Jenis Kelamin", "Jenis Pembayaran", "Nominal Pembayaran", "Tanggal", "Status", "Actions"];

    const renderRow = (item, idx) => (
        <Table.Row key={item.id} style={{ borderBottom: '1px solid black' }}>
            <Table.Cell textAlign="center">{idx + 1}</Table.Cell>

            <Table.Cell textAlign="center">{item.user.nama_lengkap}</Table.Cell>
            <Table.Cell textAlign="center">{item.user.jenis_kelamin}</Table.Cell>
            <Table.Cell textAlign="center">{item.jenis_pembayaran}</Table.Cell>
            <Table.Cell textAlign="center">
                {
                    (item.jenis_pembayaran == 'Zakat Fitrah Uang' || item.jenis_pembayaran == 'Infaq' || item.jenis_pengeluaran == 'Zakat Maal')
                        ? `Rp. ${item.nominal_pembayaran}`
                        : `${item.nominal_pembayaran} Ltr`
                }
            </Table.Cell>
            <Table.Cell textAlign="center">{dayjs(item.createdAt).format('dddd, DD MMMM YYYY')}</Table.Cell>
            <Table.Cell textAlign="center">
                <span style={{ color: item.status_terima ? 'green' : 'black', fontWeight: 'bold' }}>{item.status_terima ? 'Diterima' : 'Belum Diterima'}</span>
            </Table.Cell>
            <Table.Cell textAlign="center">
                {
                    session?.data?.user?.role == 'admin'
                        ? (
                            <Flex justify="center" gap="4" justifyContent={'center'}>
                                <NavigationButton
                                    onClick={() => {
                                        router.push('/backoffice/dana-masuk/edit/' + item.id)
                                    }}
                                    backgroundColor={'yellow'}
                                    color={'black'}
                                    label="Kelola"
                                />
                                {/* <NavigationButton
                                    onClick={() => deleteUser(item.id)}
                                    backgroundColor={'red'}
                                    color={'black'}
                                    label="Hapus"
                                /> */}
                            </Flex>
                        )
                        : (
                            <Flex justify="center" gap="4" justifyContent={'center'}>
                                <NavigationButton
                                    onClick={() => {
                                        router.push('/backoffice/dana-masuk/edit/' + item.id)
                                    }}
                                    backgroundColor={'yellow'}
                                    color={'black'}
                                    label="Kelola"
                                />
                            </Flex>
                        )
                }
            </Table.Cell>
        </Table.Row>
    );
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <Flex direction={'column'} gapY={'7'}>
            <Heading textAlign={'center'} fontSize={'32px'} fontWeight={'bold'} color={'#8B7B25'}>Dana Masuk</Heading>

            <Flex gapX={'6'} justify={'center'} align={'center'} width={'full'}>
                <Box flex={'1'} p={'4'} backgroundColor={'#8B7B25'} rounded={'xl'} color={'white'} fontSize={'16px'} fontWeight={'bold'}  textAlign={'center'}>
                    <Text marginBottom={'4'}>Total Zakat<br></br>Fitrah Uang</Text>
                    <Text>Rp. {graph.fitrahUang}</Text>
                </Box>

                <Box flex={'1'} p={'4'} backgroundColor={'#8B7B25'} rounded={'xl'} color={'white'} fontSize={'16px'} fontWeight={'bold'}  textAlign={'center'}>
                    <Text marginBottom={'4'}>Total Zakat<br></br>Fitrah Beras</Text>
                    <Text>{graph.fitrahBeras} Liter</Text>
                </Box>

                <Box flex={'1'} p={'4'} backgroundColor={'#8B7B25'} rounded={'xl'} color={'white'} fontSize={'16px'} fontWeight={'bold'}  textAlign={'center'}>
                    <Text marginBottom={'4'}>Total Zakat<br></br>Maal</Text>
                    <Text>{graph.maal} Liter</Text>
                </Box>

                <Box flex={'1'} p={'4'} backgroundColor={'#8B7B25'} rounded={'xl'} color={'white'} fontSize={'16px'} fontWeight={'bold'}  textAlign={'center'}>
                    <Text marginBottom={'4'}>Total Zakat<br></br>Infaq</Text>
                    <Text>Rp. {graph.infaq}</Text>
                </Box>

                
            </Flex>

            <Flex gapX={'2'} align={'center'}>
                <NavigationButton
                    style={{
                        transform: 'translate(0, 8px)'
                    }}
                    onClick={handleExportCSV}
                    backgroundColor="#8B7B25"
                    label={
                        (
                            <Flex gapX={'1'} align={'center'}>
                                <LuDownload />
                                <span>Rekap Data</span>
                            </Flex>
                        )
                    } />
                <DateRangePickerComponent fetchData={fetchUsers} setExportDate={setExportDate} fetchGraph={fetchGraph}/>
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