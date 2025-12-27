/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your AI assistant. What type of courses are you looking for?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // Get courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/course", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
      setFiltered(res.data);
    } catch (error) {
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

  const openEnrollDialog = (course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  // Enroll in course
  const handleEnroll = async () => {
    try {
      await axios.post(
        `/api/course/${selectedCourse._id}/enroll`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Enrolled successfully");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Enrollment failed");
    } finally {
      setDialogOpen(false);
    }
  };

  // Chat functionality
  const handleChatSubmit = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...chatMessages, { sender: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/chat/recommendations",
        { input: userInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const recommendations = response.data.recommendations || [];
      setFiltered(recommendations);

      setChatMessages([
        ...newMessages,
        {
          sender: "bot",
          text:
            recommendations.length > 0
              ? `Here are some courses I recommend based on your query.`
              : "Sorry, I couldn't find any matching courses.",
        },
      ]);
    } catch (err) {
      setChatMessages([
        ...newMessages,
        { sender: "bot", text: "Oops! Something went wrong. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* NavBar */}
      <AppBar
        position="static"
        color="primary"
        sx={{ boxShadow: 3, maxHeight: 60 }}
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
          src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1200&q=80"
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
              Welcome, Student!
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2.5}
              color="common.white"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" } }}
            >
              Explore and enroll in exciting courses tailored for your success.
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

        {/* Chat Assistant Toggle Button */}
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            sx={{ borderRadius: "50%", minWidth: 64, minHeight: 64 }}
            onClick={() => setChatOpen(!chatOpen)}
          ></Button>
        </Box>

        {/* Chat Assistant Panel */}
        {chatOpen && (
          <Box
            sx={{
              position: "fixed",
              bottom: 100,
              right: 20,
              width: 320,
              height: 420,
              bgcolor: "white",
              boxShadow: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              zIndex: 9999,
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: "#5b6ee1",
                color: "white",
                fontWeight: "bold",
              }}
            >
              AI Course Assistant
            </Box>
            <Box
              sx={{
                flex: 1,
                p: 2,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {chatMessages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    bgcolor: msg.sender === "user" ? "#e3f2fd" : "#f3f4f6",
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </Box>
              ))}
            </Box>
            <Box sx={{ p: 1.5, borderTop: "1px solid #ccc" }}>
              <TextField
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
                fullWidth
                placeholder="Ask about a course..."
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleChatSubmit} disabled={loading}>
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        )}

        {/* Courses Grid */}
        <Grid
          container
          spacing={4}
          sx={{ mt: 6, justifyContent: "center", alignItems: "stretch" }}
        >
          {filtered.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: 480,
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
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
                <CardContent
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary"
                    sx={{
                      mb: 1,
                      letterSpacing: 0.5,
                      textShadow: "0 1px 4px rgba(80,80,80,0.07)",
                      height: "4rem",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      minHeight: "3rem",
                      maxHeight: "4.5rem",
                    }}
                  >
                    {course.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: "4.5rem",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      fontSize: "0.9rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {course.description}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    mt="auto"
                    sx={{ height: "2.5rem" }}
                  >
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
                        flexShrink: 0,
                      }}
                    >
                      <span role="img" aria-label="instructor">
                        👨‍🏫
                      </span>
                    </Box>
                    <Typography
                      variant="subtitle2"
                      color="primary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.85rem",
                      }}
                    >
                      Instructor: {course.instructor?.fullname || "Unknown"}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "center", pb: 2, px: 2, mt: "auto" }}
                >
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      fontSize: "0.9rem",
                      minWidth: "80px",
                    }}
                    onClick={() => {
                      navigate(`/course/${course._id}`);
                    }}
                  >
                    Details
                  </Button>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      background:
                        "linear-gradient(90deg, #5b6ee1 60%, #7f9cf5 100%)",
                      boxShadow: "0 2px 8px 0 rgba(91,110,225,0.13)",
                      textTransform: "none",
                      px: 2,
                      py: 1,
                      fontSize: "0.9rem",
                      minWidth: "80px",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #4c51bf 60%, #5b6ee1 100%)",
                      },
                    }}
                    onClick={() => openEnrollDialog(course)}
                  >
                    Enroll
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enroll Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        TransitionComponent={Slide}
      >
        <DialogTitle>Confirm Enrollment</DialogTitle>
        <DialogContent>
          Are you sure you want to enroll in{" "}
          <strong>{selectedCourse?.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>No</Button>
          <Button onClick={handleEnroll} variant="contained">
            Yes, Enroll
          </Button>
        </DialogActions>
      </Dialog>

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
