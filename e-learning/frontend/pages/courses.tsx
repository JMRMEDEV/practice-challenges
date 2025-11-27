import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Navbar } from '../src/components/Navbar';
import { api } from '../src/lib/api';
import type { ICourse } from '../src/types';
import styles from '../src/styles/Courses.module.css';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function Courses() {
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const { data, error } = useSWR(
    `/api/courses?category=${category}&level=${level}`,
    fetcher
  );

  const courses: ICourse[] = data?.courses || [];

  return (
    <>
      <Navbar />
      <div className="container">
        <div className={styles.header}>
          <h1>All Courses</h1>
          <div className={styles.filters}>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
              <option value="marketing">Marketing</option>
            </select>
            <select
              className="input"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {error && <div className={styles.error}>Failed to load courses</div>}

        <div className={styles.grid}>
          {courses.map((course) => (
            <Link key={course._id} href={`/courses/${course._id}`}>
              <div className="card">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className={styles.thumbnail}
                />
                <h3>{course.title}</h3>
                <p className={styles.instructor}>By {course.instructorName}</p>
                <p className={styles.description}>{course.description}</p>
                <div className={styles.meta}>
                  <span className={`badge badge-${course.level}`}>
                    {course.level}
                  </span>
                  <span>{Math.floor(course.duration / 60)} hours</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {courses.length === 0 && !error && (
          <div className={styles.empty}>No courses found</div>
        )}
      </div>
    </>
  );
}
