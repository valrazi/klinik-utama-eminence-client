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

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password
    })

    if(res.error) {
      setError("Invalid email or password")
    } else {
      router.push('/backoffice')
    }
  };
  return (
    <Box m={'auto'} width={'50%'} display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={8} rounded="xl" shadow="md" border={'1px solid black'} w="full" maxW="sm">
        <VStack as="form" spacing={8} onSubmit={handleSubmit} width={'full'}>
          <Heading size="xl" fontWeight={'bold'} borderBottom={'1px solid black'}>Masuk Backoffice</Heading>
          {error && <Text color="red.500">{error}</Text>}

          <Box width={'full'}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              w="full"
              border={'1px solid gray'}
              p={'1'}
            />
          </Box>

          <Button loading={isLoading} backgroundColor={'black'} color={'white'} onClick={handleSubmit} w="full">
            Login
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}