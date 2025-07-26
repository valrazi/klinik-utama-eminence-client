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
import dayjs from "dayjs";
export default function DataGuruAddPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [imagePreview, setImagePreview] = useState(null)

    const today = dayjs().format('YYYY-MM-DD')
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
            await axios.post(`${API_URL}/achievment`, formData)
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
        <Container title={'Tambah Prestasi'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/akademik/prestasi-siswa')
                        }}
                        label="Kembali" />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <Heading width={'fit'} fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Data Prestasi</Heading>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <HStack gapX={'2rem'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.nama_prestasi} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Prestasi</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('nama_prestasi', { required: 'Nama Prestasi wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_prestasi?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.kategori_peserta} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Kategori Peserta</FormLabel>
                                    <select
                                        {...register('kategori_peserta', { required: 'Kategori Peserta wajib dipilih' })}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid gray',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <option value="" selected disabled>-- Pilih Kategori Peserta --</option>
                                        <option value="individu">Individu</option>
                                        <option value="tim">Tim</option>
                                    </select>
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.kategori_peserta?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.nama_siswa} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Siswa</FormLabel>
                                    <Textarea
                                        rows={'4'}
                                        border="1px solid gray"
                                        {...register('nama_siswa', { required: 'Nama Siswa wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_siswa?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.tanggal_prestasi} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Tanggal Prestasi</FormLabel>
                                    <Input
                                        type="date"
                                        max={today}
                                        border="1px solid gray"
                                        {...register('tanggal_prestasi', {
                                            required: 'Tanggal Prestasi wajib diisi',
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.tanggal_prestasi?.message}
                                    </FormErrorMessage>
                                </FormControl>

                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                <FormControl isInvalid={errors.tingkat_lomba} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Tingkat Lomba</FormLabel>
                                    <select
                                        {...register('tingkat_lomba', { required: 'Tingkat Lomba wajib dipilih' })}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid gray',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <option value="" selected disabled>-- Pilih Tingkat Lomba --</option>
                                        <option value="sekolah">Sekolah</option>
                                        <option value="kecamatan">Kecamatan</option>
                                        <option value="kabupaten/kota">Kabupaten/Kota</option>
                                        <option value="provinsi">Provinsi</option>
                                        <option value="nasional">Nasional</option>
                                        <option value="internasional">Internasional</option>
                                    </select>
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.tingkat_lomba?.message}
                                    </FormErrorMessage>
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

                                    <FormLabel>Foto Juara / Sertifikat</FormLabel>
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