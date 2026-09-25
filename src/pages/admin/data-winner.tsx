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
    Container,
    TextField,
    TablePagination,
    CircularProgress,
} from "@mui/material";

interface Winner {
    id: number;
    user: {
        id: number;
        name: string;
    };
    doorprize: {
        id: number;
        name: string;
        image: string;
        grandPrize: boolean;
    };
}

const WinnerPage: React.FC = () => {
    const [data, setData] = useState<Winner[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchWinner();
    }, []);

    const fetchWinner = async () => {
        try {
            const response = await fetch("http://localhost:5000/winner");
            const result = await response.json();

            if (result.status) {
                setData(result.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value.toLowerCase());
    };

    const filteredData = data.filter((item) =>
        item.user.name.toLowerCase().includes(search) ||
        item.doorprize.name.toLowerCase().includes(search)
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Box mb={2}>
                <TextField
                    fullWidth
                    label="Cari Pemenang / Hadiah"
                    onChange={handleSearch}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><b>No</b></TableCell>
                            <TableCell align="center"><b>Nama Pemenang</b></TableCell>
                            <TableCell align="center"><b>Hadiah</b></TableCell>
                            <TableCell align="center"><b>Gambar</b></TableCell>
                            <TableCell align="center"><b>Grand Prize</b></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell align="center">
                                            {page * rowsPerPage + index + 1}
                                        </TableCell>

                                        <TableCell align="center">
                                            {item.user.name}
                                        </TableCell>

                                        <TableCell align="center">
                                            {item.doorprize.name}
                                        </TableCell>

                                        <TableCell align="center">
                                            <img
                                                src={`http://localhost:5000/uploads/${item.doorprize.image}`}
                                                alt={item.doorprize.name}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    objectFit: "contain",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            {item.doorprize.grandPrize ? "🏆 Ya" : "Tidak"}
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
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                }}
            />
        </Container>
    );
};

export default WinnerPage;
