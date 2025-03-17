import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data - Replace with actual API calls
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'blocked', role: 'user' },
  { id: 3, name: 'Admin User', email: 'admin@kodjobs.com', status: 'active', role: 'admin' },
];

const mockJobs = [
  { id: 1, title: 'Senior React Developer', company: 'Tech Corp', status: 'active', applications: 12 },
  { id: 2, title: 'UX Designer', company: 'Design Studio', status: 'pending', applications: 5 },
  { id: 3, title: 'Product Manager', company: 'Startup Inc', status: 'closed', applications: 20 },
];

const mockStats = {
  totalUsers: 150,
  activeJobs: 45,
  totalApplications: 320,
  premiumUsers: 25,
};

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [alert, setAlert] = useState<{ show: boolean; message: string; severity: 'success' | 'error' }>({
    show: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    setAlert({
      show: true,
      message: 'Item deleted successfully',
      severity: 'success',
    });
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    // Implement status change functionality
    setAlert({
      show: true,
      message: `Status changed to ${newStatus}`,
      severity: 'success',
    });
  };

  const handleSaveEdit = () => {
    // Implement save functionality
    setEditDialogOpen(false);
    setAlert({
      show: true,
      message: 'Changes saved successfully',
      severity: 'success',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Dashboard" />
            <Tab label="Users" />
            <Tab label="Jobs" />
            <Tab label="Reports" />
          </Tabs>
        </Box>

        {/* Dashboard */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4">{mockStats.totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active Jobs
                  </Typography>
                  <Typography variant="h4">{mockStats.activeJobs}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Applications
                  </Typography>
                  <Typography variant="h4">{mockStats.totalApplications}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Premium Users
                  </Typography>
                  <Typography variant="h4">{mockStats.premiumUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Users */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(user)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'blocked' : 'active')}
                        size="small"
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                      <IconButton onClick={() => handleDelete(user.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Jobs */}
        <TabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applications</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Chip
                        label={job.status}
                        color={
                          job.status === 'active'
                            ? 'success'
                            : job.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{job.applications}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(job)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(job.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Reports */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Coming Soon
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Advanced reporting and analytics features will be available in the next update.
          </Typography>
        </TabPanel>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit {selectedItem?.name || selectedItem?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedItem && Object.keys(selectedItem).map((key) => {
              if (key !== 'id') {
                return (
                  <TextField
                    key={key}
                    fullWidth
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    defaultValue={selectedItem[key]}
                    margin="normal"
                  />
                );
              }
              return null;
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert */}
      {alert.show && (
        <Alert
          severity={alert.severity}
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClose={() => setAlert({ ...alert, show: false })}
        >
          {alert.message}
        </Alert>
      )}
    </Container>
  );
};

export default Admin; 