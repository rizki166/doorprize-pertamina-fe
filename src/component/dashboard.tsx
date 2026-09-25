import { Box, Typography } from "@mui/material";

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

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: '#333'

                    }}
                >
                    Welcome to the Admin Dashboard of  Doorprize
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
