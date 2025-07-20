import { Flex } from "@chakra-ui/react";

export default function AuthLayout({children}) {
    return (
        <Flex width={'full'} height={'dvh'} direction={'column'} >
            <Flex width={'full'} px={'4'} py={'4'} justify={'space-between'} backgroundColor={'black'}>
                <img src="/img/logo.png"/>
            </Flex>
            {children}
        </Flex>
    )
}