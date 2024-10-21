import React, { useEffect, useState, useRef } from 'react';
import {
    Container,
    Button,
    Typography,
    Modal,
    Box,
    Fade,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import drumSound from '../assets/Drum.mp3';
import applauseSound from '../assets/Applause  Sound Effect.mp3';
import header from '../assets/header.png';
import background from '../assets/Picture1.png';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string | null;
    winner: boolean;
}

interface DoorPrize {
    id: number;
    name: string;
    image: string;
}

const PrizeMotor: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [displayUsers, setDisplayUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [winners, setWinners] = useState<User[]>([]);
    const [numWinners, setNumWinners] = useState<number>(1);
    const [doorPrizes, setDoorPrizes] = useState<DoorPrize[]>([]);
    const [selectedDoorPrize, setSelectedDoorPrize] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showClapping, setShowClapping] = useState(false);

    const drumRef = useRef<HTMLAudioElement | null>(null);
    const applauseRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/users');
                const result = await response.json();
                if (result.status) setUsers(result.data);
                else console.error('Error fetching users:', result.message);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchDoorPrizes = async () => {
            try {
                const response = await fetch('http://localhost:5000/doorprize');
                const result = await response.json();
                if (result.status) setDoorPrizes(result.data);
                else console.error('Error fetching door prizes:', result.message);
            } catch (error) {
                console.error('Error fetching door prizes:', error);
            }
        };

        fetchUsers();
        fetchDoorPrizes();
    }, []);

    const handleStart = () => {
        if (!isRunning) {
            const eligibleUsers = users.filter(user => !user.winner);

            if (numWinners > eligibleUsers.length) {
                alert('Jumlah pemenang melebihi jumlah peserta yang memenuhi syarat!');
                return;
            }

            if (selectedDoorPrize === null) {
                alert('Silakan pilih doorprize!');
                return;
            }

            setWinners([]); // Reset winners
            setDisplayUsers([]);
            setShowClapping(false);
            drumRef.current?.play();

            const newIntervalId = setInterval(() => {
                const shuffledUsers = eligibleUsers
                    .sort(() => Math.random() - 0.5)
                    .slice(0, numWinners);
                setDisplayUsers(shuffledUsers);
            }, 10);

            setIntervalId(newIntervalId);
            setIsRunning(true);
        }
    };

    const handleStop = async () => {
        if (isRunning) {
            clearInterval(intervalId!);
            setIsRunning(false);
            drumRef.current?.pause();
            drumRef.current!.currentTime = 0;
            applauseRef.current?.play();

            const selectedWinners: User[] = [];
            const usedIndices = new Set<number>();
            const eligibleUsers = users.filter(user => !user.winner);

            // Fungsi untuk memilih dan menambahkan pemenang dengan delay 1 detik
            const selectWinnersWithDelay = async () => {
                for (let i = 0; i < numWinners; i++) {
                    // await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 1 detik
                    let randomIndex;

                    // Cari indeks unik yang belum dipilih sebelumnya
                    do {
                        randomIndex = Math.floor(Math.random() * eligibleUsers.length);
                    } while (usedIndices.has(randomIndex));

                    usedIndices.add(randomIndex);
                    const winner = eligibleUsers[randomIndex];
                    selectedWinners.push(winner);

                    // Update UI saat pemenang dipilih
                    setWinners([...selectedWinners]);

                    console.log(`Winner selected: ${winner.name}`);
                }

                // Setelah semua pemenang dipilih, update data pengguna
                await updateWinners(selectedWinners);
                setShowClapping(true);
            };

            const updateWinners = async (winners: User[]) => {
                for (const winner of winners) {
                    try {
                        const response = await fetch(`http://localhost:5000/users/${winner.id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...winner, winner: true }),
                        });

                        const result = await response.json();
                        if (result.status) {
                            console.log(`Winner updated: ${winner.name}`);
                        } else {
                            console.error('Error updating winner:', result.message);
                        }
                    } catch (error) {
                        console.error('Error updating winner:', error);
                    }
                }

                // Update state pengguna setelah update API selesai
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        winners.some((winner) => winner.id === user.id)
                            ? { ...user, winner: true }
                            : user
                    )
                );
            };

            // Jalankan fungsi pemilihan pemenang dengan delay
            await selectWinnersWithDelay();
        }
    };


    const handleDrawWinnersClick = () => {
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setWinners([]);
        setSelectedDoorPrize(null);
        setNumWinners(1);
        window.location.reload();
    };

    return (
        <Box sx={{ height: '100vh', position: 'relative' }}>
            <img src={header} width={'100%'} height={'100px'} style={{ objectFit: 'fill' }} />
            {<Link to='/login'>
                <button
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#2d6532',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Login
                </button>
            </Link> 
            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 10,
                        flexDirection: 'column',
                    }}
                >
                    <Typography sx={{ fontFamily: 'Poppins' }} variant="h4" gutterBottom>
                        Win Exclusive Prizes with Pertamina
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Doorprize</InputLabel>
                        <Select
                            value={selectedDoorPrize || ''}
                            onChange={(e) => setSelectedDoorPrize(e.target.value as number)}
                        >
                            <MenuItem value="" disabled>Pilih Doorprize</MenuItem>
                            {doorPrizes.map((doorPrize) => (
                                <MenuItem key={doorPrize.id} value={doorPrize.id}>
                                    {doorPrize.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        label="Jumlah Pemenang"
                        value={numWinners}
                        onChange={(e) => setNumWinners(Math.max(1, parseInt(e.target.value) || 1))}
                        sx={{ mt: 2, width: '100%' }}
                        inputProps={{ min: 1, max: users.length }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleDrawWinnersClick}
                        sx={{ mt: 2, bgcolor: '#26572c', color: 'white' }}
                        fullWidth
                    >
                        Undi Pemenang
                    </Button>
                </Box>
                <Modal open={openModal} onClose={handleModalClose} closeAfterTransition>
                    <Fade in={openModal}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                height: '100vh',
                                mx: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Background Image */}
                            <img
                                src={background}
                                alt="Background"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: '-moz-initial',
                                    zIndex: -1,
                                }}
                            />



                            {/* Pesan Pemenang */}


                            {/* Daftar Pemenang dalam 2 Kolom */}
                            <Box sx={{ width: '100%', mt: 22, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>

                                <Box 
                                padding={2}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    gap={2}

                                >
                                    {doorPrizes.find((dp) => dp.id === selectedDoorPrize) ? (<img
                                        src={doorPrizes.find((dp) => dp.id === selectedDoorPrize)?.image || '/placeholder.png'}
                                        width={150}
                                        height={150}
                                        alt="gambar"
                                        style={{ objectFit: 'contain', borderRadius: '8px' }}
                                    />) : null}

                                    
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: 'bold', color: '#285a2e', textAlign: 'center' }}
                                        gutterBottom
                                    >
                                        {doorPrizes.find((dp) => dp.id === selectedDoorPrize)?.name || 'Pilih Doorprize'}
                                    </Typography>


                                </Box>

                                <Box display={'flex'} justifyContent={'center'}>
                                    {showClapping && (
                                        <Typography variant="h5" sx={{ mt: 0, color: '#285a2e', fontWeight: 'bold' }}>
                                            Selamat kepada pemenang!
                                        </Typography>
                                    )}
                                </Box>
                                <Grid container
                                    display={"flex"} gap={1}
                                    justifyContent="center" // Pastikan item ada di tengah
                                // sx={{ minHeight: '100vh', }} // Pastikan container memenuhi layar
                                >
                                    {Array.from({ length: numWinners }).map((_, index) => (
                                        <Grid
                                            item
                                            key={index}
                                            xs={12} // Selalu 1 kolom di layar kecil
                                            sm={numWinners === 1 ? 3 : 3}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 3,
                                                    border: '2px solid #285a2e',
                                                    textAlign: 'center',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                                    width: winners.length === 1 ? '50%' : '100%', // Lebar 50% jika 1 user
                                                    height: 5, // Tinggi lebih besar jika 1 user

                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',

                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                                    {winners[index]?.name || displayUsers[index]?.name || 'Get Ready to Win!'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 0 }}>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={handleStart}
                                            disabled={isRunning}
                                            sx={{ bgcolor: '#2d6532', color: 'white' }}
                                        >
                                            Mulai
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={handleStop}
                                            disabled={!isRunning}
                                            sx={{ bgcolor: '#2d6532', color: 'white' }}
                                        >
                                            Stop
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Link to="/">
                                            <Button
                                                onClick={handleModalClose}
                                                sx={{ bgcolor: '#dc3545', color: 'white' }}
                                            >
                                                Home
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>

            </Container>

            <audio ref={drumRef} src={drumSound} preload="auto" />
            <audio ref={applauseRef} src={applauseSound} preload="auto" />
        </Box >
    );
};

export default PrizeMotor;
