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
}

const PrizeMotor: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [displayUsers, setDisplayUsers] = React.useState<User[]>([]);
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
            }, 90);

            setIntervalId(newIntervalId);
            setIsRunning(true);

            setTimeout(async () => {
                clearInterval(newIntervalId);
                setDisplayUsers([]);
                setIsRunning(false);
                drumRef.current?.pause();
                drumRef.current!.currentTime = 0;
                applauseRef.current?.play();

                const selectedWinners: User[] = [];
                const usedIndices = new Set<number>();

                while (selectedWinners.length < numWinners) {
                    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
                    if (!usedIndices.has(randomIndex)) {
                        selectedWinners.push(eligibleUsers[randomIndex]);
                        usedIndices.add(randomIndex);
                    }
                }

                console.log('Selected Winners:', selectedWinners);

                for (const winner of selectedWinners) {
                    try {
                        const response = await fetch(`http://localhost:5000/users/${winner.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
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

                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        selectedWinners.some((winner) => winner.id === user.id)
                            ? { ...user, winner: true }
                            : user
                    )
                );

                setWinners(selectedWinners);
                setShowClapping(true);
            }, 8000);
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
    };

    return (
        <Box sx={{ height: '100vh', position: 'relative' }}>
            <img src={header} width={'100%'} height={'100px'} style={{ objectFit: 'fill' }} />
            <Link to='/login'>
                <button
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '10px', //
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
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 20,
                        flexDirection: 'column',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Doorprize Hadiah Motor
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
                                mt: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                overflow: 'hidden',
                            }}
                        >
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

                            <Box sx={{ mt: 25 }}>
                                <Typography
                                    variant="h4"
                                    style={{ fontWeight: 'bold', color: '#285a2e' }}
                                    gutterBottom
                                >
                                    HADIAH {doorPrizes.find((dp) => dp.id === selectedDoorPrize)?.name || 'Menunggu...'}
                                </Typography>
                            </Box>

                            <Grid container spacing={2} sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                {Array.from({ length: numWinners }).map((_, index) => (
                                    <Grid
                                        item
                                        key={index}
                                        sx={{
                                            width: '40%',
                                            borderRadius: 30,
                                            height: 50,
                                            textAlign: 'center',
                                            p: 1,
                                            border: '5px solid #285a2e',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                                            {winners[index]?.name || displayUsers[index]?.name || 'Get Ready to Win!'}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    onClick={handleStart}
                                    sx={{ mr: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#316c36' }}
                                >
                                    Mulai
                                </Button>
                                <Button
                                    onClick={handleModalClose}
                                    sx={{ mr: 2, color: 'white', fontWeight: 'bold', backgroundColor: '#316c36' }}
                                >
                                    Tutup
                                </Button>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>


            </Container>

            <audio ref={drumRef} src={drumSound} />
            <audio ref={applauseRef} src={applauseSound} />
        </Box >
    );
};

export default PrizeMotor;  