import Link from 'next/link';
import { Navbar } from '../src/components/Navbar';
import { useAuth } from '../src/contexts/AuthContext';
import styles from '../src/styles/Home.module.css';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.hero}>
            <h1>Welcome to E-Learning Platform</h1>
            <p>Learn new skills, advance your career, and achieve your goals</p>
            <div className={styles.cta}>
              {user ? (
                <Link href="/courses">
                  <button className="btn btn-primary">Browse Courses</button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <button className="btn btn-primary">Get Started</button>
                  </Link>
                  <Link href="/courses">
                    <button className="btn btn-secondary">Explore Courses</button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className={styles.features}>
            <div className="card">
              <h3>📚 Wide Range of Courses</h3>
              <p>Access thousands of courses across various categories</p>
            </div>
            <div className="card">
              <h3>👨‍🏫 Expert Instructors</h3>
              <p>Learn from industry professionals and experienced teachers</p>
            </div>
            <div className="card">
              <h3>📈 Track Progress</h3>
              <p>Monitor your learning journey and achievements</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
