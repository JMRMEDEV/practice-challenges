import { useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Navbar } from '../../src/components/Navbar';
import { useAuth } from '../../src/contexts/AuthContext';
import { api } from '../../src/lib/api';
import type { ICourse } from '../../src/types';
import styles from '../../src/styles/CourseDetail.module.css';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const { data, error } = useSWR(id ? `/api/courses/${id}` : null, fetcher);
  const course: ICourse = data?.course;

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      await api.post('/api/enrollments', {
        userId: user._id,
        courseId: course._id,
      });
      setEnrolled(true);
      alert('Successfully enrolled!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (error) return <div>Failed to load course</div>;
  if (!course) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className={styles.hero}>
        <div className="container">
          <h1>{course.title}</h1>
          <p className={styles.instructor}>By {course.instructorName}</p>
          <div className={styles.meta}>
            <span className={`badge badge-${course.level}`}>{course.level}</span>
            <span>{Math.floor(course.duration / 60)} hours</span>
            <span>{course.category}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.content}>
          <div className={styles.main}>
            <div className="card">
              <h2>About this course</h2>
              <p>{course.description}</p>
            </div>

            <div className="card">
              <h2>Course Content</h2>
              <div className={styles.lessons}>
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} className={styles.lesson}>
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description}</p>
                    <span>{Math.floor(lesson.duration / 60)} min</span>
                  </div>
                ))}
                {course.lessons.length === 0 && (
                  <p>No lessons available yet</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className="card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className={styles.thumbnail}
              />
              <button
                onClick={handleEnroll}
                className="btn btn-primary"
                disabled={enrolling || enrolled}
                style={{ width: '100%', marginTop: '15px' }}
              >
                {enrolled ? 'Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
