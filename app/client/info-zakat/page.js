"use client";

import FooterClient from "@/components/ui/atomics/FooterClient";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import Empty from "@/components/ui/molecules/Empty";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GiRotaryPhone } from "react-icons/gi";
import { FaArrowCircleLeft } from "react-icons/fa";


export default function BackofficePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        }
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
                <Box width={'full'} mt={'2'}>
                    <Link href={'/client'}>
                        <FaArrowCircleLeft color="#8B7B25" fontSize={'20px'} />
                    </Link>
                </Box>
                <Text fontSize={'18px'} fontWeight={'bold'} color="#8B7B25">
                    Pengertian Zakat
                </Text>

                <Text fontSize={'14px'}>
                    Zakat adalah kewajiban bagi setiap Muslim yang mampu untuk mengeluarkan sebagian hartanya kepada orang-orang yang berhak menerimanya (asnaf). Zakat merupakan salah satu dari rukun Islam dan memiliki fungsi spiritual (mensucikan jiwa) serta sosial (mengurangi kesenjangan).<br></br><br></br>
                    Secara bahasa, zakat berarti "bersih", "suci", "berkah", dan "tumbuh".<br></br><br></br>
                    Secara istilah, zakat adalah sejumlah harta tertentu yang wajib dikeluarkan oleh seorang Muslim dan diberikan kepada golongan yang berhak menerimanya sesuai syariat.
                </Text>

                <Box width={'full'} mt={'2'}>
                    <Text fontSize={'18px'} fontWeight={'bold'} color="#8B7B25">
                        Hadis Tentang Zakat
                    </Text>
                </Box>

                <Text fontSize={'14px'}>
                    1. Hadis Shahih Bukhari:<br></br>
                    “Islam dibangun atas lima perkara: bersaksi bahwa tiada Tuhan selain Allah dan Muhammad adalah utusan Allah, mendirikan salat, menunaikan zakat, berpuasa di bulan Ramadan, dan berhaji ke Baitullah.”<br></br>
                    — (HR. Bukhari & Muslim)<br></br><br></br>
                    2. Hadis Tentang Pembersihan Jiwa:<br></br>
                    "Ambillah zakat dari sebagian harta mereka, dengan zakat itu kamu membersihkan dan mensucikan mereka..."<br></br>
                    — (QS. At-Taubah: 103)    
                </Text>

                    <Box width={'full'} mt={'2'}>
                        <Text fontSize={'18px'} fontWeight={'bold'} color="#8B7B25">
                            Manfaat Zakat
                        </Text>
                    </Box>
                    <Text fontSize={'14px'} width={'full'}>
                        1. Mensucikan harta dan jiwa<br></br>
                        2. Menunaikan salah satu rukun Islam<br></br>
                        3. Membantu fakir miskin dan golongan yang berhak<br></br>
                        4. Menumbuhkan keberkahan dan keadilan sosial
                    </Text>
                    
            </Flex>
        </Flex>
    );
}
