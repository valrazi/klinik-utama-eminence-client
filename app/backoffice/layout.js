'use client'
import AdminSidebar from "@/components/ui/admin/sidebar"
import { Avatar, Flex, Heading, Text } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function BackofficeLayout({
    children
}) {
    const pathName = usePathname()
    const formatPath = pathName.split('/')[2]
    const session = useSession()
    return (
        <Flex direction={'column'}>
            <Flex width={'full'} px={'4'} py={'4'} justify={'space-between'} backgroundColor={'black'}>
                <img src="/img/logo.png" />
                <Flex gapX={'2'} align={'center'} px={'4'}>
                    <Avatar.Root backgroundColor={'yellow'} color={'black'} size={'sm'}>
                        <Avatar.Fallback name={session.data?.user.email} />
                    </Avatar.Root>
                    <Text fontSize={'12px'} color={'white'}>{session.data?.user.email}</Text>
                </Flex>
            </Flex>
            <Flex width={'full'}>
                <AdminSidebar pathName={formatPath} originalPathname={pathName} />
                <Flex direction={'column'} padding={'40px'} width={'full'}>
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
}