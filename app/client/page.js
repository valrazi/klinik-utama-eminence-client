"use client";

import FooterClient from "@/components/ui/atomics/FooterClient";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import Empty from "@/components/ui/molecules/Empty";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiRotaryPhone } from "react-icons/gi";

export default function BackofficePage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { data: session, status } = useSession();
    const router = useRouter();
    const [news, setNews] = useState([])

    const fetchNews = async () => {
        try {
            const data = await axios.get(`${API_URL}/news-report`, {
                params: {
                    limit: 3
                }
            })
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
            <Flex width={'full'} align={'center'} justify={'center'} direction={'column'} gap={'6'}>
                <img src="/img/hero_client.png" />
                <Text fontSize={'14px'} fontWeight={'semibold'}>
                    Masjid Al Furqon Bekasi menerima dan menyalurkan Zakat dan Infaq Anda secara amanah, tepat sasaran, dan transparan kepada mereka yang benar-benar membutuhkan. Melalui layanan digital ini, kami berkomitmen memudahkan umat dalam menjalankan kewajiban serta berbagi rezeki, kapan saja dan di mana saja.
                </Text>
                <Flex width={'full'} direction={'column'} gap={'4'} backgroundColor={'#8B7B25'} rounded={'xl'} py={'6'} align={'center'} justify={'center'} marginBottom={'6'}>
                    <Heading fontSize={'18px'} fontWeight={'bold'} color={'white'}>Layanan Kami</Heading>
                    <Flex gapX={'10'} width={'full'} justifyContent={'center'} align={'center'}>
                        {
                            listLayanan.map((l) => {
                                return (
                                    <Flex
                                        maxWidth={'1/3'} align={'center'} justify={'center'} backgroundColor={'white'}
                                        direction={'column'} p={'2'} rounded={'xl'} border={'2px solid black'}>
                                        <img
                                            src="/img/hugeicons_zakat.png"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                marginBottom: '16px'
                                            }} />
                                        <Heading fontWeight={'bold'} fontSize={'14px'} marginBottom={'16px'}>{l.title}</Heading>
                                        <Text textAlign={'center'} fontSize={'11px'} marginBottom={'12px'}>{l.description}</Text>
                                        <Link href={l.href}>
                                            <NavigationButton
                                                label="Selengkapnya"
                                                backgroundColor="#8B7B25"
                                            />
                                        </Link>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                </Flex>
                <Flex width={'full'}>
                    <Text fontSize={'18px'} fontWeight={'bold'} color={'#8B7B25'}>Berita Program</Text>
                </Flex>

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

                <Flex width={'full'} align={'center'} justify={'center'}>
                    <Link href={`/client/news`}>
                        <NavigationButton
                            label="Lebih Lanjut"
                            backgroundColor="#8B7B25"
                        />
                    </Link>
                </Flex>

                <Flex width={'full'} backgroundColor={'#8B7B25'} justify={'space-between'} px={'60px'} py={'20px'} height={'200px'} align={'center'}>
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
        </Flex>
    );
}
