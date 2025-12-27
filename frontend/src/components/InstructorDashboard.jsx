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
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    content: "",
    image: "",
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    content: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [addImage, setAddImage] = useState(null);

  const token = localStorage.getItem("token");

  // fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/course/my-courses", {
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

  // logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleImage = (e) => {
    setAddImage(e.target.files[0]);
  };

  {
    /* opening dialogs */
  }
  const openEditDialog = (course) => {
    setSelectedCourse(course);
    setEditForm({
      name: course.name,
      description: course.description,
      content: course.content,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  // handle edit form
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // handle edit course
  const handleEdit = async () => {
    try {
      await axios.put(`/api/course/${selectedCourse._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course updated successfully");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setEditDialogOpen(false);
    }
  };

  // handle delete course
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/course/${selectedCourse._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Course deleted successfully");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleAddChange = (e) => {
    setAddForm({
      ...addForm,
      [e.target.name]: e.target.value,
    });
  };

  // handle add course
  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("name", addForm.name);
      formData.append("description", addForm.description);
      formData.append("content", addForm.content);
      if (addImage) formData.append("image", addImage);

      await axios.post("/api/course", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAddDialogOpen(false);
      setAddForm({ name: "", description: "", content: "" });
      setAddImage(null);
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding course");
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
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
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
              Welcome, Instructor!
            </Typography>
            <Typography
              variant="subtitle1"
              mt={2.5}
              color="common.white"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" } }}
            >
              Explore and manage your courses effectively.
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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
              px: 3,
              py: 1,
              fontSize: "1rem",
              boxShadow: "0 2px 8px 0 rgba(91,110,225,0.13)",
            }}
            onClick={() => {
              setAddDialogOpen(true);
            }}
          >
            Add Course
          </Button>
        </Box>
        <Grid container spacing={12} sx={{ mt: 6, justifyContent: "center" }}>
          {filtered.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
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
                  height="160"
                  image={
                    course.image?.startsWith("/uploads/")
                      ? `http://localhost:5000${course.image}`
                      : course.image ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80"
                  }
                  alt={course.name}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    aspectRatio: "16/9",
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
                <CardActions sx={{ justifyContent: "center", pb: 1, px: 1 }}>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      fontSize: "1rem",
                    }}
                    onClick={() =>
                      navigate(`/instructor/my-students/${course._id}`)
                    }
                  >
                    View Students
                  </Button>
                  <Button
                    size="medium"
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      fontSize: "1rem",
                    }}
                    onClick={() => {
                      openEditDialog(course);
                    }}
                  >
                    Edit
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
                      px: 3,
                      py: 1,
                      fontSize: "1rem",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #4c51bf 60%, #5b6ee1 100%)",
                      },
                    }}
                    onClick={() => openDeleteDialog(course)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle
          sx={{
            color: "#5b6ee1",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Add Course
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Course Name"
            name="name"
            value={addForm.name}
            onChange={handleAddChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={addForm.description}
            onChange={handleAddChange}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            value={addForm.content}
            onChange={handleAddChange}
            fullWidth
            multiline
            minRows={3}
          />
          <Typography
            sx={{ mt: 2, mb: 1, fontWeight: 500, color: "primary.main" }}
          >
            Upload Course Image
          </Typography>
          <label
            htmlFor="add-course-image"
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: "linear-gradient(90deg, #5b6ee1 60%, #7f9cf5 100%)",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              marginBottom: 8,
              boxShadow: "0 2px 8px 0 rgba(91,110,225,0.13)",
            }}
          >
            Choose Image
            <input
              id="add-course-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              style={{ display: "none" }}
            />
          </label>
          {addImage && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {addImage.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle
          sx={{
            color: "#5b6ee1",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Edit Course
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Course Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            margin="dense"
            label="Content"
            name="content"
            value={editForm.content}
            onChange={handleEditChange}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{selectedCourse?.title}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No</Button>
          <Button onClick={handleDelete} variant="contained">
            Yes, Delete
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

export default InstructorDashboard;
