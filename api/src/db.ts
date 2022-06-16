import mysql from 'mysql';

export const createConnection = () => mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'aszendit'
});

export const dbQuery = <T = any>(sql: string) =>
  new Promise<T>((resolve, reject) => {
    const connection = createConnection()
    connection.connect();

    connection.query(sql, (error, result) => {
      if (error) {
        console.error(error)

        reject(error)
        return
      }

      resolve(result)
    });

    connection.end();
  })
