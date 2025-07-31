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
            <Flex width={'full'}>
                <AdminSidebar pathName={formatPath} originalPathname={pathName} />
                <Flex direction={'column'} padding={'40px'} width={'full'}>
                    {children}
                </Flex>
            </Flex>
        </Flex>
    )
}