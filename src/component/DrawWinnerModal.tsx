import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';

interface User {
  id: number;
  name: string;
}

interface DrawWinnerModalProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  winners: User[];
}

const DrawWinnerModal: React.FC<DrawWinnerModalProps> = ({ open, onClose, users, winners }) => {
  const [currentName, setCurrentName] = useState<string>(''); // Nama yang sedang di-rolling

  useEffect(() => {

    let interval: ReturnType<typeof setInterval>; // Gunakan ReturnType

    if (open) {
      // Jalankan animasi nama berputar
      interval = setInterval(() => {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        setCurrentName(randomUser.name);
      }, 100); // Ganti nama setiap 100ms
    }

    return () => clearInterval(interval); // Bersihkan interval saat modal ditutup
  }, [open, users]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Pengundian Doorprize 🎉</DialogTitle>
      <DialogContent>
        {winners.length === 0 ? (
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ textAlign: 'center', fontSize: '1.5rem', margin: '20px 0' }}
          >
            {currentName}
          </motion.div>
        ) : (
          <div>
            <Typography variant="h6" align="center">
              Selamat kepada para pemenang:
            </Typography>
            <ul>
              {winners.map((winner) => (
                <li key={winner.id}>
                  <Typography variant="body1">{winner.name}</Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="secondary">
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DrawWinnerModal;
