import PouchDB from 'pouchdb';

export const usersDb = new PouchDB('users');
export const refreshTokensDb = new PouchDB('refresh_tokens');
