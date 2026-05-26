import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  LinearProgress,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Fade,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import { Delete, PlayArrow, AddLink, YouTube, School, ArrowForward, ArrowBack as ArrowBackIcon, Search, Close, SearchOff, Description, EditOutlined } from '@mui/icons-material';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { getPlaylistId, fetchPlaylist } from '../utils/youtube';
import { EXAMS } from '../data/catalog';
import { getExamShortName, getPlaylistDurationHours } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { enrolledCourses, unenrollCourse, progress } = useStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=exam, 1=subject, 2=url
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openRename, setOpenRename] = useState(false);
  const [renamePlaylistId, setRenamePlaylistId] = useState('');
  const [renameTitle, setRenameTitle] = useState('');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterExam, setFilterExam] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Derive unique exams/subjects from enrolled courses for filter chips
  const enrolledSubjectsForExam = [...new Set(
    enrolledCourses
      .filter(c => !filterExam || c.exam === filterExam)
      .map(c => c.subject)
      .filter(Boolean)
  )] as string[];

  const filteredCourses = enrolledCourses.filter(course => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || course.title.toLowerCase().includes(q) || (course.subject || '').toLowerCase().includes(q);
    const matchesExam = !filterExam || course.exam === filterExam;
    const matchesSubject = !filterSubject || course.subject === filterSubject;
    return matchesSearch && matchesExam && matchesSubject;
  });

  const resetDialog = () => {
    setStep(0);
    setSelectedExam('');
    setSelectedSubject('');
    setCustomSubject('');
    setPlaylistUrl('');
    setError('');
  };

  const handleOpen = () => { resetDialog(); setOpen(true); };
  const handleClose = () => { if (!loading) { setOpen(false); resetDialog(); } };

  const examObj = EXAMS.find(e => e.id === selectedExam);
  const subjectLabel = selectedSubject === '__custom__' ? customSubject.trim() : selectedSubject;

  const handleAddPlaylist = async () => {
    setError('');
    const playlistId = getPlaylistId(playlistUrl);
    
    if (!playlistId) {
      setError('Invalid YouTube playlist URL. Make sure it contains "list="');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPlaylist(playlistId);
      useStore.getState().enrollCourse({
        playlistId: data.id,
        title: data.title,
        description: data.description || `by ${data.uploader}`,
        thumbnail: data.thumbnail,
        videos: data.videos,
        exam: selectedExam || undefined,
        subject: subjectLabel || undefined,
      });
      handleClose();
      setSuccess('Playlist added successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch playlist. Try another URL or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.02em' }}>
            My Courses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You are enrolled in {enrolledCourses.length} learning modules.
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          size="large" 
          startIcon={<AddLink />} 
          onClick={() => handleOpen()}
          sx={{ px: 4, py: 1.5, borderRadius: 3 }}
          disableElevation
        >
          Import YouTube Playlist
        </Button>
      </Box>

      {/* Search + Filters — only show when courses exist */}
      {enrolledCourses.length > 0 && (
        <Box 
          sx={{ 
            mb: 3, 
            display: 'flex', 
            flexDirection: 'row', 
            gap: 2, 
            alignItems: 'center',
            overflowX: 'auto',
            pt: 1.5, // Padding for floating labels
            pb: 1, // Padding for scrollbar
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 3 }
          }}
        >
          {/* Search bar */}
          <TextField
            size="small"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            sx={{ flexShrink: 0, minWidth: 220 }}
            slotProps={{
              input: {
                startAdornment: <Search sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />,
                sx: { borderRadius: 3 },
                endAdornment: searchQuery ? (
                  <IconButton size="small" onClick={() => setSearchQuery('')}><Close fontSize="small" /></IconButton>
                ) : null
              }
            }}
          />

          {/* Exam dropdown */}
          <FormControl size="small" sx={{ minWidth: 160, flexShrink: 0 }}>
            <InputLabel>Exam</InputLabel>
            <Select
              label="Exam"
              value={filterExam}
              onChange={e => { setFilterExam(e.target.value); setFilterSubject(''); }}
              sx={{ borderRadius: 3 }}
              MenuProps={{ slotProps: { paper: { style: { maxHeight: 48 * 3.5 } } } }}
            >
              <MenuItem value=""><em>All Exams</em></MenuItem>
              {EXAMS.map(exam => (
                <MenuItem key={exam.id} value={exam.id}>{exam.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Subject dropdown — disabled until exam is chosen */}
          <FormControl size="small" sx={{ minWidth: 160, flexShrink: 0 }} disabled={!filterExam}>
            <InputLabel>Subject</InputLabel>
            <Select
              label="Subject"
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              sx={{ borderRadius: 3 }}
              MenuProps={{ slotProps: { paper: { style: { maxHeight: 48 * 3.5 } } } }}
            >
              <MenuItem value=""><em>All Subjects</em></MenuItem>
              {enrolledSubjectsForExam.map(subject => (
                <MenuItem key={subject} value={subject}>{subject}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Clear button — only when filters are active */}
          {(filterExam || filterSubject || searchQuery) && (
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => { setFilterExam(''); setFilterSubject(''); setSearchQuery(''); }}
              sx={{ borderRadius: 3, height: 40, whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              Clear
            </Button>
          )}
        </Box>
      )}

      {/* Course Grid */}
      {enrolledCourses.length === 0 ? (
        <Fade in timeout={800}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 15, 
              bgcolor: 'rgba(255,255,255,0.02)', 
              borderRadius: 6, 
              border: '1px dashed', 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2
            }}
          >
            <School sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              No active courses
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
              Add a custom YouTube playlist or explore our curated catalog to begin your journey.
            </Typography>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
              <Button variant="outlined" size="large" onClick={() => navigate('/')} sx={{ borderRadius: 3 }}>
                Browse Catalog
              </Button>
              <Button variant="contained" size="large" onClick={() => handleOpen()} sx={{ borderRadius: 3 }} disableElevation>
                Import Course
              </Button>
            </Stack>
          </Box>
        </Fade>
      ) : filteredCourses.length === 0 ? (
        /* No results from search/filter */
        <Box sx={{ textAlign: 'center', py: 10, borderRadius: 6, border: '1px dashed', borderColor: 'divider' }}>
          <SearchOff sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>No courses match your filters</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Try adjusting the search or clearing the filters.</Typography>
          <Button variant="outlined" size="small" onClick={() => { setFilterExam(''); setFilterSubject(''); setSearchQuery(''); }} sx={{ borderRadius: 3 }}>
            Clear filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {filteredCourses.map((course, index) => {
            const completedCount = progress[course.playlistId]?.length || 0;
            const progressVal = course.videos.length > 0 ? (completedCount / course.videos.length) * 100 : 0;

            return (
              <Grid key={course.playlistId} size={{ xs: 12, sm: 6, md: 4, xl: 3 }}>
                <Fade in timeout={400 + (index * 100)}>
                  <Card 
                    sx={{ 
                      borderRadius: 5, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      border: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      backgroundImage: 'none',
                      transition: 'transform 0.2s, border-color 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main'
                      }
                    }} 
                    elevation={0}
                  >
                    {course.videos.length > 0 && (
                      <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', borderBottom: 1, borderColor: 'divider', overflow: 'hidden' }}>
                        <Box 
                          component="img" 
                          src={`https://i.ytimg.com/vi/${course.videos[0].id}/maxresdefault.jpg`}
                          onError={(e: any) => { e.target.src = `https://i.ytimg.com/vi/${course.videos[0].id}/hqdefault.jpg`; }}
                          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </Box>
                    )}
                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      {(course.exam || course.subject) && (
                        <Stack direction="row" spacing={0.75} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                          {course.exam && (
                            <Chip
                              label={getExamShortName(course.exam)}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                borderRadius: 1,
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                          {course.subject && (
                            <Chip
                              label={course.subject}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 600,
                                bgcolor: 'action.selected',
                                color: 'text.secondary',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                        </Stack>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, WebkitLineClamp: 2, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', minHeight: '2.8em', lineHeight: 1.4, mb: 0, flexGrow: 1 }}>
                          {course.title}
                        </Typography>
                        <Tooltip title="Rename Course">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setRenamePlaylistId(course.playlistId); 
                              setRenameTitle(course.title); 
                              setOpenRename(true); 
                            }}
                            sx={{ opacity: 0.6, '&:hover': { opacity: 1 }, ml: 0.5, p: 0.5 }}
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        {(() => {
                          const durationHours = getPlaylistDurationHours(course.videos);
                          return (
                            <>
                              <Stack direction="row" sx={{ mb: 1, justifyContent: 'space-between' }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>LEARNING PROGRESS</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                  {completedCount}/{course.videos.length} Videos{durationHours > 0 ? ` • ${durationHours} hrs` : ''}
                                </Typography>
                              </Stack>
                              <LinearProgress variant="determinate" value={progressVal} sx={{ height: 8, borderRadius: 4, bgcolor: 'divider' }} />
                            </>
                          );
                        })()}
                      </Box>
                    </CardContent>
                    <Stack direction="row" spacing={1} sx={{ p: 2.5, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/course/${course.playlistId}`)}
                        sx={{ borderRadius: 3, py: 1 }}
                        disableElevation
                      >
                        Continue
                      </Button>
                      {course.notesUrl && (
                        <Tooltip title="Download Handwritten Notes">
                          <IconButton
                            href={course.notesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              bgcolor: 'rgba(16, 185, 129, 0.05)',
                              color: 'success.main',
                              '&:hover': {
                                bgcolor: 'success.main',
                                color: 'white'
                              },
                              borderRadius: 3,
                              width: 44
                            }}
                          >
                            <Description fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <IconButton 
                        onClick={() => unenrollCourse(course.playlistId)}
                        sx={{ 
                          bgcolor: 'rgba(211, 47, 47, 0.05)', 
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.main', color: 'white' },
                          borderRadius: 3,
                          width: 44
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Import Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 5, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.4rem', pb: 0.5 }}>
          Import YouTube Course
        </DialogTitle>

        {/* Stepper */}
        <Box sx={{ px: 3, pt: 1, pb: 2 }}>
          <Stepper activeStep={step} sx={{ '& .MuiStepLabel-label': { fontSize: '0.8rem' } }}>
            <Step><StepLabel>Exam</StepLabel></Step>
            <Step><StepLabel>Subject</StepLabel></Step>
            <Step><StepLabel>Playlist URL</StepLabel></Step>
          </Stepper>
        </Box>

        <DialogContent sx={{ pt: 0 }}>

          {/* ── Step 0: Exam ── */}
          {step === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Which exam are you preparing for?
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {EXAMS.map(exam => (
                  <Chip
                    key={exam.id}
                    label={exam.title}
                    onClick={() => setSelectedExam(exam.id)}
                    variant={selectedExam === exam.id ? 'filled' : 'outlined'}
                    color={selectedExam === exam.id ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.85rem', py: 2.5, px: 1 }}
                  />
                ))}
                <Chip
                  label="Other / Custom"
                  onClick={() => setSelectedExam('__other__')}
                  variant={selectedExam === '__other__' ? 'filled' : 'outlined'}
                  color={selectedExam === '__other__' ? 'secondary' : 'default'}
                  sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.85rem', py: 2.5, px: 1 }}
                />
              </Box>
            </Box>
          )}

          {/* ── Step 1: Subject ── */}
          {step === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose a subject{examObj ? ` for ${examObj.title}` : ''}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {(examObj?.subjects || []).map(sub => (
                  <Chip
                    key={sub.id}
                    label={sub.title}
                    onClick={() => setSelectedSubject(sub.title)}
                    variant={selectedSubject === sub.title ? 'filled' : 'outlined'}
                    color={selectedSubject === sub.title ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.85rem', py: 2.5, px: 1 }}
                  />
                ))}
                <Chip
                  label="Custom Subject"
                  onClick={() => setSelectedSubject('__custom__')}
                  variant={selectedSubject === '__custom__' ? 'filled' : 'outlined'}
                  color={selectedSubject === '__custom__' ? 'secondary' : 'default'}
                  sx={{ fontWeight: 600, borderRadius: 2, fontSize: '0.85rem', py: 2.5, px: 1 }}
                />
              </Box>
              {selectedSubject === '__custom__' && (
                <TextField
                  autoFocus
                  fullWidth
                  label="Enter subject name"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  sx={{ mt: 2 }}
                  size="small"
                  slotProps={{ input: { sx: { borderRadius: 2 } } }}
                />
              )}
            </Box>
          )}

          {/* ── Step 2: URL ── */}
          {step === 2 && (
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {selectedExam && (
                  <Chip size="small" label={examObj?.title || selectedExam} color="primary" variant="outlined" />
                )}
                {subjectLabel && (
                  <Chip size="small" label={subjectLabel} color="secondary" variant="outlined" />
                )}
              </Box>
              <TextField
                autoFocus
                fullWidth
                label="YouTube Playlist URL"
                placeholder="https://www.youtube.com/playlist?list=..."
                variant="outlined"
                value={playlistUrl}
                onChange={e => { setPlaylistUrl(e.target.value); setError(''); }}
                disabled={loading}
                slotProps={{
                  input: {
                    startAdornment: <YouTube sx={{ color: 'error.main', mr: 1 }} />,
                    sx: { borderRadius: 3 }
                  }
                }}
              />
              {error && (
                <Alert severity="error" sx={{ borderRadius: 3, mt: 2 }}>{error}</Alert>
              )}
              {loading && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress sx={{ borderRadius: 4, height: 5, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    Fetching playlist data...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'space-between' }}>
          <Button onClick={step === 0 ? handleClose : () => setStep(s => s - 1)} disabled={loading} sx={{ fontWeight: 700 }} startIcon={step > 0 ? <ArrowBackIcon /> : undefined}>
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          {step < 2 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 0 && !selectedExam) ||
                (step === 1 && !selectedSubject) ||
                (step === 1 && selectedSubject === '__custom__' && !customSubject.trim())
              }
              sx={{ px: 3, borderRadius: 3, fontWeight: 700 }}
              disableElevation
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleAddPlaylist}
              disabled={loading || !playlistUrl.trim()}
              sx={{ px: 4, borderRadius: 3, fontWeight: 700 }}
              disableElevation
            >
              {loading ? 'Importing...' : 'Add Course'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog 
        open={openRename} 
        onClose={() => setOpenRename(false)} 
        maxWidth="xs" 
        fullWidth 
        slotProps={{ paper: { sx: { borderRadius: 5, p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Rename Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={renameTitle}
            onChange={e => setRenameTitle(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            slotProps={{ input: { sx: { borderRadius: 2 } } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenRename(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => { 
              if (renameTitle.trim()) {
                useStore.getState().renameCourse(renamePlaylistId, renameTitle.trim());
                setOpenRename(false);
              }
            }}
            sx={{ borderRadius: 2 }}
            disableElevation
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%', borderRadius: 3 }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
