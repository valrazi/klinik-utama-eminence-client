"use client";

import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormLabel } from "@chakra-ui/form-control";
import axios from "axios";

export default function ProfilePage() {

    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [nama, setNama] = useState(null);
    const [jenisKelamin, setJenisKelamin] = useState(null);
    const [noTelpon, setNoTelpon] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        } else {
            fetchUser()
        }
        console.log({ session });
    }, [session, status, router]);


    const fetchUser = async () => {
        try {
            setIsLoading(true)
            console.log(session.accesToken);
            const data = await axios.get(`/api/auth/me`)
            const { user } = data.data
            console.log({user});
            setNama(user.name)
            setJenisKelamin(user.gender)
            setNoTelpon(user.whatsapp_number)
        } catch (error) {
            console.log(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Example: check empty (replace this with your login logic)
        if (!nama || !noTelpon) {
            setError("Lengkapi form terlebih dahulu!");
            return;
        }

        try {
            setIsLoading(true)
            await axios.put(`/api/auth/me`, {
                nama_lengkap: nama,
                no_telepon: noTelpon,
            })
            alert('Update informasi berhasil')
        } catch (error) {
            console.log(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }


    };

    const handleLogout = async (e) => {
        await signOut({
            callbackUrl: '/auth/login',
        })
    }

    return (
        <Flex direction={'column'} width={'full'}>
            <Box as="form" onSubmit={handleSubmit} mt={'8'} width={'full'} display="flex" alignItems="center" justifyContent="center" flexDirection={'column'}>
                <VStack spacing={8} width={'full'} my={'4'}>
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
                                disabled
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



                    </VStack>
                <Button loading={isLoading} backgroundColor={'black'} color={'white'} _hover={{color: 'red'}} onClick={handleSubmit} w="full" rounded={'lg'} marginBottom={'4'}>
                    Edit Profil
                </Button>

                <Button loading={isLoading} backgroundColor={'red.700'} color={'white'} _hover={{color: 'black'}} onClick={handleLogout} w="full" rounded={'lg'}>
                    Keluar
                </Button>
            </Box>
        </Flex>
    );
}
