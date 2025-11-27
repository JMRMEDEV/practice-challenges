const API_URL = 'http://localhost:3003';

const sampleCourses = [
  {
    title: 'Introduction to TypeScript',
    description: 'Learn TypeScript from scratch and build type-safe applications',
    instructorId: 'instructor_1',
    instructorName: 'John Doe',
    thumbnail: 'https://via.placeholder.com/400x200/0070f3/ffffff?text=TypeScript',
    duration: 7200,
    level: 'beginner',
    category: 'programming',
    lessons: [
      {
        id: 'lesson_1',
        title: 'Getting Started with TypeScript',
        description: 'Introduction to TypeScript and setup',
        videoUrl: '/videos/ts-intro.mp4',
        duration: 600,
        order: 1,
      },
      {
        id: 'lesson_2',
        title: 'Basic Types',
        description: 'Understanding TypeScript types',
        videoUrl: '/videos/ts-types.mp4',
        duration: 900,
        order: 2,
      },
    ],
  },
  {
    title: 'React for Beginners',
    description: 'Master React fundamentals and build modern web applications',
    instructorId: 'instructor_1',
    instructorName: 'John Doe',
    thumbnail: 'https://via.placeholder.com/400x200/61dafb/000000?text=React',
    duration: 10800,
    level: 'beginner',
    category: 'programming',
    lessons: [
      {
        id: 'lesson_1',
        title: 'React Basics',
        description: 'Components, props, and state',
        videoUrl: '/videos/react-basics.mp4',
        duration: 1200,
        order: 1,
      },
    ],
  },
  {
    title: 'Advanced Node.js',
    description: 'Build scalable backend applications with Node.js',
    instructorId: 'instructor_2',
    instructorName: 'Jane Smith',
    thumbnail: 'https://via.placeholder.com/400x200/339933/ffffff?text=Node.js',
    duration: 14400,
    level: 'advanced',
    category: 'programming',
    lessons: [],
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of great user interface design',
    instructorId: 'instructor_2',
    instructorName: 'Jane Smith',
    thumbnail: 'https://via.placeholder.com/400x200/ff6b6b/ffffff?text=UI+Design',
    duration: 9000,
    level: 'intermediate',
    category: 'design',
    lessons: [],
  },
];

async function seedData() {
  console.log('Starting data seeding...');

  try {
    // Register an instructor
    console.log('Creating instructor account...');
    const registerRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'instructor@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'instructor',
      }),
    });

    if (!registerRes.ok) {
      const error = await registerRes.json();
      throw new Error(error.message || 'Registration failed');
    }

    // Login to get token
    const loginRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'instructor@example.com',
        password: 'password123',
      }),
    });

    if (!loginRes.ok) {
      const error = await loginRes.json();
      throw new Error(error.message || 'Login failed');
    }

    const { accessToken } = await loginRes.json();

    // Create courses
    console.log('Creating sample courses...');
    for (const course of sampleCourses) {
      const courseRes = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(course),
      });

      if (!courseRes.ok) {
        const error = await courseRes.json();
        throw new Error(error.message || 'Course creation failed');
      }

      console.log(`Created course: ${course.title}`);
    }

    console.log('\nData seeding completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: instructor@example.com');
    console.log('Password: password123');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  }
}

seedData();
