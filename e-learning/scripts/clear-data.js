const API_URL = 'http://localhost:3003';

async function clearData() {
  console.log('Starting data cleanup...');

  try {
    // Login as instructor
    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'instructor@example.com',
        password: 'password123',
      }),
    });

    if (!loginRes.ok) {
      throw new Error('Login failed - instructor account may not exist');
    }

    const { accessToken } = await loginRes.json();

    // Get all courses
    console.log('Fetching courses...');
    const coursesRes = await fetch(`${API_URL}/api/courses`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!coursesRes.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await coursesRes.json();
    const courses = Array.isArray(data) ? data : [];

    // Delete each course
    console.log(`Deleting ${courses.length} courses...`);
    for (const course of courses) {
      const deleteRes = await fetch(`${API_URL}/api/courses/${course._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (deleteRes.ok) {
        console.log(`Deleted course: ${course.title}`);
      }
    }

    console.log('\nData cleanup completed successfully!');
    console.log('Note: User accounts are preserved. To fully reset, restart Docker containers.');
  } catch (error) {
    console.error('Error clearing data:', error.message);
  }
}

clearData();
