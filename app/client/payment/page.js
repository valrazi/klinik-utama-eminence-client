"use client";

import FooterClient from "@/components/ui/atomics/FooterClient";
import NavigationButton from "@/components/ui/atomics/NavigationButton";
import Empty from "@/components/ui/molecules/Empty";
import { Box, Button, Flex, Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiRotaryPhone } from "react-icons/gi";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FormLabel } from "@chakra-ui/form-control";
import axios from "axios";
import { GET } from '@/app/api/auth/[...nextauth]/route'
import { Input as InputChakra, InputGroup } from "@chakra-ui/react"
import Swal from "sweetalert2";


export default function BackofficePage() {

    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { data: session, status, update } = useSession(GET);
    const router = useRouter();
    const [jenisPembayaran, setJenisPembayaran] = useState(null);
    const [nominalPembayaran, setNominalPembayaran] = useState(null);
    const [buktiTransfer, setBuktiTransfer] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);


    useEffect(() => {
        if (status === "loading") return; // Wait for session to load

        if (!session) {
            // Not logged in → redirect to login or wherever
            router.push("/auth/login-client");
        }
        console.log({ session });
    }, [session, status, router]);

    if (status === "loading") {
        return <p>Loading...</p>;
    }



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Example: check empty (replace this with your login logic)
        if (!jenisPembayaran || !nominalPembayaran || !buktiTransfer) {
            setError("Lengkapi form terlebih dahulu!");
            alert("Lengkapi form terlebih dahulu!")
            return;
        }
        const isNumericOnly = /^\d+$/.test(nominalPembayaran?.trim());
        if (!isNumericOnly) {
            alert("Nominal pembayaran hanya boleh berisi angka.");
            return;
        }
        setError(null)

        try {
            setIsLoading(true)
            const formData = new FormData();
            formData.append('jenis_pembayaran', jenisPembayaran);
            formData.append('nominal_pembayaran', Number(nominalPembayaran));
            formData.append('foto', buktiTransfer);
            const data = await axios.post(`${API_URL}/payment`, formData, {
                headers: {
                    Authorization: `Bearer ${session.accesToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            setJenisPembayaran(null)
            setNominalPembayaran(null)
            setBuktiTransfer(null)
            setPreview(null)
            fileInputRef.current.value = null
            Swal.fire({
                title: 'Terima Kasih',
                html: `
    <div style="text-align: center;">
      <p>Sedekah Anda di Masjid Al Furqon Bekasi berhasil dikirim.</p>
      <p>Data Anda telah kami terima dan sedang diproses.<br>
      Mohon simpan bukti ini untuk kebutuhan dokumentasi pribadi Anda.</p>
    </div>
  `,
                confirmButtonText: 'Download Bukti',
                customClass: {
                    confirmButton: 'swal2-confirm-custom',
                    popup: 'swal2-popup-center',
                },
                willOpen: () => {
                    // Center everything explicitly (if needed)
                    const popup = Swal.getPopup();
                    if (popup) popup.style.textAlign = 'center';
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    window.open(`/client/payment-detail/${data.data.data.id}`, '_blank');
                }
            });
        } catch (error) {
            console.log(error);
            setError(error)
        } finally {
            setIsLoading(false)
        }


    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBuktiTransfer(file);
            setPreview(URL.createObjectURL(file)); // create preview URL
        }
    };

    return (
        <Flex direction={'column'} width={'full'}>
            <Flex width={'full'} align={'center'} justify={'center'} direction={'column'} gap={'6'}>
                <img src="/img/hero_client.png" />
                <Text fontSize={'18px'} fontWeight={'bold'} textAlign={'center'} color={'#8B7B25'}>
                    TUNAIKAN ZAKAT DAN INFAQ ANDA<br></br>DENGAN AMAN DAN MUDAH
                </Text>

                <Box as="form" onSubmit={handleSubmit} width={'full'} display="flex" alignItems="center" justifyContent="center" flexDirection={'column'}>
                    <Box bg="white" p={8} mb={'4'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
                        <VStack spacing={8} width={'full'}>
                            {error && <Text color="red.500">{error}</Text>}


                            <Box width={'full'}>
                                <FormLabel>Jenis Pembayaran</FormLabel>
                                <select
                                    placeholder="Masukkan Jenis Pembayaran"
                                    value={jenisPembayaran}
                                    onChange={(e) => {
                                        setJenisPembayaran(e.target.value)
                                        setNominalPembayaran(null)
                                        setBuktiTransfer(null)
                                        fileInputRef.current.value = null
                                        setPreview(null)
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid gray',
                                        borderRadius: '6px',
                                    }}>
                                    <option value="" selected disabled>Masukkan Jenis Pembayaran</option>
                                    <option value={'Zakat Fitrah Uang'}>Zakat Fitrah Uang</option>
                                    <option value={'Zakat Fitrah Beras'}>Zakat Fitrah Beras</option>
                                    <option value={'Zakat Maal'}>Zakat Maal</option>
                                    <option value={'Infaq'}>Infaq</option>
                                </select>
                            </Box>

                            <Box width={'full'}>
                                <FormLabel>Nominal Pembayaran</FormLabel>
                                {
                                    jenisPembayaran && (jenisPembayaran == 'Zakat Fitrah Beras' || jenisPembayaran == 'Zakat Maal')
                                        ? (
                                            <Input
                                                type="text"
                                                placeholder="Berapa Liter Beras"
                                                value={nominalPembayaran}
                                                onChange={(e) => setNominalPembayaran(e.target.value)}
                                                w="full"
                                                border={'1px solid gray'}
                                                p={'1'}
                                            />
                                        )
                                        : (
                                            <InputGroup startAddon="Rp.">
                                                <InputChakra
                                                    type="text"
                                                    placeholder="Nominal Uang"
                                                    value={nominalPembayaran}
                                                    onChange={(e) => setNominalPembayaran(e.target.value)}
                                                    w="full"
                                                    border={'1px solid gray'}
                                                    p={'1'} />
                                            </InputGroup>
                                        )
                                }
                            </Box>
                        </VStack>
                    </Box>

                    {
                        jenisPembayaran && (jenisPembayaran == 'Zakat Fitrah Beras' || jenisPembayaran == 'Zakat Maal')
                            ? (
                                <Box bg="white" p={8} mb={'4'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
                                    <Heading fontSize={'16px'} fontWeight={'bold'}>Catatan</Heading>
                                    <Text>
                                        Setelah membayar Zakat Fitrah - Beras dan upload bukti, mohon konfirmasi langsung ke Masjid Al Furqon Bekasi untuk pencatatan dan distribusi yang tepat.
                                    </Text>
                                </Box>
                            )
                            : (
                                <Box bg="white" p={8} mb={'4'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
                                    <Heading fontSize={'16px'} fontWeight={'bold'}>Metode Pembayaran</Heading>
                                    <Flex direction={'column'} width={'full'}>
                                        <Flex width={'full'} justify={'space-between'} align={'center'} borderBottom={'1px solid gray'} pb={'2'} mb={'4'}>
                                            <img src="/img/mandiri.png" />
                                            <Text>000000000000000</Text>
                                            <Button px={'5'} backgroundColor={'#8B8A25'} color={'white'} rounded={'lg'}>
                                                Salin
                                            </Button>
                                        </Flex>

                                        <Flex width={'full'} justify={'space-between'} align={'center'} pb={'2'}>
                                            <img src="/img/bca.png" />
                                            <Text>000000000000000</Text>
                                            <Button px={'5'} backgroundColor={'#8B8A25'} color={'white'} rounded={'lg'}>
                                                Salin
                                            </Button>
                                        </Flex>
                                    </Flex>
                                </Box>
                            )
                    }

                    <Box bg="white" p={8} mb={'4'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
                        <Heading fontSize={'16px'} fontWeight={'bold'}>Upload Bukti Pembayaran</Heading>
                        <Flex direction={'column'}>
                            {preview && (
                                <div>
                                    <p>Preview:</p>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                                    />
                                </div>
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                required
                            />

                        </Flex>
                    </Box>

                    <Box bg="white" p={8} mb={'4'} rounded="xl" shadow="xl" border={'1px solid gray'} borderColor={'gray'} w="full">
                        <Heading textAlign={'center'} fontSize={'16px'} fontWeight={'bold'}>Niat Menunaikan Zakat</Heading>
                        <img src="/img/niat.png" style={{ margin: '16px auto' }} />
                        <Text textAlign={'center'}>
                            “Nawaitu an ukhrija zakata maali fardhan lillahi ta'aala.”
                            Aku niat mengeluarkan zakat hartaku fardhu karena Allah Ta'ala.
                        </Text>
                    </Box>


                    <Button loading={isLoading} backgroundColor={'#8B8A25'} color={'white'} onClick={handleSubmit} w="full" rounded={'lg'} marginBottom={'4'}>
                        Submit Pembayaran
                    </Button>
                </Box>
            </Flex>

        </Flex>
    );
}
