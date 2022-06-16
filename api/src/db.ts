import mysql from 'mysql';

export const createConnection = () => mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'aszendit'
});
