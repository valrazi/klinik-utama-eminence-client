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
            await axios.post(`${API_URL}/schedule-lesson`, formData)
            alert('Form submitted successfully!')
            router.push('/backoffice/akademik/jadwal-pelajaran')
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
        <Container title={'Jadwal Pelajaran'}>
            <Flex justify={'space-between'} align={'center'} pb={'2'} px={'5'}
                borderBottom={'1px solid black'} marginBottom={'1em'}>
                <Text>Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun.</Text>

                <Flex gapX={'4'}>
                    <NavigationButton
                        onClick={() => {
                            router.push('/backoffice/akademik/jadwal-pelajaran')
                        }}
                        label="Kembali" />
                </Flex>
            </Flex>

            <Flex px={'5'} direction={'column'}>
                <Heading width={'fit'} fontWeight={'bold'} borderBottom={'4px solid yellow'} marginBottom={'30px'}>Jadwal Pelajaran</Heading>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <HStack gapX={'2rem'}>

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

                                <FormLabel>Foto Jadwal Pelajaran</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    {...register('foto', {
                                        required: 'Foto wajib diunggah',
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