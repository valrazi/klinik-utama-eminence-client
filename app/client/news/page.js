"use client";

import FooterClient from "@/components/ui/atomics/FooterClient";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import Empty from "@/components/ui/molecules/Empty";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiRotaryPhone } from "react-icons/gi";
import { FaArrowCircleLeft } from "react-icons/fa";
import axios from "axios";


export default function BackofficePage() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { data: session, status } = useSession();
    const router = useRouter();
    const [news, setNews] = useState([])

    const fetchNews = async () => {
        try {
            const data = await axios.get(`${API_URL}/news-report`)
            setNews(data.data.data)
        } catch (error) {
            console.log(error);
            alert('GET Berita Failed')
        }
    }



    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        }
        fetchNews()
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }


    return (
        <Flex direction={'column'} width={'full'}>
            <Box width={'full'} mt={'2'}>
                <Link href={'/client'}>
                    <FaArrowCircleLeft color="#8B7B25" fontSize={'20px'} />
                </Link>
            </Box>
            <Heading textAlign={'center'} fontSize={'18px'} fontWeight={'bold'} color={'#8B7B25'}>Berita Program</Heading>
            <Flex gapX={'5'} width={'full'} flexWrap={'wrap'} mt={'6'}>
                {
                    news.length
                        ? news.map((n) => {
                            return (
                                <Flex
                                    maxWidth={'1/4'} align={'center'} justify={'center'} backgroundColor={'white'}
                                    direction={'column'} p={'2'} rounded={'xl'} border={'2px solid black'}>
                                    <img
                                        src={n.foto}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            marginBottom: '16px'
                                        }} />
                                    <Heading fontWeight={'bold'} fontSize={'10px'} marginBottom={'8px'}>{n.judul_berita}</Heading>
                                    <Text textAlign={'center'} fontSize={'11px'} marginBottom={'12px'} lineClamp={'1'}>{n.isi_berita}</Text>
                                    <Link href={`/client/news-detail/${n.id}`}>
                                        <NavigationButton
                                            label="Selengkapnya"
                                            backgroundColor="#8B7B25"
                                        />
                                    </Link>
                                </Flex>
                            )
                        })
                        : (
                            <Empty />
                        )
                }
            </Flex>
            <Flex width={'full'} backgroundColor={'#8B7B25'} justify={'space-between'} px={'60px'} py={'20px'} height={'200px'} align={'center'} mt={'6'}>
                <Flex flex={'1'} direction={'column'} gap={'15px'} justify={'center'} align={'center'}>
                    <Heading color={'white'} fontWeight={'bold'} fontSize={'14px'}>Informasi Masjid</Heading>
                    <Text color={'white'} fontSize={'12px'}>Masjid Al Furqon Bekasi<br></br>Bulevar Hijau, Jl. Bulevar<br></br>Hijau Raya, Bekasi, Jawa<br></br>Barat</Text>
                </Flex>

                <Flex flex={'1'} direction={'column'} gap={'15px'} justify={'center'} align={'center'}>
                    <Heading color={'white'} fontWeight={'bold'} fontSize={'14px'} style={{
                        transform: 'translate(0, -25px)'
                    }}>Hubungi Kami</Heading>
                    <Flex color={'white'} fontSize={'16px'} align={'center'} gapX={'2'}>
                        <GiRotaryPhone /> <span>0811818665</span></Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
