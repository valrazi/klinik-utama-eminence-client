import { Flex, Heading, Table, Text } from "@chakra-ui/react";
import Link from "next/link";
import { GiRotaryPhone } from "react-icons/gi";

export default function FooterClient() {
    const listNavigation = [
        {
            src: '/img/home_logo.png',
            href: '/client',
            title: 'Home'
        },
        {
            src: '/img/form_client_logo.png',
            href: '/client/payment',
            title: 'Pembayaran'
        },
        {
            src: '/img/profile_logo.png',
            href: '/client/profile',
            title: 'Profile'
        },
    ]
    return (
        <Flex mt={'6'} width={'full'} backgroundColor={'white'} justify={'space-evenly'} p={'4'} align={'center'} border={'2px solid gray'} shadow={'lg'}>
            {
                listNavigation.map((n) => {
                    return (
                        <Link href={n.href}>
                            <Flex direction={'column'} align={'center'}>
                                <img src={n.src}/>
                                <Text fontWeight={'bold'} fontSize={'12px'}>{n.title}</Text>
                            </Flex>
                        </Link>
                    )
                })
            }
        </Flex>
    );
}
