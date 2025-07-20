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
    const [chartData, setChartData] = useState({ total: 0, male: 0, female: 0 });

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

    return (
        <Box p={5}>
            <Heading mb={5} fontSize={'xl'}>Data Daftar Siswa</Heading>
            <Box bg="white" borderRadius="md" p={5} shadow="md">
                <Bar data={data} options={options} />
            </Box>
        </Box>
    );
};

export default StudentChart;
