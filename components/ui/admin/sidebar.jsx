"use client"
import { Accordion, Box, Button, Flex, Heading, Icon, Span } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import '@/css/admin-sidebar.css'
import { IoGrid, IoLogOut } from "react-icons/io5";

export default function AdminSidebar({
    pathName,
    originalPathname
}) {
    const router = useRouter()
    const { data: session } = useSession();
    const userRole = session?.user?.role;

    const isSuperAdmin = userRole === 'superadmin';
    const sidebarList = [
        {
            title: 'Dana Masuk',
            href: 'dana-masuk',
            imgSrc: <IoGrid />,
            isAccordion: false,
            isSuperAdmin: false
        },
        {
            title: 'Dana Keluar',
            href: 'dana-keluar',
            imgSrc: <IoGrid />,
            isAccordion: false,
            isSuperAdmin: true
        },
        {
            title: 'Berita Program',
            href: 'berita-laporan',
            imgSrc: <IoGrid />,
            isAccordion: false,
            isSuperAdmin: false
        },
        // {
        //     title: 'Akademik',
        //     href: 'akademik',
        //     imgSrc: <IoCalendar />,
        //     isAccordion: true,
        //     isSuperAdmin: true,
        //     accordionList: [
        //         { value: 'prestasi-siswa', title: 'Prestasi Siswa', isSuperAdmin: true },
        //         { value: 'osis', title: 'OSIS', isSuperAdmin: false },
        //         { value: 'kalender-akademik', title: 'Kalender Akademik', isSuperAdmin: false },
        //         { value: 'jadwal-pelajaran', title: 'Jadwal Pelajaran', isSuperAdmin: false }
        //     ]
        // },
        // {
        //     title: 'Administrasi',
        //     href: 'administrasi',
        //     imgSrc: <IoBriefcase />,
        //     isAccordion: true,
        //     isSuperAdmin: true,
        //     accordionList: [
        //         { value: 'keterangan-siswa', title: 'Keterangan Siswa', isSuperAdmin: false },
        //         { value: 'permohonan-beasiswa', title: 'Permohonan Beasiswa', isSuperAdmin: false },
        //         { value: 'alumni-sekolah', title: 'Alumni Sekolah', isSuperAdmin: true },
        //     ]
        // },
        // {
        //     title: 'Layanan Kontak',
        //     href: 'layanan-kontak',
        //     imgSrc: <IoNotifications />,
        //     isAccordion: false,
        //     isSuperAdmin: false
        // },
    ];


    const logout = async () => {
        await signOut({
            redirect: false
        })
        router.push('/auth/login-backoffice')
    }
    return (
        <Flex bg="#8B7B25" minH="100vh" direction="column" py={20} px={4} gap={1} w="1/4">
            {sidebarList
                .filter(item => (isSuperAdmin ? item.isSuperAdmin : item.href != 'dashboard'))
                .map((item) => {
                    const isActive = pathName === item.href;

                    if (!item.isAccordion) {
                        return (
                            <Link key={item.href} href={`/backoffice/${item.href}`}>
                                <Flex
                                    px={4}
                                    py={2}
                                    align="center"
                                    bg={isActive ? 'white' : 'transparent'}
                                    borderRadius="md"
                                    gap={4}
                                >
                                    <Icon color={isActive ? '#8B7B25' : 'white'}>{item.imgSrc}</Icon>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: isActive ? '#8B7B25' : 'white' }}>
                                        {item.title}
                                    </span>
                                </Flex>
                            </Link>
                        );
                    }

                    const filteredAccordion = item.accordionList.filter(sub =>
                        isSuperAdmin ? sub.isSuperAdmin : true
                    );

                    if (filteredAccordion.length === 0) return null;

                    return (
                        <Accordion.Root allowMultiple key={item.href}>
                            <Accordion.Item border="none" width={"full"}>
                                <Accordion.ItemTrigger
                                    px={4}
                                    py={2}
                                    bg={isActive ? 'white' : 'transparent'}
                                    borderRadius="md"
                                    width={"full"}
                                    _hover={{ bg: isActive ? 'white' : 'gray.700' }}
                                >
                                    <Flex align="center" justify="space-between" flex="1" width={'full'} n>
                                        <Flex align="center" gap={4}>
                                            <Icon color={isActive ? 'black' : 'white'}>{item.imgSrc}</Icon>
                                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: isActive ? 'black' : 'white' }}>
                                                {item.title}
                                            </span>
                                        </Flex>
                                        <Accordion.ItemIndicator style={{ color: item.href == pathName ? 'black' : 'white' }} />
                                    </Flex>
                                </Accordion.ItemTrigger>
                                <Accordion.ItemContent pl={8} display="flex" flexDir="column" gap={2}>
                                    <Accordion.ItemBody justifyContent={'start'} paddingX={'1rem'} display={'flex'} flexDir={'column'} alignContent={'start'} gapY={'1rem'}>
                                        {filteredAccordion.map((sub) => {
                                            const subHref = `/backoffice/${item.href}/${sub.value}`;
                                            const isSubActive = originalPathname === subHref;
                                            return (
                                                <Link key={sub.value} href={subHref} style={{
                                                    backgroundColor: isSubActive ? 'white' : 'transparent',
                                                    color: isSubActive ? 'black' : 'white',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '0.375rem',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}>
                                                    <span
                                                    >
                                                        {sub.title}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </Accordion.ItemBody>
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        </Accordion.Root>
                    );
                })}

            <Button
                bg="transparent"
                onClick={logout}
                size="xs"
                rounded="lg"
                color={'white'}
            >
                <Flex w={'full'} gap={'3'} align={'center'} pl={'4'}>
                    <Icon size={'md'}><IoLogOut/></Icon>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        transform: 'translate(0, 2px)'
                    }}>Keluar</span>
                </Flex>
            </Button> 
        </Flex>
    )
}