import { Box, Typography } from "@mui/material";
import logoPertamina from "../assets/Logo Pertamina.jpg";

const Dashboard = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
             
                height: "100vh",
                backgroundColor: '#ffffff',

            }}
        >
            <Box sx={{ textAlign: "center", mb: 15 }}>
                <img
                    src={logoPertamina}
                    width={220}
                    height={150}
                    style={{ borderRadius: '10px' }}
                    alt="Pertamina Logo"

                />
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: '#333'

                    }}
                >
                    Welcome to the Admin Dashboard of Pertamina Doorprize
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginTop: '10px',
                        textAlign: "center",
                        color: '#555'
                    }}
                >
                    Here you can manage all aspects of the doorprize administration efficiently and effortlessly.
                </Typography>
            </Box>
        </Box>
    );
};

export default Dashboard;
