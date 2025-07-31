"use client"
import { Box, Container, Flex, Heading, VStack, Input, Button, Text, Span, Select } from "@chakra-ui/react";
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
import axios from "axios";

export default function RegisterPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [nama, setNama] = useState(null);
  const [jenisKelamin, setJenisKelamin] = useState(null);
  const [noTelpon, setNoTelpon] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Example: check empty (replace this with your login logic)
    if (!email || !password || !nama || !jenisKelamin || !noTelpon) {
      setError("Lengkapi form terlebih dahulu!");
      return;
    }

    try {
      setIsLoading(true)
      await axios.post(`${API_URL}/auth/register`, {
        nama_lengkap: nama,
        jenis_kelamin: jenisKelamin,
        no_telepon: noTelpon,
        email,
        password
      })
      alert('Register akun berhasil!')
      router.push('/auth/login-client')
    } catch (error) {
      setError(error)
    }finally {
      setIsLoading(false)
    }

    
  };
  return (
    <Box as="form" onSubmit={handleSubmit} m={'auto'} width={'full'} display="flex" alignItems="center" justifyContent="center" flexDirection={'column'}>
      <Box bg="white" p={8} mb={'3'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
        <VStack spacing={8} width={'full'}>
          {error && <Text color="red.500">{error}</Text>}
          <Box width={'full'}>
            <FormLabel>Nama Lengkap</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan Nama Lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              w="full"
              border={'1px solid gray'}
              p={'1'}
            />
          </Box>

          <Box width={'full'}>
            <FormLabel>Jenis Kelamin</FormLabel>
            <select
              placeholder="Masukkan Jenis Kelamin"
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid gray',
                borderRadius: '6px',
              }}>
                
              <option value="" selected disabled>Masukkan Jenis Kelamin</option>
              <option value={'male'}>Laki - Laki</option>
              <option value={'female'}>Perempuan</option>
            </select>
          </Box>

          <Box width={'full'}>
            <FormLabel>No Telepone</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan No Telepone"
              value={noTelpon}
              onChange={(e) => setNoTelpon(e.target.value)}
              w="full"
              border={'1px solid gray'}
              p={'1'}
            />
          </Box>

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



        </VStack>
      </Box>
      <Box width={'full'} mb={'3'}>
        <Text>Sudah memiliki akun ? <Span color={'#8B7B25'}><Link href={'/auth/login-client'}>Login</Link></Span></Text>
      </Box>
      <Button loading={isLoading} backgroundColor={'#8B8A25'} color={'white'} onClick={handleSubmit} w="full" rounded={'lg'}>
        Register
      </Button>
    </Box>
  )
}