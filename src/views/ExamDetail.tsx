import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  IconButton,
  Chip,
  CardActionArea,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { EXAMS } from '../data/catalog';
import { useStore } from '../store/useStore';
import { PlayArrow, BookmarkAdd, BookmarkRemove, ArrowBack, School, Description } from '@mui/icons-material';
import { fetchPlaylist } from '../utils/youtube';
import { getPlaylistDurationHours } from '../utils/helpers';

const ExamDetail = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = EXAMS.find((e) => e.id === examId);
  
  const { enrollCourse, unenrollCourse, isEnrolled, preferredExam, setPreferredExam, enrolledCourses, progress } = useStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [loadingPlaylists, setLoadingPlaylists] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (examId && preferredExam !== examId) {
      setPreferredExam(examId);
    }
  }, [examId, preferredExam, setPreferredExam]);

  // Reset selected subject when navigating between exams
  useEffect(() => {
    setSelectedSubjectId(null);
  }, [examId]);

  if (!exam) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>Exam not found</Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }}>Go Home</Button>
      </Container>
    );
  }

  const handleEnroll = async (playlist: any, subjectTitle: string) => {
    try {
      const data = await fetchPlaylist(playlist.id);
      enrollCourse({
        playlistId: data.id,
        title: data.title,
        description: data.description || playlist.description,
        thumbnail: data.thumbnail,
        videos: data.videos,
        exam: exam.id,
        subject: subjectTitle,
        notesUrl: playlist.notesUrl
      });
    } catch (e) {
      // Fallback if scraping fails for catalog items
      enrollCourse({
        playlistId: playlist.id,
        title: playlist.title,
        description: playlist.description,
        videos: [],
        exam: exam.id,
        subject: subjectTitle,
        notesUrl: playlist.notesUrl
      });
    }
  };

  const handleWatchNow = async (playlist: any, subjectTitle: string) => {
    if (isEnrolled(playlist.id)) {
      navigate(`/course/${playlist.id}`);
      return;
    }

    setLoadingPlaylists((prev) => ({ ...prev, [playlist.id]: true }));
    try {
      await handleEnroll(playlist, subjectTitle);
      navigate(`/course/${playlist.id}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlaylists((prev) => ({ ...prev, [playlist.id]: false }));
    }
  };

  const handleBookmarkToggle = async (playlist: any, subjectTitle: string) => {
    if (isEnrolled(playlist.id)) {
      unenrollCourse(playlist.id);
      return;
    }

    setLoadingPlaylists((prev) => ({ ...prev, [playlist.id]: true }));
    try {
      await handleEnroll(playlist, subjectTitle);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlaylists((prev) => ({ ...prev, [playlist.id]: false }));
    }
  };

  const selectedSubject = exam.subjects.find(s => s.id === selectedSubjectId);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Exam Header */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
            {exam.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, fontWeight: 400 }}>
            {exam.description}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate('/select-exam')}
          sx={{ borderRadius: 3, fontWeight: 700, px: 3, py: 1 }}
        >
          Switch Exam
        </Button>
      </Box>

      {selectedSubjectId === null || !selectedSubject ? (
        /* ─── SUBJECTS LIST VIEW ─── */
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
            Subjects
          </Typography>
          <Grid container spacing={4}>
            {exam.subjects.map((subject) => {
              const totalPlaylists = subject.categories.reduce((acc, cat) => acc + cat.playlists.length, 0);

              return (
                <Grid key={subject.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      borderRadius: 5,
                      height: '100%',
                      border: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      backgroundImage: 'none',
                      transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 24px rgba(99,102,241,0.1)'
                      }
                    }}
                    elevation={0}
                  >
                    <CardActionArea
                      onClick={() => setSelectedSubjectId(subject.id)}
                      sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                    >
                      <Box
                        sx={{
                          mb: 2,
                          display: 'inline-flex',
                          p: 2.5,
                          borderRadius: 4,
                          bgcolor: 'rgba(99, 102, 241, 0.05)',
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: 'rgba(99, 102, 241, 0.1)'
                        }}
                      >
                        <School sx={{ fontSize: 40 }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                        {subject.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {totalPlaylists} learning module{totalPlaylists !== 1 ? 's' : ''} available
                      </Typography>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        /* ─── SELECTED SUBJECT VIEW (WITH CATEGORIES & PLAYLISTS) ─── */
        <Box>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setSelectedSubjectId(null)}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Back to Subjects
            </Button>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, borderLeft: 4, borderColor: 'primary.main', pl: 2 }}>
            {selectedSubject.title}
          </Typography>

          {selectedSubject.categories.length === 0 || selectedSubject.categories.every(cat => cat.playlists.length === 0) ? (
            <Box sx={{ textAlign: 'center', py: 8, border: '1px dashed', borderColor: 'divider', borderRadius: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No curated playlists available for this subject yet.
              </Typography>
            </Box>
          ) : (
            selectedSubject.categories.map((category) => {
              if (category.playlists.length === 0) return null;

              return (
                <Box key={category.id} sx={{ mb: 6 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                      letterSpacing: '0.08em',
                      color: 'text.secondary',
                      mb: 2.5
                    }}
                  >
                    {category.title}
                  </Typography>
                  <Grid container spacing={4}>
                    {category.playlists.map((playlist) => {
                      const enrolled = isEnrolled(playlist.id);

                      return (
                        <Grid key={playlist.id} size={{ xs: 12, sm: 6, md: 4 }}>
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
                              transition: 'transform 0.2s',
                              '&:hover': {
                                transform: 'translateY(-4px)'
                              }
                            }}
                            elevation={0}
                          >
                            {/* Playlist Thumbnail */}
                            <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', borderBottom: 1, borderColor: 'divider', overflow: 'hidden' }}>
                              {playlist.firstVideoId ? (
                                <Box
                                  component="img"
                                  src={`https://i.ytimg.com/vi/${playlist.firstVideoId}/maxresdefault.jpg`}
                                  onError={(e: any) => { e.target.src = `https://i.ytimg.com/vi/${playlist.firstVideoId}/hqdefault.jpg`; }}
                                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : playlist.thumbnail ? (
                                <Box
                                  component="img"
                                  src={playlist.thumbnail}
                                  sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', gap: 1 }}>
                                  <PlayArrow sx={{ fontSize: 40, color: 'white', opacity: 0.8 }} />
                                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                                    {selectedSubject.title.toUpperCase()}
                                  </Typography>
                                </Box>
                              )}
                            </Box>

                            <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                              <Stack direction="row" spacing={0.75} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                                <Chip
                                  label={exam.title}
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
                                <Chip
                                  label={selectedSubject.title}
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
                              </Stack>
                              
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  WebkitLineClamp: 2,
                                  display: '-webkit-box',
                                  overflow: 'hidden',
                                  WebkitBoxOrient: 'vertical',
                                  minHeight: '2.8em',
                                  lineHeight: 1.4,
                                  mb: 1
                                }}
                              >
                                {playlist.title}
                              </Typography>
                              
                              {/* Learning Progress Section */}
                              {(() => {
                                const enrolledCourse = enrolledCourses.find(c => c.playlistId === playlist.id);
                                const completedCount = enrolledCourse ? (progress[playlist.id]?.length || 0) : 0;
                                const totalVideos = enrolledCourse ? enrolledCourse.videos.length : 0;
                                const progressVal = totalVideos > 0 ? (completedCount / totalVideos) * 100 : 0;

                                // Calculate duration hours
                                let durationHours = playlist.durationHours;
                                if (enrolledCourse && enrolledCourse.videos.length > 0) {
                                  const hours = getPlaylistDurationHours(enrolledCourse.videos);
                                  if (hours > 0) durationHours = hours;
                                }

                                return (
                                  <Box sx={{ mt: 2, minHeight: '4.8em', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Stack direction="row" sx={{ mb: 0.75, justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                                        LEARNING PROGRESS
                                      </Typography>
                                      <Typography variant="caption" sx={{ fontWeight: 700, color: enrolledCourse ? 'primary.main' : 'text.disabled', fontSize: '0.65rem' }}>
                                        {enrolledCourse 
                                          ? `${completedCount}/${totalVideos} Videos${durationHours ? ` • ${durationHours} hrs` : ''}` 
                                          : `Not Started${durationHours ? ` • ${durationHours} hrs` : ''}`
                                        }
                                      </Typography>
                                    </Stack>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={progressVal} 
                                      sx={{ 
                                        height: 8, 
                                        borderRadius: 4, 
                                        bgcolor: 'divider',
                                        '& .MuiLinearProgress-bar': {
                                          borderRadius: 4
                                        }
                                      }} 
                                    />
                                  </Box>
                                );
                              })()}
                            </CardContent>

                            {/* Actions */}
                            <Stack direction="row" spacing={1} sx={{ p: 2.5, pt: 0 }}>
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={loadingPlaylists[playlist.id] ? null : <PlayArrow />}
                                onClick={() => handleWatchNow(playlist, selectedSubject.title)}
                                sx={{ borderRadius: 3, py: 1 }}
                                disableElevation
                                disabled={loadingPlaylists[playlist.id]}
                              >
                                {loadingPlaylists[playlist.id] 
                                  ? 'Loading...' 
                                  : (enrolled ? 'Continue' : 'Watch Now')
                                }
                              </Button>
                              {playlist.notesUrl && (
                                <Tooltip title="Download Handwritten Notes">
                                  <IconButton
                                    href={playlist.notesUrl}
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
                                onClick={() => handleBookmarkToggle(playlist, selectedSubject.title)}
                                disabled={loadingPlaylists[playlist.id]}
                                sx={{
                                  bgcolor: enrolled ? 'rgba(211, 47, 47, 0.05)' : 'rgba(99, 102, 241, 0.05)',
                                  color: enrolled ? 'error.main' : 'primary.main',
                                  '&:hover': {
                                    bgcolor: enrolled ? 'error.main' : 'primary.main',
                                    color: 'white'
                                  },
                                  borderRadius: 3,
                                  width: 44
                                }}
                              >
                                {enrolled ? <BookmarkRemove fontSize="small" /> : <BookmarkAdd fontSize="small" />}
                              </IconButton>
                            </Stack>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              );
            })
          )}
        </Box>
      )}
    </Container>
  );
};

export default ExamDetail;
