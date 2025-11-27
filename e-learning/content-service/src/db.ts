import PouchDB from 'pouchdb';

export const coursesDb = new PouchDB('courses');
export const enrollmentsDb = new PouchDB('enrollments');
