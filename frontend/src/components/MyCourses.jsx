/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState(0);

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/course/student/courses/enrolled",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Error fetching courses");
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

      {/* Hero */}
      <Box
        sx={{
          bgcolor: "#f0f4f8",
          py: 0,
          textAlign: "center",
          position: "relative",
          height: { xs: 320, sm: 420, md: 500 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80"
          alt="Hero"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(59, 57, 57, 0.45)",
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            height: "100%",
            py: { xs: 3, sm: 6 },
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            pr: { xs: 2, sm: 6 },
          }}
        >
          <Box sx={{ textAlign: "right", width: { xs: "100%", sm: "60%" } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="common.white"
              sx={{ fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" } }}
            >
              My Courses
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2.5}
              color="common.white"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" } }}
            >
              Here are the courses you've enrolled in
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Courses */}
      <Container sx={{ mt: 10, mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom
          sx={{
            mb: 8,
            letterSpacing: 1,
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.3rem", md: "2.7rem" },
            textShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <span role="img" aria-label="books">
            📚
          </span>{" "}
          All Courses
        </Typography>
        <Grid container spacing={4}>
          {filtered.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: 400,
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  borderRadius: 4,
                  boxShadow: "0 8px 24px 0 rgba(60,72,88,0.13)",
                  transition:
                    "transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.03)",
                    boxShadow: "0 16px 32px 0 rgba(60,72,88,0.18)",
                  },
                  background:
                    "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
                  border: "1px solid #e3e8ee",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    course.image && course.image.includes("/uploads/")
                      ? `http://localhost:5000${course.image}`
                      : course.image ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={course.name}
                  sx={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80";
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                    sx={{
                      mb: 1,
                      letterSpacing: 0.5,
                      textShadow: "0 1px 4px rgba(80,80,80,0.07)",
                    }}
                  >
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      minHeight: 48,
                      fontSize: "1rem",
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={2}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "#e0e7ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 1,
                        fontSize: 18,
                        color: "#5b6ee1",
                      }}
                    >
                      <span role="img" aria-label="instructor">
                        👨‍🏫
                      </span>
                    </Box>
                    <Typography variant="subtitle2" color="primary">
                      Instructor: {course.instructor?.fullname || "Unknown"}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
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

export default StudentDashboard;
