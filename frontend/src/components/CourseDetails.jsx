/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState(0);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`/api/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setCourses(data);
      setFiltered(data);
    } catch (error) {
      alert("Error fetching course details");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* NavBar */}
      <AppBar
        position="static"
        color="primary"
        sx={{ boxShadow: 3, minHeight: 60 }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Edu Nova
          </Typography>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="inherit"
          >
            <Tab
              icon={<HomeIcon />}
              iconPosition="start"
              label="Home"
              onClick={() => navigate("/student")}
              sx={{ minWidth: 100 }}
            />
            <Tab
              icon={<SchoolIcon />}
              iconPosition="start"
              label="My Courses"
              onClick={() => navigate("/my-courses")}
              sx={{ minWidth: 120 }}
            />
          </Tabs>
          <IconButton color="inherit" onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Courses */}
      <Container sx={{ mt: 10, mb: 6 }}>
        {filtered.length > 0 && (
          <Box
            sx={{
              maxWidth: 700,
              mx: "auto",
              bgcolor: "#fff",
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              boxShadow: 2,
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
              textAlign="center"
            >
              {filtered[0].name}
            </Typography>
            {filtered[0].image && (
              <Box sx={{ mb: 3, textAlign: "center" }}>
                <img
                  src={
                    filtered[0].image?.startsWith("/uploads/")
                      ? `http://localhost:5000${filtered[0].image}`
                      : filtered[0].image ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={filtered[0].name}
                  style={{
                    maxWidth: "100%",
                    borderRadius: 16,
                    boxShadow: "0 4px 16px rgba(60,72,88,0.10)",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80";
                  }}
                />
              </Box>
            )}
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {filtered[0].description}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {filtered[0].content}
            </Typography>
            <Typography
              variant="subtitle2"
              color="primary"
              fontWeight="bold"
              sx={{ mt: 2 }}
            >
              Instructor: {filtered[0].instructor?.fullname || "Unknown"}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 1,
          bgcolor: "primary.main",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
          Edu Nova
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Empowering students to learn and grow. &copy;{" "}
          {new Date().getFullYear()} Edu Nova. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default CourseDetails;
