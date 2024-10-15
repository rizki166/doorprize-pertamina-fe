import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';

interface User {
    id: number;
    name: string;
}

interface PrizeListProps {
    users: User[];
}

const PrizeList: React.FC<PrizeListProps> = ({ users }) => (
    <div>
        <Typography variant="h6" align="center" gutterBottom>
            Daftar Peserta
        </Typography>
        <List>
            {users.map((user) => (
                <div key={user.id}>
                    <ListItem>
                        <ListItemText primary={user.name} />
                    </ListItem>
                    <Divider />
                </div>
            ))}
        </List>
    </div>
);

export default PrizeList;
