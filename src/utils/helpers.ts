import { EXAMS } from '../data/catalog';

export const getExamShortName = (examId?: string): string => {
  if (!examId) return '';
  if (examId === 'jee') return 'JEE';
  if (examId === 'neet') return 'NEET';
  if (examId === 'cat') return 'CAT';
  if (examId === 'upsc') return 'UPSC';
  if (examId === 'gate') return 'GATE';
  if (examId === 'boards') return 'Boards';
  if (examId === '__other__') return 'Other';
  
  const exam = EXAMS.find(e => e.id === examId);
  return exam ? exam.title : examId.toUpperCase();
};
export const parseDurationToSeconds = (durationStr?: string | number): number => {
  if (durationStr === undefined || durationStr === null) return 0;
  if (typeof durationStr === 'number') return durationStr;
  
  const str = durationStr.toString().trim();
  if (!str) return 0;
  
  // If it's a pure number of seconds (e.g. "615")
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10);
  }
  
  // If it's in standard HH:MM:SS or MM:SS format
  const parts = str.split(':').map(p => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

export const getPlaylistDurationHours = (videos?: { duration?: string | number }[]): number => {
  if (!videos || !videos.length) return 0;
  const totalSeconds = videos.reduce((acc, video) => acc + parseDurationToSeconds(video.duration), 0);
  return parseFloat((totalSeconds / 3600).toFixed(1));
};
