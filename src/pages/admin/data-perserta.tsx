import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TablePagination,
    CircularProgress,
    MenuItem,
    Select,
    Snackbar,
    Alert,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";

interface User {
    id: number;
    name: string;
    email: string | null;
    winner: boolean;
}

const PagesAdmin: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [editData, setEditData] = useState<User>({
        id: 0,
        name: "",
        email: "",
        winner: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/users");
                const result = await response.json();

                if (result.status && Array.isArray(result.data)) {
                    setData(result.data);
                } else {
                    console.error("Data yang diterima tidak valid:", result);
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const newUser = await response.json();
            setData((prevData) => [...prevData, newUser]);
            setAddDialogOpen(false);
            setNewName("");
            window.location.reload();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) => {
        const itemName = item.name ? item.name.toLowerCase() : "";
        const itemEmail = item.email ? item.email.toLowerCase() : "";
        return itemName.includes(search) || itemEmail.includes(search);
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleEdit = (participant: User) => {
        setEditData(participant);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    winner: editData.winner,
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setData((prevData) =>
                prevData.map((item) => (item.id === editData.id ? { ...item, ...editData } : item))
            );
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/users/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setData((prevData) => prevData.filter((user) => user.id !== id));
            setSnackbarMessage("User deleted successfully!");
            setSnackbarOpen(true);
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleOpenDeleteDialog = (id: number) => {
        setDeleteUserId(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md" sx={{ mt:10  }}>
            <Box sx={{ display: 'flex', gap: 2, height: '55px' }}>
                <TextField
                    label="Cari Peserta"
                    variant="outlined"
                    fullWidth
                    sx={{
                        '& .MuiInputBase-root': {
                            height: '50px',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '4px',
                        },
                    }}
                    onChange={handleSearch}
                />
                <Button
                    sx={{ height: '50px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => setAddDialogOpen(true)}
                >
                    Tambah Peserta
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>No</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Nama</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Winner </TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((participant, index) => (
                                    <TableRow key={participant.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' }, '&:hover': { backgroundColor: '#e0e0e0' } }}>
                                        <TableCell align="center">
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>
                                        <TableCell align="center">{participant.name}</TableCell>
                                        <TableCell align="center">{participant.winner ? "Ya" : "Tidak"}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEdit(participant)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => handleOpenDeleteDialog(participant.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
            />

            {/* Edit User Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Peserta</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nama"
                        fullWidth
                        variant="outlined"
                        value={editData.name}
                        onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                        }
                        
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={editData.email ?? ""}
                        onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                        }
                       
                    />
                    <Typography>Hadiah </Typography>
                    <Select
                        value={editData.winner ? "Ya" : "Tidak"}
                        onChange={(e) => setEditData({ ...editData, winner: e.target.value === "Ya" })}
                        fullWidth
                    >
                        <MenuItem value="Ya">Ya</MenuItem>
                        <MenuItem value="Tidak">Tidak</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="primary">
                        Tutup
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary" variant="contained">
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Tambah Peserta</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nama"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)} color="primary">
                        Tutup
                    </Button>
                    <Button onClick={handleAddUser} color="primary" variant="contained">
                        Tambah
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Hapus Peserta</DialogTitle>
                <DialogContent>
                    <Typography>Apakah Anda yakin ingin menghapus peserta ini?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Batal
                    </Button>
                    <Button onClick={() => deleteUserId && handleDeleteUser(deleteUserId)} color="secondary">
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default PagesAdmin;
