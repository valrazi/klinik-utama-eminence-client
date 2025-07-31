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
import { useParams, useRouter } from "next/navigation";
import { showConfirm, showSuccess } from "@/utils/swal";
import dayjs from "dayjs";
import Link from "next/link";
export default function DataGuruEditPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const params = useParams()
    const id = params.id

    const today = dayjs().format('YYYY-MM-DD')

    const [imagePreview, setImagePreview] = useState(null)
    const [accepted, setAccepted] = useState(false)
    const [data, setData] = useState(null)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue
    } = useForm()

    const fetchDetail = async () => {
        try {
            let data = await axios.get(`${API_URL}/payment/` + id)
            data = data.data.data
            setData(data)
            if (data) {
                for (const key in data) {
                    const value = data[key]

                    if (key == 'upload_bukti') {
                        setImagePreview(value)
                    } else if (key == 'tanggal_prestasi') {
                        setValue(key, dayjs(value).format('YYYY-MM-DD'))
                    } else if (key == 'status_terima') {
                        setAccepted(value)
                    } else if (key == 'nominal_pembayaran') {
                        setValue(key, Number(value))
                    } else {
                        setValue(key, value)
                    }
                }
            }
        } catch (error) {
            alert('Fetch news report data failed')
        }
    }
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        const formData = new FormData()
        for (const key in data) {
            const value = data[key]

            if (value instanceof FileList) {
                if (value.length > 0) {
                    formData.append(key, value[0])
                }
            } else if (key == 'nominal_pembayaran') {
                formData.append(key, Number(value))
            }
            else {
                formData.append(key, value)
            }
        }


        try {
            setLoading(true)
            await axios.put(`${API_URL}/payment/` + id, {
                nominal_pembayaran: Number(data.nominal_pembayaran)
            })
            alert('Form submitted successfully!')
            window.location.reload()
        } catch (err) {
            console.error('Submit error:', err)
            alert('Form submission failed.')
        } finally {
            setLoading(false)
        }
    }


    const acceptData = async () => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menerima Data Prestasi ini?',
            })
            if (isConfirmed) {
                await axios.put(`${API_URL}/payment/${id}`, {
                    status_terima: true,
                })
                showSuccess("Terima data success")
                router.push('/backoffice/dana-masuk')
            }
        } catch (error) {
            showError("Delete data Failed")
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

    useEffect(() => {
        fetchDetail()
    }, [])

    return (
        <Container title={'Kelola Data'}>

            <Flex px={'5'} direction={'column'}>
                <HStack justify={'space-between'}>
                    <Heading width={'fit'} fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Prestasi Siswa</Heading>

                    <Flex gapX={'3'}>
                        {
                            !accepted && (
                                <NavigationButton
                                    onClick={() => acceptData(id)}
                                    backgroundColor={'green'}
                                    color={'white'}
                                    label="Terima" />
                            )
                        }

                        <Flex gapX={'4'}>
                            <NavigationButton
                                onClick={() => {
                                    router.push('/backoffice/dana-masuk')
                                }}
                                backgroundColor="#8B7B25"
                                color="white"
                                label="Kembali" />

                        </Flex>
                    </Flex>
                </HStack>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        {
                            data && (
                                <HStack gapX={'2rem'}>
                                    <VStack width={'1/2'} justify={'start'} align={'start'}>
                                        {/* Nama Lengkap */}
                                        <FormControl isInvalid={errors.nama_prestasi} style={{ width: '100%' }}>
                                            <FormLabel fontWeight={'bold'}>Nama Lengkap</FormLabel>
                                            <Input
                                                value={data.user.nama_lengkap}
                                                border="1px solid gray"
                                                readOnly
                                                disabled />
                                            <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_prestasi?.message}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={errors.nama_prestasi} style={{ width: '100%' }}>
                                            <FormLabel fontWeight={'bold'}>Jenis Kelaminn</FormLabel>
                                            <Input
                                                value={data.user.jenis_kelamin == 'male' ? 'Laki - Laki' : 'Perempuan'}
                                                border="1px solid gray"
                                                readOnly
                                                disabled />
                                            <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_prestasi?.message}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={errors.nama_prestasi} style={{ width: '100%' }}>
                                            <FormLabel fontWeight={'bold'}>Jenis Pembayaran</FormLabel>
                                            <Input
                                                value={data.jenis_pembayaran}
                                                border="1px solid gray"
                                                readOnly
                                                disabled />
                                            <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_prestasi?.message}</FormErrorMessage>
                                        </FormControl>

                                        <FormControl isInvalid={errors.nominal_pembayaran} style={{ width: '100%' }}>
                                            <FormLabel fontWeight={'bold'}>Nominal Pembayaran</FormLabel>
                                            <Input
                                                type="number"
                                                {...register('nominal_pembayaran', { required: 'Nominal Pembayaran' })}
                                                border="1px solid gray" />
                                            <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nominal_pembayaran?.message}</FormErrorMessage>
                                        </FormControl>



                                    </VStack>

                                    <VStack width={'1/2'} justify={'start'} align={'start'}>
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

                                            <Link href={imagePreview} target="_blank">
                                                <NavigationButton
                                                    backgroundColor="#8B7B25"
                                                    color="white"
                                                    width={'100px'}
                                                    label="Download" />
                                            </Link>



                                        </FormControl>
                                    </VStack>

                                </HStack>
                            )
                        }

                        <NavigationButton
                            loading={loading ? true : false}
                            backgroundColor="#8B7B25"
                            color="white"
                            type="submit"
                            width={'100px'}
                            label="Simpan" />
                    </VStack>
                </form>
            </Flex>
        </Container>
    )
}