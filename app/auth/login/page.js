"use client"
import { Box, Container, Flex, Heading, VStack, Input, Button, Text, Span } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  FormErrorIcon,
} from "@chakra-ui/form-control"
import { useState } from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example: check empty (replace this with your login logic)
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true)

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })
    setIsLoading(false)
    if (res.error) {
      setError("Invalid email or password")
    } else {
      router.push('/client')
    }
  };
  return (
    <Box color={'white'} as="form" onSubmit={handleSubmit} m={'auto'} width={'full'} display="flex" alignItems="center" justifyContent="center" flexDirection={'column'}>
      <Box bg="transparent" p={8} mb={'3'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
        <Box p={'6'} rounded={'lg'} display={'flex'} justifyContent={'center'} alignContent={'center'}>
          <img src="/img/logo_large.png" style={{ width: '200px' }} />
        </Box>
        <VStack spacing={8} width={'full'}>
          {error && <Text color="red.500">{error}</Text>}

          <Box width={'full'} color={'white'}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              w="full"
              border={'1px solid gray'}
              p={'1'}
            />
          </Box>

          <Box width={'full'}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              w="full"
              border={'1px solid gray'}
              p={'1'}
            />
          </Box>

        </VStack>
      </Box>
      <Box width={'full'} mb={'3'}>
        <Text>Belum memiliki akun ? <Span color={'red.600'}><Link href={'/auth/register'}>Daftar</Link></Span></Text>
      </Box>
      <Button loading={isLoading} backgroundColor={'gray.100'} color={'black'} onClick={handleSubmit} w="full" rounded={'lg'}>
        Login
      </Button>
    </Box>
  )
}