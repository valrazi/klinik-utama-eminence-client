"use client";

import { Flex, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FaAlignLeft, FaClockRotateLeft, FaUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";

export default function FooterClient() {
  const pathName = usePathname();

  const listNavigation = [
    {
      icon: FaClockRotateLeft,
      href: "/client/history",
      title: "History",
    },
    {
      icon: FaAlignLeft,
      href: "/client",
      title: "Reservasi",
    },
    {
      icon: FaUser,
      href: "/client/profile",
      title: "Profile",
    },
  ];

  return (
    <Flex
      as="footer"
      mt="auto"
      w="full"
      bg="gray.900"
      justify="space-around"
      p={4}
      align="center"
      shadow="lg"
      position="sticky"
      bottom="0"
      zIndex="10"
    >
      {listNavigation.map((n) => {
        const isActive = pathName === n.href;

        return (
          <Link key={n.href} href={n.href}>
            <Flex
              direction="column"
              align="center"
              gap={2}
              color={isActive ? "red.500" : "white"} // 👈 active page red
              _hover={{ color: "red.500" }}
              transition="color 0.2s ease-in-out"
            >
              <Icon as={n.icon} boxSize="6" />
              <Text fontWeight="bold" fontSize="12px">
                {n.title}
              </Text>
            </Flex>
          </Link>
        );
      })}
    </Flex>
  );
}
