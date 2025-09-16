import { Box, Flex, Heading } from "@chakra-ui/react";

export default function AuthLayout({children}) {
    return (
        <Flex width={'full'} height={'dvh'} direction={'column'} align={'center'} justify={'center'} backgroundColor={'gray.900'}>
            <Flex direction={'column'} height={'dvh'} width={'1/2'} maxWidth={'567px'}>
                {children}
            </Flex>
        </Flex>
    )
}