export interface ICourse {
  _id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  thumbnail: string;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lessons: ILesson[];
  createdAt: string;
  updatedAt: string;
}

export interface ILesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface IEnrollment {
  _id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: string;
  lastAccessedAt: string;
}
