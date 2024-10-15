import { Outlet } from "react-router-dom";
import NavbarAdmin from "../component/navbarAdmin";
import { Box } from "@mui/material";

const LayoutsAdmin = () => {
    return (
        <Box display="flex" sx={{ height: '100vh' }}>
            {/* Sidebar/Drawer */}
            <Box
                sx={{
                    width: 260, // Set a fixed width for the sidebar
                    bgcolor: "#255328", // Match the sidebar background color
                    display: { xs: 'none', md: 'block' }, // Hide on small screens if needed
                }}
            >
                <NavbarAdmin />
            </Box>

            {/* Main Content Area */}
            <Box
                sx={{
                    flex: 1,
                    bgcolor: "#f5f5f5", // Optional: Set a background color for the main area
                    overflow: "auto",
                    border: "1px solid gray",
                    "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
};

export default LayoutsAdmin;
