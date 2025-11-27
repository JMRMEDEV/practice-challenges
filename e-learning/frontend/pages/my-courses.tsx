import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar } from '../src/components/Navbar';
import { useAuth } from '../src/contexts/AuthContext';
import { api } from '../src/lib/api';
import type { IEnrollment, ICourse } from '../src/types';
import styles from '../src/styles/MyCourses.module.css';

export default function MyCourses() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const [courses, setCourses] = useState<{ [key: string]: ICourse }>({});
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadEnrollments();
    }
  }, [user, loading]);

  const loadEnrollments = async () => {
    try {
      const { data } = await api.get('/api/user/enrollments');
      setEnrollments(data.enrollments);

      const coursePromises = data.enrollments.map((e: IEnrollment) =>
        api.get(`/api/courses/${e.courseId}`)
      );
      const courseResponses = await Promise.all(coursePromises);

      const coursesMap: { [key: string]: ICourse } = {};
      courseResponses.forEach((res) => {
        coursesMap[res.data.course._id] = res.data.course;
      });
      setCourses(coursesMap);
    } catch (error) {
      console.error('Failed to load enrollments:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className={styles.title}>My Courses</h1>

        {enrollments.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven't enrolled in any courses yet</p>
            <Link href="/courses">
              <button className="btn btn-primary">Browse Courses</button>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {enrollments.map((enrollment) => {
              const course = courses[enrollment.courseId];
              if (!course) return null;

              return (
                <Link key={enrollment._id} href={`/courses/${course._id}`}>
                  <div className="card">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className={styles.thumbnail}
                    />
                    <h3>{course.title}</h3>
                    <p className={styles.instructor}>
                      By {course.instructorName}
                    </p>
                    <div className={styles.progress}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                      <span>{enrollment.progress}% complete</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
