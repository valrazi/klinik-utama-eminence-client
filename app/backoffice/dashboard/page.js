"use client"
import { Box, Heading } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { useEffect, useState } from "react";
import axios from "axios";

// Register bar chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StudentChart = () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    const [chartData, setChartData] = useState({ total: 0, male: 0, female: 0, tingkatLomba: [{ tingkat_lomba: '', jumlah: 0 }], kategoriPeserta: [{ kategori_peserta: '', jumlah: 0 }], totalAlumni: 0, mahasiswaAlumni: 0, pekerjaAlumni: 0 });

    useEffect(() => {
        axios.get(`${API_URL}/chart`).then((res) => {
            setChartData(res.data);
        });
    }, []);

    const data = {
        labels: ['Students'],
        datasets: [
            {
                label: 'Total',
                data: [chartData.total],
                backgroundColor: 'yellow'
            },
            {
                label: 'Male',
                data: [chartData.male],
                backgroundColor: 'black'
            },
            {
                label: 'Female',
                data: [chartData.female],
                backgroundColor: 'gray'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Student Gender Distribution'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256); // 0-255
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgba(${r}, ${g}, ${b}, 0.7)`; // alpha 0.7 for better visibility
    };

    const dataPrestasiSiswaTingkatLomba = {
        labels: ['Achievments by Tingkat Lomba'],
        datasets: chartData.tingkatLomba.map((d) => {
            return {
                label: d.tingkat_lomba,
                data: [d.jumlah],
                backgroundColor: getRandomColor()
            }
        })
    };

    const optionsDataPrestasiTingkatLomba = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Prestasi Siswa by Tingkat Lomba'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const dataPrestasiSiswaKategoriPeserta = {
        labels: ['Achievments by Kategori Peserta'],
        datasets: chartData.kategoriPeserta.map((d) => {
            return {
                label: d.kategori_peserta,
                data: [d.jumlah],
                backgroundColor: getRandomColor()
            }
        })
    };

    const optionsDataPrestasiKategoriPeserta = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Prestasi Siswa by Kategori Peserta'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const dataAlumni = {
        labels: ['Alumnus'],
        datasets: [
            {
                label: 'Total',
                data: [chartData.totalAlumni],
                backgroundColor: 'yellow'
            },
            {
                label: 'Mahasiswa',
                data: [chartData.mahasiswaAlumni],
                backgroundColor: 'black'
            },
            {
                label: 'Pekerja',
                data: [chartData.pekerjaAlumni],
                backgroundColor: 'gray'
            }
        ]
    };

    const optionsAlumni = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: 'Alumni'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Box p={5}>
            <Heading mb={5} fontSize={'xl'}>Data Daftar Siswa</Heading>
            <Box bg="white" borderRadius="md" p={5} shadow="md">
                <Bar data={data} options={options} />
            </Box>

            <Heading my={5} fontSize={'xl'}>Data Prestasi Siswa</Heading>
            <Box bg="white" borderRadius="md" p={5} shadow="md">
                <Bar data={dataPrestasiSiswaTingkatLomba} options={optionsDataPrestasiTingkatLomba} />
            </Box>
            
            <Box bg="white" borderRadius="md" p={5} shadow="md">
                <Bar data={dataPrestasiSiswaKategoriPeserta} options={optionsDataPrestasiKategoriPeserta} />
            </Box>

            <Heading my={5} fontSize={'xl'}>Data Alumni</Heading>
            <Box bg="white" borderRadius="md" p={5} shadow="md">
                <Bar data={dataAlumni} options={optionsAlumni} />
            </Box>
        </Box>
    );
};

export default StudentChart;
