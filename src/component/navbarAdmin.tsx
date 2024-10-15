import { useState, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Typography,
    Divider,
} from "@mui/material";
import { FiLogOut, FiHome, FiTable } from "react-icons/fi";
import MenuIcon from "@mui/icons-material/Menu";
import header from "../assets/header.png"; // Ensure the path is correct

const NavbarAdmin: FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/");
    };

    const menuItems = [
        { text: "Dashboard", icon: <FiHome />, path: "/admin" },
        { text: "Data Peserta", icon: <FiTable />, path: "/admin/data-peserta" },
        { text: "Data Doorprize", icon: <FiTable />, path: "/admin/data-doorprize" },
    ];

    return (
        <Box sx={{ display: "flex" }}>
            {/* Navbar Box with Image */}
            <Box
                sx={{
                    height: 100,
                    width: "100%",
                    position: "fixed",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", height: "100%", color: "white", position: "absolute", top: 0, left: 30 }}>
                    <IconButton
                        color="inherit"
                        edge="start"
                        sx={{ mr: 5 }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Drawer always open */}
            <Drawer
                variant="permanent" // Change to 'permanent' to keep it open
                open
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 260,
                        bgcolor: "#255328",
                        color: "white",
                        transition: "all 0.3s ease-in-out",
                    },
                }}
            >
                <Box sx={{ overflow: "auto", mt: 5 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1.2, color: "white" }}>
                            Admin Dashboard
                        </Typography>
                    </Box>
                    <Box>
                        <List>
                            {menuItems.map((item) => (
                                <ListItem
                                    key={item.text}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        fontWeight: "bold",
                                        "&:hover": {
                                            bgcolor: "#1C3D2B", 
                                        },
                                        color: "white",
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "white" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    <Divider sx={{ bgcolor: "#B0BEC5", my: 2 }} />
                </Box>
                <Box sx={{ mt: "auto", p: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "white",
                            "&:hover": { backgroundColor: "#FF1744" },
                            transition: "background-color 0.3s ease",
                            color: "black",
                        }}
                        fullWidth
                        onClick={handleLogout}
                        startIcon={<FiLogOut />}
                    >
                        Logout
                    </Button>
                </Box>
            </Drawer>
        </Box>
    );
};

export default NavbarAdmin;
