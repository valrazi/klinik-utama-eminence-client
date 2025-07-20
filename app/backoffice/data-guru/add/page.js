"use client"
import Container from "@/components/ui/atomics/Container";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import {
    Button, Flex, Heading, Text,
    Input,
    VStack,
    Image,
    HStack,
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
export default function DataGuruAddPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [imagePreview, setImagePreview] = useState(null)
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
        formData.append('nama_lengkap', data.nama_lengkap)
        formData.append('nama_mapel', data.nama_mapel)
        formData.append('no_telepon', data.no_telepon)
        formData.append('foto_mahasiswa', data.foto_mahasiswa[0])

        try {
            setLoading(true)
            await axios.post(`${API_URL}/teacher`, formData)
            alert('Form submitted successfully!')
            reset()
        } catch (err) {
            console.error('Submit error:', err)
            alert('Form submission failed.')
        } finally {
            setLoading(false)
        }
    }

    const watchImage = watch('foto_mahasiswa')

    useEffect(() => {
        const file = watchImage && watchImage[0]
        if (file) {
            const fileType = file['type']
            if (fileType.startsWith('image/')) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreview(reader.result)
                }
                reader.readAsDataURL(file)
            } else {
                setImagePreview(null)
            }
        } else {
            setImagePreview(null)
        }
    }, [watchImage])

    return (
        <Container title={'Tambah Data Guru'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => { 
                            router.push('/backoffice/data-guru')
                        }}
                        label="Kembali" />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <Heading fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Data Profil Guru</Heading>

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
                                <FormControl isInvalid={errors.nama_mapel} style={{ width: '100%' }}>
                                    <FormLabel>Nama Mata Pelajaran</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nama_mapel', { required: 'Nama Mata Pelajaran wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_mapel?.message}</FormErrorMessage>
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

                            {/* Foto Mahasiswa */}
                            <FormControl isInvalid={errors.foto_mahasiswa} p={'4em'} style={{ borderRadius: '1rem' }} border={'1px solid black'}>
                                {imagePreview && (
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        mt={2}
                                        boxSize="150px"
                                        objectFit="cover"
                                        borderRadius="md"
                                    />
                                )}

                                <FormLabel>Foto Guru</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...register('foto_mahasiswa', {
                                        required: 'Foto Guru wajib diunggah',
                                        validate: {
                                            isImage: (files) =>
                                                files[0] &&
                                                files[0].type.startsWith('image/') ||
                                                'File harus berupa gambar',
                                        },
                                    })}
                                />
                                <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.foto_mahasiswa?.message}</FormErrorMessage>


                            </FormControl>
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