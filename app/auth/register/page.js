"use client"
import { Box, VStack, Input, Button, Text, Span, Switch } from "@chakra-ui/react";
import {
  FormLabel,
} from "@chakra-ui/form-control"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

export default function RegisterPage() {
  const [nama, setNama] = useState(null);
  const [jenisKelamin, setJenisKelamin] = useState(null);
  const [noTelpon, setNoTelpon] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isExisting, setIsExisting] = useState(false);
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
      await axios.post(`/api/auth/register`, {
        name: nama,
        email,
        whatsapp_number: noTelpon,
        password,
        gender: jenisKelamin,
        existing_patient: isExisting
      })
      alert('Register akun berhasil!')
      router.push('/auth/login')
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
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
                backgroundColor: 'transparent',
              }}>

              <option value="" selected disabled style={{color: 'gray'}}>Masukkan Jenis Kelamin</option>
              <option style={{color: 'black'}} value={'male'}>Laki - Laki</option>
              <option style={{color: 'black'}} value={'female'}>Perempuan</option>
            </select>
          </Box>

          <Box width={'full'}>
            <FormLabel>No Telepon</FormLabel>
            <Input
              type="text"
              placeholder="Masukkan No Telepon"
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

          <Box width={'full'}>
            <FormLabel>Status Pelanggan</FormLabel>
            <Switch.Root
              checked={isExisting}
              onCheckedChange={(e) => setIsExisting(e.checked)}
              colorPalette='red'
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Label>
                {
                  isExisting
                  ? 'Pelanggan Lama'
                  : 'Pelanggan Baru'
                }
              </Switch.Label>
              <Switch.Label />
            </Switch.Root>
          </Box>

        </VStack>
      </Box>
      <Box width={'full'} mb={'3'}>
        <Text>Sudah memiliki akun ? <Span color={'red'}><Link href={'/auth/login-client'}>Login</Link></Span></Text>
      </Box>
      <Button loading={isLoading} backgroundColor={'white'} color={'black'} onClick={handleSubmit} w="full" rounded={'lg'}>
        Register
      </Button>
    </Box>
  )
}