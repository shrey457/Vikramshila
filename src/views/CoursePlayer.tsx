import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Button,
  Divider,
  Paper,
  IconButton,
  useTheme,
  LinearProgress,
  Tooltip,
  TextField,
  useMediaQuery,
  Container,
  Tab,
  Tabs,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamShortName } from '../utils/helpers';
import {
  ArrowBack,
  CheckCircle,
  RadioButtonUnchecked,
  DeleteOutlined,
  KeyboardArrowUp,
  KeyboardArrowDown,
  SkipNext,
  SkipPrevious,
  CheckCircleOutlined,
  InfoOutlined,
  NoteAlt,
  List as ListIcon,
  ArrowBackIosNew,
  SaveOutlined,
  EditOutlined,
  DownloadOutlined,
  Description,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';
import YouTube from 'react-youtube';

type PanelView = 'playlist' | 'notes' | 'description';

const formatTime = (seconds: number) => {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface NotesPanelProps {
  compact?: boolean;
  currentVideoId: string | null;
  notes: Record<string, any[]>;
  addNote: (videoId: string, text: string, timestamp: number) => void;
  editNote: (videoId: string, noteId: string, text: string) => void;
  deleteNote: (videoId: string, noteId: string) => void;
  player: any;
}

const NotesPanel = ({ compact = false, currentVideoId, notes, addNote, editNote, deleteNote, player }: NotesPanelProps) => {
  const videoNotes = currentVideoId ? (notes[currentVideoId] || []) : [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState('');
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    setNoteText('');
    setNoteSaved(false);
    setEditingId(null);
  }, [currentVideoId]);

  const handleSaveNew = () => {
    if (!currentVideoId || !noteText.trim()) return;
    const currentTime = player && typeof player.getCurrentTime === 'function' ? player.getCurrentTime() : 0;
    addNote(currentVideoId, noteText.trim(), currentTime);
    setNoteText('');
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleSaveEdit = (id: string) => {
    if (!currentVideoId || !editVal.trim()) return;
    editNote(currentVideoId, id, editVal.trim());
    setEditingId(null);
  };

  const exportNotes = () => {
    if (!currentVideoId || videoNotes.length === 0) return;
    const textContent = videoNotes.map(n => `[${formatTime(n.timestamp)}]\n${n.text}`).join('\n\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${currentVideoId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const jumpToTime = (time: number) => {
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(time, true);
      player.playVideo();
    }
  };

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, height: compact ? 'auto' : '100%', overflowY: 'auto' }}>
      {videoNotes.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Previous Notes</Typography>
          <Button size="small" startIcon={<DownloadOutlined fontSize="small" />} onClick={exportNotes}>Export</Button>
        </Box>
      )}
      
      {videoNotes.map(n => (
        <Paper key={n.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
            <Typography 
              variant="caption" 
              color="primary.main" 
              sx={{ fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={() => jumpToTime(n.timestamp)}
            >
              {formatTime(n.timestamp)}
            </Typography>
            <Box>
              <IconButton size="small" onClick={() => { setEditingId(n.id); setEditVal(n.text); }} sx={{ p: 0.5 }}>
                <EditOutlined fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => currentVideoId && deleteNote(currentVideoId, n.id)} sx={{ p: 0.5 }}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {editingId === n.id ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                multiline fullWidth minRows={2} value={editVal}
                onChange={e => setEditVal(e.target.value)}
                size="small"
              />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                <Button size="small" variant="contained" disableElevation onClick={() => handleSaveEdit(n.id)}>Save</Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{n.text}</Typography>
          )}
        </Paper>
      ))}

      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <TextField
          multiline
          fullWidth
          minRows={compact ? 3 : 4}
          placeholder="Write a new note..."
          value={noteText}
          onChange={e => { setNoteText(e.target.value); setNoteSaved(false); }}
          variant="outlined"
          size="small"
          slotProps={{ input: { sx: { borderRadius: 2, fontSize: '0.875rem' } } }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveNew}
            startIcon={<SaveOutlined fontSize="small" />}
            disableElevation
            sx={{ borderRadius: 2, fontWeight: 700 }}
            disabled={!noteText.trim()}
          >
            Add Note
          </Button>
          {noteSaved && (
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>✓ Added</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const CoursePlayer = () => {
  const { playlistId } = useParams<{ playlistId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { enrolledCourses, progress, toggleVideoCompletion, removeVideo, moveVideo, notes, addNote, editNote, deleteNote } = useStore();
  const course = enrolledCourses.find(c => c.playlistId === playlistId);
  const completedVideos = playlistId ? progress[playlistId] || [] : [];

  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [sidebarView, setSidebarView] = useState<PanelView>('playlist');
  const [mobileTab, setMobileTab] = useState<PanelView>('playlist');
  const [player, setPlayer] = useState<any>(null);
  const [openRename, setOpenRename] = useState(false);
  const [renameTitle, setRenameTitle] = useState('');

  useEffect(() => {
    if (course && course.videos.length > 0 && !currentVideoId) {
      setCurrentVideoId(course.videos[0].id);
    }
  }, [course, currentVideoId]);

  if (!course) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800 }}>Course not found in your library</Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')} disableElevation sx={{ borderRadius: 3 }}>Go to Dashboard</Button>
      </Container>
    );
  }

  const currentIndex = course.videos.findIndex(v => v.id === currentVideoId);
  const currentVideo = course.videos[currentIndex] || course.videos[0];
  const completionPercent = course.videos.length > 0
    ? Math.round((completedVideos.length / course.videos.length) * 100)
    : 0;
  const isCurrentCompleted = currentVideoId ? completedVideos.includes(currentVideoId) : false;

  const goToVideo = (id: string) => {
    setCurrentVideoId(id);
    if (isMobile) setMobileTab('playlist');
  };

  const goNext = () => {
    if (currentIndex < course.videos.length - 1) goToVideo(course.videos[currentIndex + 1].id);
  };

  const goPrev = () => {
    if (currentIndex > 0) goToVideo(course.videos[currentIndex - 1].id);
  };

  // ─── Playlist List (shared) ─────────────────────────────────────
  const PlaylistList = () => (
    <List sx={{ py: 0 }}>
      {course.videos.map((video, index) => {
        const isCompleted = completedVideos.includes(video.id);
        const isActive = currentVideoId === video.id;

        return (
          <Box key={video.id}>
            <ListItem
              disablePadding
              sx={{
                bgcolor: isActive
                  ? (theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)')
                  : 'transparent',
                '&:hover .row-actions': { opacity: 1 },
              }}
            >
              <ListItemButton
                onClick={() => goToVideo(video.id)}
                sx={{ py: 1.5, pl: 4.5, pr: 5, gap: 1.5, alignItems: 'flex-start' }}
              >
                <Box
                  component="img"
                  src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                  sx={{ width: 88, height: 50, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4,
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontSize: '0.8rem',
                    }}
                  >
                    {video.title}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">#{index + 1}</Typography>
                </Box>
              </ListItemButton>

              {/* Complete toggle */}
              <IconButton
                size="small"
                onClick={e => { e.stopPropagation(); toggleVideoCompletion(course.playlistId, video.id); }}
                color={isCompleted ? 'primary' : 'default'}
                sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', p: 0.5 }}
              >
                {isCompleted
                  ? <CheckCircle sx={{ fontSize: 18 }} />
                  : <RadioButtonUnchecked sx={{ fontSize: 18, opacity: 0.35 }} />
                }
              </IconButton>

              {/* Hover action strip — left of thumbnail */}
              <Box className="row-actions" sx={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                opacity: 0, transition: '0.15s',
                bgcolor: isActive
                  ? (theme.palette.mode === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)')
                  : 'background.paper',
                borderRight: 1, borderColor: 'divider',
                px: 0.25, zIndex: 1,
              }}>
                <IconButton size="small" onClick={() => moveVideo(course.playlistId, video.id, 'up')} disabled={index === 0} sx={{ p: 0.25 }}>
                  <KeyboardArrowUp sx={{ fontSize: 16 }} />
                </IconButton>
                <Tooltip title="Remove from playlist">
                  <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); removeVideo(course.playlistId, video.id); }} sx={{ p: 0.25 }}>
                    <DeleteOutlined sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => moveVideo(course.playlistId, video.id, 'down')} disabled={index === course.videos.length - 1} sx={{ p: 0.25 }}>
                  <KeyboardArrowDown sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </ListItem>
            <Divider />
          </Box>
        );
      })}
    </List>
  );



  // ─── Description Panel (shared) ────────────────────────────────
  const DescriptionPanel = () => (
    <Box sx={{ p: 2.5 }}>
      <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5, lineHeight: 1.4 }}>
        {currentVideo?.title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Video #{currentIndex + 1} of {course.videos.length} · {course.title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {course.description || 'No description available for this course.'}
      </Typography>
    </Box>
  );

  // ─── Desktop Sidebar ────────────────────────────────────────────
  const DesktopSidebar = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* Sidebar Header */}
      <Box sx={{
        px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
        display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0,
      }}>
        {sidebarView !== 'playlist' && (
          <IconButton size="small" onClick={() => setSidebarView('playlist')} sx={{ mr: 0.5 }}>
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {sidebarView === 'playlist' && 'Course Content'}
            {sidebarView === 'notes' && 'Notes'}
            {sidebarView === 'description' && 'Description'}
          </Typography>
          {sidebarView === 'playlist'
            ? <Typography variant="caption" color="text.secondary">{completedVideos.length}/{course.videos.length} completed</Typography>
            : <Typography variant="caption" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{currentVideo?.title}</Typography>
          }
        </Box>
      </Box>

      {/* Sidebar Body */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {sidebarView === 'playlist' && <PlaylistList />}
        {sidebarView === 'notes' && <NotesPanel currentVideoId={currentVideoId} notes={notes} addNote={addNote} editNote={editNote} deleteNote={deleteNote} player={player} />}
        {sidebarView === 'description' && <DescriptionPanel />}
      </Box>
    </Box>
  );

  // ═══════════════════════════════════════════════════════════════
  // MOBILE LAYOUT — YouTube style
  // ═══════════════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }}>
        {/* Header */}
        <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 1.5, py: 0.75, bgcolor: 'background.paper', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => navigate('/dashboard')} size="small"><ArrowBack /></IconButton>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mb: 0.25, flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', mr: 0.25 }}>
                  {course.title}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => { setRenameTitle(course.title); setOpenRename(true); }}
                  sx={{ p: 0.25, mr: 0.5, opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <EditOutlined fontSize="small" style={{ fontSize: 12 }} />
                </IconButton>
                {course.exam && (
                  <Chip
                    label={getExamShortName(course.exam)}
                    size="small"
                    sx={{
                      height: 14,
                      fontSize: '0.55rem',
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderRadius: 0.5,
                      '& .MuiChip-label': { px: 0.5 }
                    }}
                  />
                )}
                {course.subject && (
                  <Chip
                    label={course.subject}
                    size="small"
                    sx={{
                      height: 14,
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      bgcolor: 'action.selected',
                      color: 'text.secondary',
                      borderRadius: 0.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      '& .MuiChip-label': { px: 0.5 }
                    }}
                  />
                )}
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress variant="determinate" value={completionPercent} sx={{ flexGrow: 1, height: 3, borderRadius: 2, bgcolor: 'divider' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontSize: '0.65rem' }}>
                  {completedVideos.length}/{course.videos.length}
                </Typography>
              </Box>
            </Box>
            {course.notesUrl && (
              <IconButton
                color="success"
                href={course.notesUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ flexShrink: 0, ml: 1, bgcolor: 'rgba(16, 185, 129, 0.05)' }}
              >
                <Description fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Paper>

        {/* Video — fixed at top, always visible */}
        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#000', flexShrink: 0 }}>
            {currentVideoId && (
              <YouTube
                videoId={currentVideoId}
                opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, rel: 0 } }}
                onReady={(e) => setPlayer(e.target)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            )}
        </Box>

        {/* Controls strip */}
        <Box sx={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center',
          px: 1, py: 0.5,
          borderBottom: 1, borderColor: 'divider',
          bgcolor: 'background.paper',
          gap: 0.25,
        }}>
          <Tooltip title="Previous"><span>
            <IconButton onClick={goPrev} disabled={currentIndex <= 0} size="small"><SkipPrevious /></IconButton>
          </span></Tooltip>
          <Tooltip title="Next"><span>
            <IconButton onClick={goNext} disabled={currentIndex >= course.videos.length - 1} size="small"><SkipNext /></IconButton>
          </span></Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.25 }} />
          <IconButton
            onClick={() => currentVideoId && toggleVideoCompletion(course.playlistId, currentVideoId)}
            size="small"
            color={isCurrentCompleted ? 'primary' : 'default'}
          >
            {isCurrentCompleted ? <CheckCircle fontSize="small" /> : <CheckCircleOutlined fontSize="small" />}
          </IconButton>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: isCurrentCompleted ? 'primary.main' : 'text.secondary', cursor: 'pointer', fontSize: '0.7rem' }}
            onClick={() => currentVideoId && toggleVideoCompletion(course.playlistId, currentVideoId)}
          >
            {isCurrentCompleted ? 'Done' : 'Mark done'}
          </Typography>
        </Box>

        {/* Tab bar */}
        <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs
            value={mobileTab}
            onChange={(_, v) => setMobileTab(v)}
            variant="fullWidth"
            sx={{ minHeight: 40, '& .MuiTab-root': { minHeight: 40, fontSize: '0.75rem', py: 0.5 } }}
          >
            <Tab icon={<ListIcon sx={{ fontSize: 16 }} />} iconPosition="start" label="Playlist" value="playlist" />
            <Tab icon={<NoteAlt sx={{ fontSize: 16 }} />} iconPosition="start" label="Notes" value="notes" />
            <Tab icon={<InfoOutlined sx={{ fontSize: 16 }} />} iconPosition="start" label="Info" value="description" />
          </Tabs>
        </Box>

        {/* Tab content — scrollable */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'background.default' }}>
          {mobileTab === 'playlist' && <PlaylistList />}
          {mobileTab === 'notes' && <NotesPanel compact currentVideoId={currentVideoId} notes={notes} addNote={addNote} editNote={editNote} deleteNote={deleteNote} player={player} />}
          {mobileTab === 'description' && <DescriptionPanel />}
        </Box>
      </Box>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ═══════════════════════════════════════════════════════════════
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* Header */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', px: 2, py: 1, bgcolor: 'background.paper', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate('/dashboard')} size="small"><ArrowBack /></IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', mr: 0.25 }}>
                {course.title}
              </Typography>
              <Tooltip title="Rename Course">
                <IconButton 
                  size="small" 
                  onClick={() => { setRenameTitle(course.title); setOpenRename(true); }}
                  sx={{ p: 0.5, mr: 0.5, opacity: 0.6, '&:hover': { opacity: 1 } }}
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              {course.exam && (
                <Chip
                  label={getExamShortName(course.exam)}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 0.75,
                    '& .MuiChip-label': { px: 0.75 }
                  }}
                />
              )}
              {course.subject && (
                <Chip
                  label={course.subject}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    bgcolor: 'action.selected',
                    color: 'text.secondary',
                    borderRadius: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                    '& .MuiChip-label': { px: 0.75 }
                  }}
                />
              )}
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <LinearProgress variant="determinate" value={completionPercent} sx={{ width: 140, height: 4, borderRadius: 3, bgcolor: 'divider', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{completedVideos.length}/{course.videos.length} done</Typography>
            </Box>
          </Box>
          {course.notesUrl && (
            <Button
              variant="outlined"
              color="success"
              size="small"
              startIcon={<Description />}
              href={course.notesUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                px: 2,
                py: 0.75,
                flexShrink: 0,
                borderColor: 'success.main',
                color: 'success.main',
                '&:hover': {
                  bgcolor: 'rgba(16, 185, 129, 0.05)',
                  borderColor: 'success.dark',
                }
              }}
            >
              Handwritten Notes
            </Button>
          )}
        </Box>
      </Paper>

      {/* Main */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Video + Controls */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', bgcolor: '#000', flexShrink: 0 }}>
            {currentVideoId && (
              <YouTube
                videoId={currentVideoId}
                opts={{ width: '100%', height: '100%', playerVars: { autoplay: 1, rel: 0 } }}
                onReady={(e) => setPlayer(e.target)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            )}
          </Box>

          {/* Controls Bar */}
          <Box sx={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center',
            px: 1.5, py: 0.75,
            borderBottom: 1, borderColor: 'divider',
            bgcolor: 'background.paper',
            gap: 0.5, minHeight: 48,
          }}>
            <Tooltip title="Previous"><span>
              <IconButton onClick={goPrev} disabled={currentIndex <= 0} size="small"><SkipPrevious /></IconButton>
            </span></Tooltip>
            <Tooltip title="Next"><span>
              <IconButton onClick={goNext} disabled={currentIndex >= course.videos.length - 1} size="small"><SkipNext /></IconButton>
            </span></Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            <Tooltip title={isCurrentCompleted ? 'Mark Incomplete' : 'Mark Complete'}>
              <IconButton onClick={() => currentVideoId && toggleVideoCompletion(course.playlistId, currentVideoId)} size="small" color={isCurrentCompleted ? 'primary' : 'default'}>
                {isCurrentCompleted ? <CheckCircle /> : <CheckCircleOutlined />}
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: isCurrentCompleted ? 'primary.main' : 'text.secondary', cursor: 'pointer', userSelect: 'none', mr: 0.5 }}
              onClick={() => currentVideoId && toggleVideoCompletion(course.playlistId, currentVideoId)}
            >
              {isCurrentCompleted ? 'Completed' : 'Mark done'}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Notes">
              <IconButton size="small" onClick={() => setSidebarView(sidebarView === 'notes' ? 'playlist' : 'notes')} color={sidebarView === 'notes' ? 'secondary' : 'default'}>
                <NoteAlt fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: sidebarView === 'notes' ? 'secondary.main' : 'text.secondary', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSidebarView(sidebarView === 'notes' ? 'playlist' : 'notes')}
            >Notes</Typography>

            <Box sx={{ width: 8 }} />

            <Tooltip title="Description">
              <IconButton size="small" onClick={() => setSidebarView(sidebarView === 'description' ? 'playlist' : 'description')} color={sidebarView === 'description' ? 'primary' : 'default'}>
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: sidebarView === 'description' ? 'primary.main' : 'text.secondary', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setSidebarView(sidebarView === 'description' ? 'playlist' : 'description')}
            >Info</Typography>
          </Box>

          <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }} />
        </Box>

        {/* Desktop Sidebar */}
        <Box sx={{ width: { md: 360, lg: 410 }, flexShrink: 0, borderLeft: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DesktopSidebar />
        </Box>
      </Box>
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
              if (renameTitle.trim() && playlistId) {
                useStore.getState().renameCourse(playlistId, renameTitle.trim());
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
    </Box>
  );
};

export default CoursePlayer;
