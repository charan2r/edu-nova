import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import axios from "axios";

const token = localStorage.getItem("token");

const CourseStudents = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/course/instructor/courses/${id}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data))
      .catch(() => setStudents([]));
  }, [id]);

  return (
    <>
      {/* NavBar */}
      <AppBar position="static" color="primary" sx={{ boxShadow: 3 }}>
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
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Enrolled Students
        </Typography>
        {students.length === 0 ? (
          <Typography>No students enrolled in this course.</Typography>
        ) : (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Table
              sx={{
                mt: 3,
                minWidth: 400,
                maxWidth: 600,
                borderRadius: 3,
                boxShadow: "0 4px 24px 0 rgba(60,72,88,0.13)",
                background:
                  "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
                overflow: "hidden",
              }}
            >
              <TableHead>
                <TableRow sx={{ background: "#5b6ee1" }}>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      letterSpacing: 1,
                      border: "none",
                      textAlign: "center",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      letterSpacing: 1,
                      border: "none",
                      textAlign: "center",
                    }}
                  >
                    Email
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, idx) => (
                  <TableRow
                    key={student._id}
                    sx={{
                      background: idx % 2 === 0 ? "#f3f6fd" : "#e0e7ff",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      sx={{
                        border: "none",
                        fontWeight: 500,
                        textAlign: "center",
                      }}
                    >
                      {student.fullname}
                    </TableCell>
                    <TableCell sx={{ border: "none", textAlign: "center" }}>
                      {student.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Container>
    </>
  );
};

export default CourseStudents;
