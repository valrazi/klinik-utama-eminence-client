"use client"
import FooterClient from "@/components/ui/atomics/FooterClient";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function AuthLayout({children}) {
    const pathName = usePathname()
    return (
        <Flex width={'full'} minHeight={'dvh'} direction={'column'} align={'center'} justify={'center'}>
            <Flex direction={'column'} minHeight={'dvh'} width={'1/2'} maxWidth={'567px'} marginBottom={'4'}>
                <Box  p={'6'} backgroundColor={'#8B7B25'} roundedBottom={'4xl'}>
                    <Heading fontSize={'xl'} fontWeight={'bold'} textAlign={'center'} color={'white'}>Masjid Al Furqon Bekasi</Heading>
                </Box>
                {children}
                
                {
                    !pathName.startsWith('/client/payment-detail')
                    ? (
                        <FooterClient/>
                    )
                    : null
                }
            </Flex>
        </Flex>
    )
}