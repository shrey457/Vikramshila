import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface YTVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
}

export interface EnrolledCourse {
  playlistId: string;
  title: string;
  description: string;
  thumbnail?: string;
  videos: YTVideo[];
  exam?: string;        // e.g. 'jee', 'neet'
  subject?: string;     // e.g. 'Physics', 'Mathematics'
  notesUrl?: string;
}

export interface Note {
  id: string;
  text: string;
  timestamp: number;
}

interface VikramshilaState {
  enrolledCourses: EnrolledCourse[];
  progress: Record<string, string[]>; // playlistId -> completedVideoIds
  notes: Record<string, Note[]>; // videoId -> Note[]
  preferredExam: string | null;
  setPreferredExam: (exam: string | null) => void;
  
  enrollCourse: (course: EnrolledCourse) => void;
  unenrollCourse: (playlistId: string) => void;
  renameCourse: (playlistId: string, newTitle: string) => void;
  
  // Advanced Playlist Management
  removeVideo: (playlistId: string, videoId: string) => void;
  moveVideo: (playlistId: string, videoId: string, direction: 'up' | 'down') => void;
  
  toggleVideoCompletion: (playlistId: string, videoId: string) => void;
  isEnrolled: (playlistId: string) => boolean;

  // Notes management
  addNote: (videoId: string, text: string, timestamp: number) => void;
  editNote: (videoId: string, noteId: string, text: string) => void;
  deleteNote: (videoId: string, noteId: string) => void;
}

export const useStore = create<VikramshilaState>()(
  persist(
    (set, get) => ({
      enrolledCourses: [],
      progress: {},
      notes: {},
      preferredExam: null,

      enrollCourse: (course) => {
        if (!get().isEnrolled(course.playlistId)) {
          set((state) => ({
            enrolledCourses: [...state.enrolledCourses, course],
          }));
        } else {
          set((state) => ({
            enrolledCourses: state.enrolledCourses.map(c => 
              c.playlistId === course.playlistId ? course : c
            )
          }));
        }
      },

      unenrollCourse: (playlistId) => {
        set((state) => ({
          enrolledCourses: state.enrolledCourses.filter((c) => c.playlistId !== playlistId),
          progress: { ...state.progress, [playlistId]: [] }
        }));
      },

      renameCourse: (playlistId, newTitle) => {
        set((state) => ({
          enrolledCourses: state.enrolledCourses.map((c) =>
            c.playlistId === playlistId ? { ...c, title: newTitle } : c
          ),
        }));
      },

      removeVideo: (playlistId, videoId) => {
        set((state) => ({
          enrolledCourses: state.enrolledCourses.map(course => 
            course.playlistId === playlistId 
              ? { ...course, videos: course.videos.filter(v => v.id !== videoId) }
              : course
          ),
          progress: {
            ...state.progress,
            [playlistId]: (state.progress[playlistId] || []).filter(id => id !== videoId)
          }
        }));
      },

      moveVideo: (playlistId, videoId, direction) => {
        set((state) => ({
          enrolledCourses: state.enrolledCourses.map(course => {
            if (course.playlistId !== playlistId) return course;
            
            const index = course.videos.findIndex(v => v.id === videoId);
            if (index === -1) return course;
            
            const newVideos = [...course.videos];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            
            if (targetIndex < 0 || targetIndex >= newVideos.length) return course;
            
            [newVideos[index], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[index]];
            
            return { ...course, videos: newVideos };
          })
        }));
      },

      toggleVideoCompletion: (playlistId, videoId) => {
        set((state) => {
          const playlistProgress = state.progress[playlistId] || [];
          const isCompleted = playlistProgress.includes(videoId);
          
          const newProgress = isCompleted
            ? playlistProgress.filter((id) => id !== videoId)
            : [...playlistProgress, videoId];

          return {
            progress: {
              ...state.progress,
              [playlistId]: newProgress,
            },
          };
        });
      },

      isEnrolled: (playlistId) => {
        return get().enrolledCourses.some((c) => c.playlistId === playlistId);
      },

      addNote: (videoId, text, timestamp) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [videoId]: [
              ...(state.notes[videoId] || []),
              { id: crypto.randomUUID(), text, timestamp }
            ]
          }
        }));
      },

      editNote: (videoId, noteId, newText) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [videoId]: (state.notes[videoId] || []).map(note =>
              note.id === noteId ? { ...note, text: newText } : note
            )
          }
        }));
      },

      deleteNote: (videoId, noteId) => {
        set((state) => ({
          notes: {
            ...state.notes,
            [videoId]: (state.notes[videoId] || []).filter(note => note.id !== noteId)
          }
        }));
      },

      setPreferredExam: (exam) => {
        set({ preferredExam: exam });
      },
    }),
    {
      name: 'vikramshila-storage-v2', // Updated version for schema change
      storage: createJSONStorage(() => localStorage),
    }
  )
);
