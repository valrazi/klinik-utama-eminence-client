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
        try {
            setLoading(true)
            await axios.post(`${API_URL}/expense`, formData)
            alert('Form submitted successfully!')
            reset()
        } catch (err) {
            console.error('Submit error:', err)
            alert('Form submission failed.')
        } finally {
            setLoading(false)
        }
    }

    const watchImage = watch('foto')

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
        <Container title={'Tambah Pengeluaran'}>
            <Flex gapX={'4'} w={'full'} justify={'end'} px={'5'}>
                <NavigationButton
                    onClick={() => {
                        router.push('/backoffice/dana-keluar')
                    }}
                    backgroundColor="#8B7B25"
                    label="Kembali" />
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <HStack gapX={'2rem'} align={'start'} justify={'start'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'} h={'full'}>

                                <FormControl isInvalid={errors.judul_pengeluaran} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Judul Pembayaran</FormLabel>
                                    <Input
                                        {...register('judul_pengeluaran', { required: 'Judul Pembayaran' })}
                                        border="1px solid gray" />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.judul_pengeluaran?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.jenis_pengeluaran} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Jenis Pembayaran</FormLabel>
                                    <select
                                        {...register('jenis_pengeluaran', { required: 'Jenis Pembayaran wajib dipilih' })}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid gray',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <option value="" selected disabled>-- Pilih Jenis Pembayaran --</option>
                                        <option value={'Zakat Fitrah Uang'}>Zakat Fitrah Uang</option>
                                        <option value={'Zakat Fitrah Beras'}>Zakat Fitrah Beras</option>
                                        <option value={'Zakat Maal'}>Zakat Maal</option>
                                        <option value={'Infaq'}>Infaq</option>
                                    </select>
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.jenis_pengeluaran?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.nominal_pengeluaran} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nominal Pembayaran</FormLabel>
                                    <Input
                                        type="number"
                                        {...register('nominal_pengeluaran', { required: 'Nominal Pembayaran' })}
                                        border="1px solid gray" />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nominal_pengeluaran?.message}</FormErrorMessage>
                                </FormControl>

                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                <FormControl isInvalid={errors.pesan_pengeluaran} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Pesan Pengeluaran</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('pesan_pengeluaran', { required: 'Pesan Pengeluaran wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.pesan_pengeluaran?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Foto Mahasiswa */}
                                <FormControl isInvalid={errors.foto} p={'4em'} style={{ borderRadius: '1rem' }} border={'1px solid black'}>
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

                                    <FormLabel>Bukti Pembayaran</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        {...register('foto', {
                                            required: 'Foto Berita wajib diunggah',
                                            validate: {
                                                isImage: (files) =>
                                                    files[0] &&
                                                    files[0].type.startsWith('image/') ||
                                                    'File harus berupa gambar',
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.foto?.message}</FormErrorMessage>


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