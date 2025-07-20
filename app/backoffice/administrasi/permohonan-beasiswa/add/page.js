"use client"
import Container from "@/components/ui/atomics/Container";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import {
    Button, Flex, Heading, Text,
    Input,
    VStack,
    Image,
    HStack,
    Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/form-control'
import axios from "axios";
import { useRouter } from "next/navigation";
export default function DataLayananKontakAddPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm()
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        const formData = new FormData()
        for (const key in data) {
            const value = data[key]

            if (value instanceof FileList) {
                if (value.length > 0) {
                    formData.append(key, value[0])
                }
            } else {
                formData.append(key, value)
            }
        }
        console.log(data);

        try {
            setLoading(true)
            await axios.post(`${API_URL}/scholarship`, {
                ...data
            })
            alert('Form submitted successfully!')
            reset()
        } catch (err) {
            console.error('Submit error:', err)
            alert('Form submission failed.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <Container title={'Permohonan Beasiswa'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/administrasi/permohonan-beasiswa')
                        }}
                        label="Kembali" />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <Heading fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Data Siswa</Heading>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <HStack gapX={'2rem'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.nama_lengkap} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Lengkap</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nama_lengkap', { required: 'Nama Lengkap wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_lengkap?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Nama Mata Pelajaran */}
                                <FormControl isInvalid={errors.email} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Email</FormLabel>
                                    <Input
                                        type="text"
                                        border="1px solid gray"
                                        {...register('email', {
                                            required: 'Email wajib diisi',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Format email tidak valid',
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.email?.message}
                                    </FormErrorMessage>
                                </FormControl>


                                {/* No. Telepon */}
                                <FormControl isInvalid={errors.no_telepon} style={{ width: '100%' }}>
                                    <FormLabel>No. Telepon</FormLabel>
                                    <Input
                                        border={'1px solid gray'}
                                        type="text"
                                        {...register('no_telepon', {
                                            required: 'No. Telepon wajib diisi',
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: 'Hanya boleh angka',
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.no_telepon?.message}</FormErrorMessage>
                                </FormControl>
                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                <FormControl isInvalid={errors.isi_pesan} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Isi Pesan</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('isi_pesan', { required: 'Isi Pesan wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.isi_pesan?.message}</FormErrorMessage>
                                </FormControl>

                            </VStack>

                        </HStack>

                        <NavigationButton
                            loading={loading ? true : false}
                            backgroundColor={'yellow'}
                            color={'black'}
                            type="submit"
                            width={'100px'}
                            label="Simpan" />
                    </VStack>
                </form>
            </Flex>
        </Container>
    )
}