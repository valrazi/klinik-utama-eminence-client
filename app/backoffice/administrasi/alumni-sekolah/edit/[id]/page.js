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
export default function DataGuruEditPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const params = useParams()
    const id = params.id

    const today = dayjs().format('YYYY-MM-DD')

    const [imagePreview, setImagePreview] = useState(null)
    const [accepted, setAccepted] = useState(false)
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
            let data = await axios.get(`${API_URL}/alumni/` + id)
            data = data.data.data
            if (data) {
                for (const key in data) {
                    const value = data[key]

                    if (key == 'foto') {
                        setImagePreview(value)
                    } else if (key == 'tanggal_prestasi') {
                        setValue(key, dayjs(value).format('YYYY-MM-DD'))
                    } else if (key == 'status_terima') {
                        setAccepted(value)
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
            } else {
                formData.append(key, value)
            }
        }


        try {
            setLoading(true)
            await axios.put(`${API_URL}/alumni/` + id, formData)
            alert('Form submitted successfully!')
            window.location.reload()
        } catch (err) {
            console.error('Submit error:', err)
            alert('Form submission failed.')
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async () => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menghapus Data ini?',
            })
            if (isConfirmed) {
                await axios.delete(`${API_URL}/alumni/${id}`)
                showSuccess("Delete data success")
                router.push('/backoffice/administrasi/alumni-sekolah')
            }
        } catch (error) {
            showError("Delete data Failed")
        }
    }

    const acceptData = async () => {
        try {
            const isConfirmed = await showConfirm({
                title: 'Apakah Anda Yakin Ingin Menerima Data ini?',
            })
            if (isConfirmed) {
                await axios.put(`${API_URL}/alumni/status-terima/${id}`)
                showSuccess("Terima data success")
                router.push('/backoffice/administrasi/alumni-sekolah')
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
        <Container title={'Edit Alumni Sekolah'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/administrasi/alumni-sekolah')
                        }}
                        label="Kembali" />

                    <NavigationButton
                        onClick={() => deleteUser(id)}
                        backgroundColor={'red'}
                        color={'black'}
                        label="Hapus"
                    />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <HStack justify={'space-between'}>
                    <Heading width={'fit'} fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Data Alumni</Heading>

                    {
                        !accepted && (
                            <NavigationButton
                                onClick={() => acceptData(id)}
                                backgroundColor={'green'}
                                color={'white'}
                                label="Terima" />
                        )
                    }
                </HStack>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <HStack gapX={'2rem'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.nama_lengkap} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Lengkap</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('nama_lengkap', { required: 'Nama Lengkap wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_lengkap?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.nisn} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>NISN</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('nisn', { required: 'NISN wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nisn?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.status_sekarang} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Kategori Peserta</FormLabel>
                                    <select
                                        {...register('status_sekarang', { required: 'Kategori Peserta wajib dipilih' })}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid gray',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <option value="" selected disabled>-- Pilih Status Alumni --</option>
                                        <option value="mahasiswa">Mahasiswa</option>
                                        <option value="pekerja">Pekerja</option>
                                    </select>
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.status_sekarang?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.instansi_sekarang} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Instansi Sekarang</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('instansi_sekarang', { required: 'Instansi Sekarang wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.instansi_sekarang?.message}</FormErrorMessage>
                                </FormControl>


                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>


                                {/* Foto Mahasiswa */}
                                <FormControl isInvalid={errors.bidang_sekarang} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Bidang Sekarang</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('bidang_sekarang', { required: 'Bidang Sekarang wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.bidang_sekarang?.message}</FormErrorMessage>
                                </FormControl>
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

                                    <FormLabel>Foto Juara / Sertifikat</FormLabel>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        {...register('foto', {
                                            validate: {
                                                isImage: (files) => {
                                                    // Allow empty (optional)
                                                    if (!files || files.length === 0) return true

                                                    // If provided, must be an image
                                                    return files[0].type.startsWith('image/') || 'File harus berupa gambar'
                                                },
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