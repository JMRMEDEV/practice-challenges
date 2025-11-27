import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            E-Learning
          </Link>

          <div className={styles.links}>
            <Link href="/courses">Courses</Link>
            {user ? (
              <>
                <Link href="/my-courses">My Courses</Link>
                {user.role === 'instructor' && (
                  <Link href="/create-course">Create Course</Link>
                )}
                <span className={styles.user}>{user.name}</span>
                <button onClick={logout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="btn btn-primary">Login</button>
                </Link>
                <Link href="/register">
                  <button className="btn btn-secondary">Register</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
