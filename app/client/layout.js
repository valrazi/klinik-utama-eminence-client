"use client";
import FooterClient from "@/components/ui/atomics/FooterClient";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }) {
  const pathName = usePathname();

  return (
    <Flex width="full" direction="column" align="center" backgroundColor={'gray.200'}>
      {/* Wrapper */}
      <Flex
        backgroundColor={'white'}
        direction="column"
        minH="100vh"        // full viewport height
        width="full"
        maxW="567px"       // constrain inner content
      >
        {/* Navbar */}
        <Box as="nav" p={4} bg="gray.900">
          <img src="/img/logo_large.png" style={{
            width: '160px',
            margin:'auto'
          }}/>
        </Box>

        {/* Main content */}
        <Flex flex="1" direction="column" p={4} backgroundColor={'gray.50'}>
          {children}
        </Flex>

        {/* Sticky Footer */}
        {!pathName.startsWith("/client/receipt") && <FooterClient />}
      </Flex>
    </Flex>
  );
}
