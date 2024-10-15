import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const dummyAdmin = {
    email: "admin@gmail.com",
    password: "zero1755",
};

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null); // Clear previous error message

        if (email === dummyAdmin.email && password === dummyAdmin.password) {
            navigate("/admin");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data: { token: string } = await response.json();
            const { token } = data;
            localStorage.setItem("email", email);
            localStorage.setItem("authToken", token);
            navigate("/admin");
        } catch (err) {
            setErrorMessage("Email atau password salah. Silakan coba lagi.");
            console.error((err as Error).message);
        }
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h5" align="center">
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    {errorMessage && (
                        <Snackbar
                            open={Boolean(errorMessage)}
                            autoHideDuration={6000}
                            onClose={() => setErrorMessage(null)}
                        >
                            <Alert
                                onClose={() => setErrorMessage(null)}
                                severity="error"
                                sx={{ width: "100%" }}
                            >
                                {errorMessage}
                            </Alert>
                        </Snackbar>
                    )}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={handleUsernameChange}
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </form>
                <Typography align="center">
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#1976d2" }}>
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
};

export default Login;
