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
import dayjs from 'dayjs'

export default function DataSiswaAddPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const today = dayjs().format('YYYY-MM-DD')
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
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
            await axios.post(`${API_URL}/student`, formData)
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
        <Container title={'Tambah Data Siswa'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/data-siswa')
                        }}
                        label="Kembali" />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <Heading fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'} width={'fit'}>Data Profil Siswa</Heading>

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
                                <FormControl isInvalid={errors.nisn} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>NISN</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nisn', { required: 'NISN wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nisn?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.tempat_lahir} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Tempat Lahir</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('tempat_lahir', { required: 'Tempat Lahir wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.tempat_lahir?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.tanggal_lahir} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Tanggal Lahir</FormLabel>
                                    <Input
                                        type="date"
                                        max={today}
                                        border="1px solid gray"
                                        {...register('tanggal_lahir', {
                                            required: 'Tanggal Lahir wajib diisi',
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.tanggal_lahir?.message}
                                    </FormErrorMessage>
                                </FormControl>

                                {/* No. Telepon */}
                               
                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.jenis_kelamin} style={{ width: '100%' }}>
                                    <FormLabel fontWeight="bold">Jenis Kelamin</FormLabel>
                                    <select
                                        {...register('jenis_kelamin', { required: 'Jenis Kelamin wajib dipilih' })}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid gray',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        <option value="" selected disabled>-- Pilih Jenis Kelamin --</option>
                                        <option value="male">Laki-laki</option>
                                        <option value="female">Perempuan</option>
                                    </select>
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.jenis_kelamin?.message}
                                    </FormErrorMessage>
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
                                    <FormLabel fontWeight={'bold'}>No. Telepon</FormLabel>
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

                                <FormControl isInvalid={errors.alamat_lengkap} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Alamat Lengkap</FormLabel>
                                    <Input
                                        border="1px solid gray"
                                        {...register('alamat_lengkap', {
                                            required: 'Alamat Lengkap wajib diisi',
                                        })}
                                    />
                                    <FormErrorMessage fontSize="12px" color="red">
                                        {errors.alamat_lengkap?.message}
                                    </FormErrorMessage>
                                </FormControl>
                            </VStack>
                        </HStack>

                        <Heading fontWeight={'bold'} borderBottom={'4px solid yellow'} marginY={'30px'} width={'fit'}>Data Orang Tua</Heading>
                        <HStack gapX={'2rem'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.nama_ayah} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Ayah</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nama_ayah', { required: 'Nama Ayah wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_ayah?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Nama Mata Pelajaran */}
                                <FormControl isInvalid={errors.pekerjaan_ayah} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Pekerjaan Ayah</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('pekerjaan_ayah', { required: 'Pekerjaan Ayah wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.pekerjaan_ayah?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.no_telepon_ayah} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>No. Telpon Ayah</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('no_telepon_ayah', { required: 'No. Telpon Ayah wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.no_telepon_ayah?.message}</FormErrorMessage>
                                </FormControl>
                            </VStack>

                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.nama_ibu} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nama Ibu</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nama_ibu', { required: 'Nama Ibu wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nama_ibu?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Nama Mata Pelajaran */}
                                <FormControl isInvalid={errors.pekerjaan_ibu} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Pekerjaan Ibu</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('pekerjaan_ibu', { required: 'Pekerjaan Ibu wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.pekerjaan_ibu?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.no_telepon_ibu} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>No. Telpon Ibu</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('no_telepon_ibu', { required: 'No. Telpon Ibu wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.no_telepon_ibu?.message}</FormErrorMessage>
                                </FormControl>
                            </VStack>
                        </HStack>

                        <Heading fontWeight={'bold'} borderBottom={'4px solid yellow'} marginY={'30px'} width={'fit'}>Data Dokumen</Heading>
                        <HStack gapX={'2rem'}>
                            <VStack width={'1/2'} justify={'start'} align={'start'}>
                                {/* Nama Lengkap */}
                                <FormControl isInvalid={errors.asal_sekolah} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Asal Sekolah SMP</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('asal_sekolah', { required: 'Asal Sekolah SMP wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.asal_sekolah?.message}</FormErrorMessage>
                                </FormControl>

                                {/* Nama Mata Pelajaran */}
                                <FormControl isInvalid={errors.tahun_lulus} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Tahun Lulus</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('tahun_lulus', { required: 'Tahun Lulus wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.tahun_lulus?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.nilai_un} style={{ width: '100%' }}>
                                    <FormLabel fontWeight={'bold'}>Nilai Rata - rata Raport / UN</FormLabel>
                                    <Input
                                        type="text"
                                        border={'1px solid gray'}
                                        {...register('nilai_un', { required: 'Nilai Rata - rata Raport / UN wajib diisi' })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.nilai_un?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={errors.ijazah_smp} style={{ width: '100%' }}>
                                    <FormLabel>Ijazah SMP</FormLabel>
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        border={'1px solid gray'}
                                        p={'1'}
                                        {...register('ijazah_smp', {
                                            required: 'Ijazah SMP wajib diunggah',
                                            validate: {
                                                isPdf: (files) => {
                                                    if (!files || files.length === 0) return 'Ijazah SMP wajib diunggah'
                                                    return files[0].type === 'application/pdf' || 'File harus berupa PDF'
                                                },
                                            },
                                        })}
                                    />
                                    <FormErrorMessage fontSize={'12px'} color={'red'}>{errors.ijazah_smp?.message}</FormErrorMessage>
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
