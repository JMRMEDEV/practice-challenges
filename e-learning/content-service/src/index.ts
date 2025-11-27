import express from 'express';
import cors from 'cors';
import { coursesDb, enrollmentsDb } from './db';
import type { ICourse, IEnrollment } from './types';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ service: 'content-service', status: 'running' });
});

app.get('/courses', async (req, res) => {
  try {
    const { category, level } = req.query;
    
    const result = await coursesDb.allDocs({ include_docs: true });
    let courses = result.rows.map((row: any) => row.doc).filter((doc: any) => doc) as ICourse[];

    if (category) {
      courses = courses.filter((c) => c.category === category);
    }

    if (level) {
      courses = courses.filter((c) => c.level === level);
    }

    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/courses/:id', async (req, res) => {
  try {
    const course = await coursesDb.get(req.params.id);
    res.json({ course });
  } catch (error) {
    res.status(404).json({ error: 'Course not found' });
  }
});

app.post('/courses', async (req, res) => {
  try {
    const { title, description, instructorId, instructorName, thumbnail, duration, level, category, lessons } = req.body;

    if (!title || !description || !instructorId) {
      return res.status(400).json({ error: 'Title, description, and instructorId are required' });
    }

    const course: ICourse = {
      _id: `course_${Date.now()}_${Math.random()}`,
      title,
      description,
      instructorId,
      instructorName,
      thumbnail: thumbnail || '/placeholder-course.jpg',
      duration: duration || 0,
      level: level || 'beginner',
      category: category || 'general',
      lessons: lessons || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await coursesDb.put(course);
    res.status(201).json({ course });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/courses/:id', async (req, res) => {
  try {
    const course = await coursesDb.get(req.params.id) as ICourse;
    const updates = req.body;

    const updatedCourse = {
      ...course,
      ...updates,
      _id: course._id,
      _rev: (course as any)._rev,
      updatedAt: new Date().toISOString(),
    };

    await coursesDb.put(updatedCourse);
    res.json({ course: updatedCourse });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    const course = await coursesDb.get(req.params.id);
    await coursesDb.remove(course);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.post('/enrollments', async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ error: 'userId and courseId are required' });
    }

    const allEnrollments = await enrollmentsDb.allDocs({ include_docs: true });
    const existing = allEnrollments.rows.find(
      (row: any) => row.doc?.userId === userId && row.doc?.courseId === courseId
    );
    
    if (existing) {
      return res.status(409).json({ error: 'Already enrolled' });
    }

    const enrollment: IEnrollment = {
      _id: `enrollment_${Date.now()}_${Math.random()}`,
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    await enrollmentsDb.put(enrollment);
    res.status(201).json({ enrollment });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

app.get('/enrollments/user/:userId', async (req, res) => {
  try {
    const allEnrollments = await enrollmentsDb.allDocs({ include_docs: true });
    const userEnrollments = allEnrollments.rows
      .filter((row: any) => row.doc?.userId === req.params.userId)
      .map((row: any) => row.doc);
    
    res.json({ enrollments: userEnrollments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

app.put('/enrollments/:id/progress', async (req, res) => {
  try {
    const enrollment = await enrollmentsDb.get(req.params.id) as IEnrollment;
    const { lessonId, progress } = req.body;

    const updatedEnrollment = {
      ...enrollment,
      _rev: (enrollment as any)._rev,
      completedLessons: lessonId && !enrollment.completedLessons.includes(lessonId)
        ? [...enrollment.completedLessons, lessonId]
        : enrollment.completedLessons,
      progress: progress !== undefined ? progress : enrollment.progress,
      lastAccessedAt: new Date().toISOString(),
    };

    await enrollmentsDb.put(updatedEnrollment);
    res.json({ enrollment: updatedEnrollment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

app.listen(PORT, () => {
  console.log(`Content service running on port ${PORT}`);
});
