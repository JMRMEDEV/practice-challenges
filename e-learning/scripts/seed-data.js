const API_URL = 'http://localhost:3003';

const sampleCourses = [
  {
    title: 'Introduction to TypeScript',
    description: 'Learn TypeScript from scratch and build type-safe applications',
    instructorId: 'instructor_1',
    instructorName: 'John Doe',
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
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
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
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
    thumbnail: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&h=400&fit=crop',
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
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
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
      const error = await registerRes.json().catch(() => ({ message: 'Unknown error' }));
      if (registerRes.status === 409 || error.message?.includes('already exists')) {
        console.log('Instructor account already exists, continuing...');
      } else {
        throw new Error(error.message || `Registration failed with status ${registerRes.status}`);
      }
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
    console.error('Make sure all services are running: docker-compose ps');
    console.error('Check BFF is accessible: curl http://localhost:3003/health');
    process.exit(1);
  }
}

seedData();
