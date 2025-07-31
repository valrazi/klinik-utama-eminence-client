"use client";
import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GET } from '@/app/api/auth/[...nextauth]/route'
import dayjs from "dayjs";


export default function BackofficePage() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { data: session, status, update } = useSession(GET);
    const router = useRouter();
    const [data, setData] = useState(null)

    const params = useParams();




    const fetchDetail = async () => {
        try {
            const data = await axios.get(`${API_URL}/payment/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${session.accesToken}`
                }
            })
            setData(data.data.data)
            // window.print()
        } catch (error) {
            console.log(error);
            alert('Get Payment Detail Failed')
        }
    }

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        }
        console.log({ session });
        fetchDetail()
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    






    return (
        <Flex direction={'column'} width={'full'}>
            <Flex width={'full'} align={'center'} justify={'center'} direction={'column'} gap={'6'}>
                <Text fontSize={'12px'} width={'full'} fontWeight={'semibold'} mb={'3'} mt={'50px'}>
                    Terima kasih atas donasi yang telah Anda berikan.Semoga amal ibadah ini diterima oleh Allah SWT dan menjadi keberkahan bagi Anda sekeluarga.<br></br><br></br>
                    Bukti pembayaran berikut dapat Anda simpan sebagai arsip pribadi.
                </Text>

                {
                    data && (
                        <Flex direction={'column'} w={'full'} gap={'4'} mb={'58px'}>
                            <Flex w={'full'} fontSize={'12px'} align={'center'}>
                                <Text w={'1/3'}>Nomor Transaksi</Text>
                                <Text flex={'1'}>:{data.invoice}</Text>
                            </Flex>

                            <Flex w={'full'} fontSize={'12px'} align={'center'}>
                                <Text w={'1/3'}>Tanggal</Text>
                                <Text flex={'1'}>:{dayjs(data.createdAt).format('DD MMMM YYYY')}</Text>
                            </Flex>

                            <Flex w={'full'} fontSize={'12px'} align={'center'}>
                                <Text w={'1/3'}>Nama Lengkap</Text>
                                <Text flex={'1'}>:{data.user.nama_lengkap}</Text>
                            </Flex>

                             <Flex w={'full'} fontSize={'12px'} align={'center'}>
                                <Text w={'1/3'}>Jenis Donasi</Text>
                                <Text flex={'1'}>:{data.jenis_pembayaran}</Text>
                            </Flex>

                             <Flex w={'full'} fontSize={'12px'} align={'center'}>
                                <Text w={'1/3'}>Jumlah</Text>
                                <Text flex={'1'}>:{(data.jenis_pembayaran == 'Zakat Fitrah Uang' || data.jenis_pembayaran == 'Infaq') ? 'Rp.' : ''}{data.nominal_pembayaran}{(data.jenis_pembayaran != 'Zakat Fitrah Uang' && data.jenis_pembayaran != 'Infaq') ? 'Liter' : ''}</Text>
                            </Flex>
                        </Flex>
                    )
                }

                <Text fontSize={'12px'} textAlign={'center'} fontWeight={'semibold'} mb={'80px'}>
                    "Perumpamaan orang-orang yang menafkahkan hartanya di jalan Allah adalah seperti
                    <br></br><br></br>sebutir biji yang menumbuhkan tujuh bulir, pada tiap-tiap bulir seratus biji..."
                    <br></br><br></br>- QS. Al-Baqarah: 261
                </Text>

                <Text fontSize={'12px'} w='full' fontWeight={'semibold'}>
                    Hormat Kami,
                    <br></br><br></br>Pengurus Masjid Al Furqon Bekasi
                </Text>

            </Flex>

        </Flex>
    );
}
