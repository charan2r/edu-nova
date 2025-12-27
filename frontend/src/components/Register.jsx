import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  MenuItem,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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

const Register = () => {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!form.fullname) newErrors.fullname = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      await axios.post("/api/auth/register", form);
      setAlert({
        open: true,
        message: "Registered successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || "Registration failed",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: 6 }}>
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
          Register
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          mb={3}
          color="text.secondary"
        >
          Join our platform and start learning
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
            select
            label="I am a"
            name="role"
            value={form.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AssignmentIndIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="instructor">Instructor</MenuItem>
          </TextField>
          <TextField
            label="Full Name"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.fullname}
            helperText={errors.fullname}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="email"
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
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
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
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box mt={1} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              size="large"
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
              Register
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <a
                href="/login"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Login here
              </a>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};
export default Register;
