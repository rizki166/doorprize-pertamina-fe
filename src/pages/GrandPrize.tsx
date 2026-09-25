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
import background from '../assets/bg new.png';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string | null;
    winner: boolean;
    type: "MEMBER" | "MITRA";
}
interface DoorPrize {
    id: number;
    name: string;
    image: string;
}

const GrandPrize: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const [displayUsers, setDisplayUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [winners, setWinners] = useState<User[]>([]);
    const [numWinners, setNumWinners] = useState<number>(1);
    const [doorPrizes, setDoorPrizes] = useState<DoorPrize[]>([]);
    const [selectedDoorPrize, setSelectedDoorPrize] = useState<number | null>(null);
    const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showClapping, setShowClapping] = useState(false);
const [participantType, setParticipantType] = useState<"MEMBER" | "MITRA">("MEMBER");

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:5000/users');
            const result = await response.json();
            if (result.status) setUsers(result.data);
        };

        const fetchDoorPrizes = async () => {
            const response = await fetch('http://localhost:5000/doorprize');
            const result = await response.json();
            if (result.status) setDoorPrizes(result.data);
        };

        fetchUsers();
        fetchDoorPrizes();
    }, []);

    const handleStart = () => {
        if (isRunning) return;

        const eligibleUsers = users.filter(
            (user) =>
                user.type === participantType
        );

        if (numWinners > eligibleUsers.length) {
            alert('Jumlah pemenang melebihi jumlah peserta!');
            return;
        }

        if (selectedDoorPrize === null) {
            alert('Silakan pilih doorprize!');
            return;
        }

        setWinners([]);
        setDisplayUsers([]);
        setShowClapping(false);

        const newIntervalId = setInterval(() => {
            const shuffled = eligibleUsers
                .sort(() => Math.random() - 0.5)
                .slice(0, numWinners);

            setDisplayUsers(shuffled);
        }, 50);

        setIntervalId(newIntervalId);
        setIsRunning(true);
    };

    const handleStop = async () => {
        if (!isRunning) return;

        clearInterval(intervalId!);
        setIsRunning(false);

        const eligibleUsers = users.filter((user) => user.type === participantType);
        const selectedWinners: User[] = [];
        const used = new Set<number>();

        for (let i = 0; i < numWinners; i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * eligibleUsers.length);
            } while (used.has(randomIndex));

            used.add(randomIndex);
            selectedWinners.push(eligibleUsers[randomIndex]);
            setWinners([...selectedWinners]);
        }

        for (const winner of selectedWinners) {
            await fetch(`http://localhost:5000/users/${winner.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...winner, winner: true }),
            });

            await fetch("http://localhost:5000/winner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: winner.id,
                    doorprizeId: selectedDoorPrize,
                }),
            });
        }

        setShowClapping(true);
    };

    const handleDrawWinnersClick = () => setOpenModal(true);

    const handleModalClose = () => {
        setOpenModal(false);
        setWinners([]);
        setSelectedDoorPrize(null);
        setNumWinners(1);
        window.location.reload();
    };

    return (
        <Box
            sx={{
                height: '100vh',
                position: 'relative',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0d0500 100%)',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #D4AF37, #FFD700, #D4AF37, transparent)',
                }}
            />

            <Container >
                            <Container maxWidth="sm">
                <Box
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '100vh',
                        flexDirection: 'column',
                        gap: 2,
                        py: 4,
                    }}
                >
                    <Box sx={{ mb: 1 }}>
                        <Typography
                            sx={{
                                fontFamily: '"Cinzel", "Playfair Display", serif',
                                fontSize: '11px',
                                letterSpacing: '6px',
                                color: '#D4AF37',
                                textTransform: 'uppercase',
                                mb: 0.5,
                            }}
                        >
                            Win Exclusive Prizes
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontFamily: '"Cinzel", "Playfair Display", serif',
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 40%, #B8860B 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '2px',
                                lineHeight: 1.1,
                            }}
                        >
                            DOOR PRIZE
                        </Typography>
                        <Box
                            sx={{
                                height: '1px',
                                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                                mt: 1.5,
                                mx: 'auto',
                                width: '80%',
                            }}
                        />
                    </Box>

                    <FormControl
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#F5E6C8',
                                fontFamily: 'Poppins, sans-serif',
                                '& fieldset': { borderColor: 'rgba(212,175,55,0.4)' },
                                '&:hover fieldset': { borderColor: '#D4AF37' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.04)',
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(212,175,55,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                            '& .MuiSelect-icon': { color: '#D4AF37' },
                        }}
                    >
                        <InputLabel>Doorprize</InputLabel>
                        <Select
                            value={selectedDoorPrize || ''}
                            onChange={(e) => setSelectedDoorPrize(e.target.value as number)}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#1a1000',
                                        border: '1px solid rgba(212,175,55,0.3)',
                                        '& .MuiMenuItem-root': {
                                            color: '#F5E6C8',
                                            fontFamily: 'Poppins, sans-serif',
                                            '&:hover': { bgcolor: 'rgba(212,175,55,0.1)' },
                                            '&.Mui-selected': { bgcolor: 'rgba(212,175,55,0.15)' },
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value="" disabled>Pilih Doorprize</MenuItem>
                            {doorPrizes.map((doorPrize) => (
                                <MenuItem key={doorPrize.id} value={doorPrize.id}>
                                    {doorPrize.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#F5E6C8',
                                '& fieldset': { borderColor: 'rgba(212,175,55,0.4)' },
                                '&:hover fieldset': { borderColor: '#D4AF37' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                background: 'rgba(255,255,255,0.04)',
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(212,175,55,0.7)',
                            },
                        }}
                    >
                        <InputLabel>Peserta Undian</InputLabel>
                    
                        <Select
                            value={participantType}
                            label="Peserta Undian"
                            onChange={(e) =>
                                setParticipantType(e.target.value as "MEMBER" | "MITRA")
                            }
                        >
                            <MenuItem value="MEMBER">Member</MenuItem>
                            <MenuItem value="MITRA">Mitra</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        label="Jumlah Pemenang"
                        value={numWinners}
                        onChange={(e) => setNumWinners(Math.max(1, parseInt(e.target.value) || 1))}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                color: '#F5E6C8',
                                fontFamily: 'Poppins, sans-serif',
                                '& fieldset': { borderColor: 'rgba(212,175,55,0.4)' },
                                '&:hover fieldset': { borderColor: '#D4AF37' },
                                '&.Mui-focused fieldset': { borderColor: '#FFD700' },
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.04)',
                            },
                            '& .MuiInputLabel-root': { color: 'rgba(212,175,55,0.7)' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4AF37' },
                        }}
                        inputProps={{ min: 1, max: users.length }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleDrawWinnersClick}
                        fullWidth
                        sx={{
                            mt: 1,
                            py: 1.8,
                            fontFamily: '"Cinzel", serif',
                            fontSize: '13px',
                            letterSpacing: '3px',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #B8860B 100%)',
                            color: '#0a0a0a',
                            border: 'none',
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(212,175,55,0.35)',
                            textTransform: 'uppercase',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)',
                                boxShadow: '0 6px 28px rgba(255,215,0,0.5)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        ✦ Vote for the Winner ✦
                    </Button>
                </Box>
            </Container>

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
                                // objectFit: 'cover',
                            }}
                            />



                            {/* Pesan Pemenang */}


                            {/* Daftar Pemenang dalam 2 Kolom */}
                            <Box sx={{ width: '100%', mt: 6, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
<Typography
                                    sx={{
                                        fontFamily: '"Cinzel", "Playfair Display", serif',
                                        fontSize: '10px',
                                        letterSpacing: '6px',
                                        color: '#D4AF37',
                                        textTransform: 'uppercase',
                                        mb: 0.5,
                                    }}
                                >
                                    Win Exclusive Prizes
                                </Typography>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontFamily: '"Cinzel", "Playfair Display", serif',
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 40%, #B8860B 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        color:'black',
                                        letterSpacing: '3px',
                                        lineHeight: 1.1,
                                    }}
                                >
                                    DOOR PRIZE
                                </Typography>
<Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    mb:3
  }}
>
  {doorPrizes.find((dp) => dp.id === Number(selectedDoorPrize)) && (
    <Box
      sx={{
        p: 0,
        backdropFilter: "blur(1px)",
      }}
    >
      <img
        src={`http://localhost:5000/uploads/${
          doorPrizes.find((dp) => dp.id === Number(selectedDoorPrize))?.image
        }`}
        width={250}
        height={230}
        alt="Grand Prize"
        style={{
          objectFit: "cover",
        //   backgroundColor:'red'
        }}
      />
    </Box>
  )}

<Box sx={{display:'flex', gap:3, alignItems:'center'}}>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "#213985",
      textAlign: "center",
      position: "relative",
      zIndex: 1,
    }}
  >
    {doorPrizes.find((dp) => dp.id === Number(selectedDoorPrize))?.name ||
      "Pilih Doorprize"}
  </Typography>

  <Typography
  component="span"
  sx={{
    px: 2,
    py: 0.5,
    borderRadius: 2,
    backgroundColor:
      participantType === "MITRA" ? "#1976d2" : "#2e7d32",
    color: "white",
    fontSize: 16,
    fontWeight: "medium",
    position: "relative",
    zIndex: 1,
  }}
>
  {participantType === "MITRA" ? "PARTNER" : participantType}
</Typography>
  </Box>
</Box>
                                <Box display={'flex'} justifyContent={'center'}>
                                    {showClapping && (
                                        <Typography variant="h5"   sx={{
        fontWeight: 'bold',
        color: '#213985', // ← ganti jadi putih dulu buat test
        textAlign: 'left',
        // maxWidth: 3  00,
        mb: 2,
        position: 'relative',
        zIndex: 1,
    }}>
                                            Congratulations to the winners
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
                                                    textAlign: 'center',
                                                    backgroundColor: "rgba(255,255,255,0.75)",
                                                    backdropFilter: "blur(6px)",
                                                    border: "2px solid #8B6B2E",
                                                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                                                                                      width: winners.length === 1 ? '100%' : '100%', // Lebar 50% jika 1 user
  height: 5, // Tinggi lebih besar jika 1 user

                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',

                                                }}
                                            >
                                                <Typography sx={{ fontWeight: 'bold', fontSize: 22, color: '#5C4033' }}>
    {(winners[index]?.name || displayUsers[index]?.name || 'Get Ready to Win!').toUpperCase()}
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
                                            sx={{ bgcolor: '#223985', color: 'white' }}
                                        >
                                            Start
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={handleStop}
                                            disabled={!isRunning}
                                            sx={{ bgcolor: '#223985', color: 'white' }}
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

        </Box>
    );
};
export default GrandPrize