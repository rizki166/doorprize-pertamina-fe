import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface User {
    id: number;
    name: string;
}

interface WinnerDialogProps {
    winners: User[];
    onClose: () => void;
}

const WinnerDialog: React.FC<WinnerDialogProps> = ({ winners, onClose }) => (
    <Dialog open={winners.length > 0} onClose={onClose}>
        <DialogTitle>Pemenang Doorprize 🎉</DialogTitle>
        <DialogContent>
            {winners.length > 0 ? (
                <div>
                    <Typography variant="h6">Selamat kepada para pemenang:</Typography>
                    <ul>
                        {winners.map((winner) => (
                            <li key={winner.id}>
                                <Typography variant="body1">{winner.name}</Typography>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Typography variant="h6">Belum ada pemenang.</Typography>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
                Tutup
            </Button>
        </DialogActions>
    </Dialog>
);

export default WinnerDialog;
