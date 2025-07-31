"use client"
import { Box, Container, Flex, Heading, VStack, Input, Button, Text } from "@chakra-ui/react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  FormErrorIcon,
} from "@chakra-ui/form-control"
import { useState } from "react";
import {signIn} from 'next-auth/react'
import { useRouter } from "next/navigation";

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

    if(res.error) {
      setError("Invalid email or password")
      setIsLoading(false)
    } else {
      router.push('/backoffice')
    }
  };
  return (
    <Box m={'auto'} width={'full'} display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
        <VStack as="form" spacing={8} onSubmit={handleSubmit} width={'full'}>
          {error && <Text color="red.500">{error}</Text>}

          <Box width={'full'}>
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

          <Button loading={isLoading} backgroundColor={'#8B8A25'} color={'white'} onClick={handleSubmit} w="full" rounded={'lg'}>
            Login
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}