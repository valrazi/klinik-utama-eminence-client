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
    const [data, setData] = useState(null)
    const params = useParams()
    const [news, setNews] = useState([])

    const fetchNews = async () => {
        try {
            const data = await axios.get(`${API_URL}/news-report`, {
                params: {
                    limit: 3
                }
            })
            const arrData = data.data.data.filter((d) => d.id != params.id)
            setNews(arrData)
        } catch (error) {
            console.log(error);
            alert('GET Berita Failed')
        }
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`${API_URL}/news-report/${params.id}`)
            setData(response.data.data)
            fetchNews()
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
        fetchData()
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    const listLayanan = [
        {
            title: 'Zakat',
            description: 'Zakat adalah kewajiban untuk membersihkan harta dan membantu sesama.',
            href: '/client/info-zakat'
        },
        {
            title: 'Infaq',
            description: 'Infaq adalah bentuk kepedulian sosial yang bisa dilakukan kapan saja.',
            href: '/client/info-infaq'
        },
    ]

    return (
        <Flex direction={'column'} width={'full'}>
            {
                data && (
                    <Flex width={'full'} align={'center'} justify={'center'} direction={'column'} gap={'6'}>
                        <Box width={'full'} mt={'2'}>
                            <Link href={'/client'}>
                                <FaArrowCircleLeft color="#8B7B25" fontSize={'20px'} />
                            </Link>
                        </Box>
                        <Text fontSize={'18px'} fontWeight={'bold'} color="#8B7B25">
                            {data.judul_berita}
                        </Text>

                        <img src={data.foto} style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover'
                        }} />

                        <Text fontSize={'14px'} mb={'16px'}>
                            {data.isi_berita}
                        </Text>

                        <Flex gapX={'5'} width={'full'} flexWrap={'wrap'}>
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
                                                <Link href={`/client/news-detail/${ n.id}`}>
                                                    <NavigationButton
                                                        label="Selengkapnya"
                                                        backgroundColor="#8B7B25"
                                                    />
                                                </Link>
                                            </Flex>
                                        )
                                    })
                                    : null
                            }
                        </Flex>

                    </Flex>
                )
            }
        </Flex>
    );
}
