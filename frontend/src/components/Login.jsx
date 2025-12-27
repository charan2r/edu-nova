import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  InputAdornment,
  Alert,
  Collapse,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Add animation styles
const fadeIn = {
  animation: "fadeIn 1s",
  "@keyframes fadeIn": {
    from: { opacity: 0, transform: "translateY(40px)" },
    to: { opacity: 1, transform: "none" },
  },
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const res = await axios.post("/api/auth/login", form);
      const { token, role } = res.data;

      // Store token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Navigate based on role
      if (role === "student") {
        navigate("/student");
      } else if (role === "instructor") {
        navigate("/instructor");
      }
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Login failed",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={8}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: "#ffffffdd",
          backdropFilter: "blur(5px)",
          ...fadeIn,
        }}
      >
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Login
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          mb={3}
          color="text.secondary"
        >
          Welcome back! Please enter your credentials
        </Typography>

        <Collapse in={alert.open}>
          <Alert
            severity={alert.severity}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setAlert({ ...alert, open: false })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        </Collapse>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box textAlign={"center"} mt={2}>
            <Button
              type="submit"
              variant="contained"
              size="medium"
              sx={{
                mt: 3,
                py: 1,
                px: 8,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              Login
            </Button>
          </Box>

          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <a
                href="/register"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Register here
              </a>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
