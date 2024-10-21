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
    Snackbar,
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

interface DoorPrize {
    id: number;
    name: string;
    image: string;
}

interface dataEdit {
    id: number;
    name: string;
    image: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Datadoorprize: React.FC = () => {
    const [data, setData] = useState<DoorPrize[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");
    const [editData, setEditData] = useState<dataEdit>({ id: 0, name: "", image: "" });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5000/doorprize");
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAddUser = async () => {
        const formData = new FormData();

        // Tambahkan nama dan gambar ke dalam formData
        formData.append("name", newName);
        if (file) {
            formData.append("image", file); // file berasal dari input gambar
        }

        try {
            const response = await fetch("http://localhost:5000/doorprize", {
                method: "POST",
                body: formData, // Kirim sebagai FormData
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const newUser = await response.json();
            setData((prevData) => [...prevData, newUser]);
            setAddDialogOpen(false);
            setNewName("");
            setSnackbarMessage("Peserta berhasil ditambahkan.");
            setSnackbarOpen(true);
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
        return itemName.includes(search);
    });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleEdit = (participant: DoorPrize) => {
        setEditData(participant);
        setEditDialogOpen(true);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/doorprize/${editData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: editData.name }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setData((prevData) =>
                prevData.map((item) => (item.id === editData.id ? { ...item, ...editData } : item))
            );
            setEditDialogOpen(false);
            setSnackbarMessage("Peserta berhasil diperbarui.");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:5000/doorprize/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            setData((prevData) => prevData.filter((item) => item.id !== id));
            setDeleteDialogOpen(false);
            setSnackbarMessage("Peserta berhasil dihapus.");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 10 }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
                <TextField
                    label="Cari doorprize"
                    variant="outlined"
                    fullWidth
                    onChange={handleSearch}
                />
                <Button
                    sx={{ height: '55px', marginLeft: 2 }}
                    variant="contained"
                    color="primary"
                    onClick={() => setAddDialogOpen(true)}
                >
                    Tambah Doorprize
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={3} sx={{ overflow: 'hidden' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>No</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Image</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Nama</TableCell>
                            <TableCell align="center" sx={{ fontWeight: "bold" }}>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((participant, index) => (
                                    <TableRow key={participant.id}>
                                        <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell align="center"><img src={participant.image} alt={participant.name} style={{ maxWidth: "100px", maxHeight: "100px" }} /></TableCell>

                                        <TableCell align="center">{participant.name}</TableCell>
                                        <TableCell align="center">
                                            <IconButton color="primary" onClick={() => handleEdit(participant)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="secondary" onClick={() => { setDeleteUserId(participant.id); setDeleteDialogOpen(true); }}>
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

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                <DialogTitle>Edit Peserta</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nama"
                        fullWidth
                        variant="outlined"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} startIcon={<CloseIcon />}>
                        Batal
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary" startIcon={<SaveIcon />}>
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add User Dialog */}
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Tambah Peserta</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nama"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        type="file"
                        label="Gambar"
                        fullWidth
                        onChange={handleFileChange}
                        variant="outlined"
                        value={editData.image}
                    // onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)} startIcon={<CloseIcon />}>
                        Batal
                    </Button>
                    <Button onClick={handleAddUser} color="primary" startIcon={<SaveIcon />}>
                        Simpan
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
                    <Button onClick={() => setDeleteDialogOpen(false)} startIcon={<CloseIcon />}>
                        Batal
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => {
                            if (deleteUserId !== null) {
                                handleDeleteUser(deleteUserId);
                            }
                        }}
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for feedback */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Datadoorprize;
