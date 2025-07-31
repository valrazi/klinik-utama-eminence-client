import { Box, Flex, Heading } from "@chakra-ui/react";

export default function AuthLayout({children}) {
    return (
        <Flex width={'full'} height={'dvh'} direction={'column'} align={'center'} justify={'center'}>
            <Flex direction={'column'} height={'dvh'} width={'1/2'} maxWidth={'567px'}>
                <Box  p={'6'} backgroundColor={'#8B7B25'} roundedBottom={'4xl'}>
                    <Heading fontSize={'xl'} fontWeight={'bold'} textAlign={'center'} color={'white'}>Masjid Al Furqon Bekasi</Heading>
                </Box>
                {children}
            </Flex>
        </Flex>
    )
}