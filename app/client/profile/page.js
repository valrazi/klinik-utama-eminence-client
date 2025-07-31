"use client";

import FooterClient from "@/components/ui/atomics/FooterClient";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import Empty from "@/components/ui/molecules/Empty";
import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiRotaryPhone } from "react-icons/gi";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FormLabel } from "@chakra-ui/form-control";
import axios from "axios";
import { GET } from '@/app/api/auth/[...nextauth]/route'

export default function BackofficePage() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { data: session, status, update } = useSession(GET);
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

    if (status === "loading") {
        return <p>Loading...</p>;
    }

    const fetchUser = async () => {
        try {
            setIsLoading(true)
            console.log(session.accesToken);
            const data = await axios.get(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${session.accesToken}`
                }
            })
            const { user } = data.data
            setNama(user.nama_lengkap)
            setJenisKelamin(user.jenis_kelamin)
            setNoTelpon(user.no_telepon)
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
        if (!nama || !jenisKelamin || !noTelpon) {
            setError("Lengkapi form terlebih dahulu!");
            return;
        }

        try {
            setIsLoading(true)
            console.log(session.accesToken);
            await axios.put(`${API_URL}/auth/me`, {
                nama_lengkap: nama,
                jenis_kelamin: jenisKelamin,
                no_telepon: noTelpon,
            }, {
                headers: {
                    Authorization: `Bearer ${session.accesToken}`
                }
            })
            alert('Update informasi berhasil')
            await update({
                ...session,
                user: {
                    ...session.user,
                    nama_lengkap: nama,
                    jenis_kelamin: jenisKelamin,
                    no_telepon: noTelpon,
                },
            });
        } catch (error) {
            console.log(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }


    };

    const handleLogout = async (e) => {
        await signOut({
            callbackUrl: '/auth/login-client',
        })
    }

    return (
        <Flex direction={'column'} width={'full'}>
            <Box as="form" onSubmit={handleSubmit} mt={'8'} width={'full'} display="flex" alignItems="center" justifyContent="center" flexDirection={'column'}>
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



                    </VStack>
                </Box>
                <Button loading={isLoading} backgroundColor={'#8B8A25'} color={'white'} onClick={handleSubmit} w="full" rounded={'lg'} marginBottom={'4'}>
                    Edit Profil
                </Button>

                <Button loading={isLoading} backgroundColor={'red.700'} color={'white'} onClick={handleLogout} w="full" rounded={'lg'}>
                    Keluar
                </Button>
            </Box>
        </Flex>
    );
}
