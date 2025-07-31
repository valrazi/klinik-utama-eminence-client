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
                    Pengertian Infaq
                </Text>

                <Text fontSize={'14px'}>
                    Infaq adalah pengeluaran harta yang dilakukan seorang Muslim di jalan Allah tanpa batasan jumlah dan tanpa syarat tertentu seperti pada zakat. Infaq dapat dilakukan kapan saja, oleh siapa saja yang mampu, dan kepada siapa saja yang membutuhkan — tidak harus menunggu mencapai nisab atau haul.<br></br><br></br>
                    Berbeda dengan zakat yang wajib, infaq hukumnya sunnah, namun sangat dianjurkan karena mendatangkan pahala dan keberkahan dalam hidup.
                </Text>

                <Box width={'full'} mt={'2'}>
                    <Text fontSize={'18px'} fontWeight={'bold'} color="#8B7B25">
                        Dalil dan Hadis Tentang Infaq
                    </Text>
                </Box>

                <Text fontSize={'14px'}>
                    1. QS. Al-Baqarah: 261<br></br>
                    "Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir biji yang menumbuhkan tujuh tangkai, pada tiap-tiap tangkai ada seratus biji. Allah melipatgandakan (pahala) bagi siapa yang Dia kehendaki..."<br></br><br></br>

                    2. HR. Muslim<br></br>
                    “Sedekah (infaq) tidak akan mengurangi harta. Allah akan menambah kemuliaan kepada orang yang suka memberi.”<br></br>
                    — (HR. Muslim No. 2588)
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
