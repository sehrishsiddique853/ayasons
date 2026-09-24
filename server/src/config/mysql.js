import mysql from 'mysql2/promise'


const pool =
  mysql.createPool({
    host:
      process.env.MYSQL_HOST ||
      'localhost',

    port:
      Number(
        process.env.MYSQL_PORT ||
        3306
      ),

    user:
      process.env.MYSQL_USER ||
      'root',

    password:
      process.env.MYSQL_PASSWORD ||
      '',

    database:
      process.env.MYSQL_DATABASE ||
      'ayosons',

    waitForConnections:
      true,

    connectionLimit:
      10,

    queueLimit:
      0,
  })


export const testMySQLConnection =
  async () => {
    let connection


    try {
      connection =
        await pool.getConnection()


      await connection.ping()


      console.log(
        'MySQL connected successfully.'
      )


      console.log(
        `Database: ${
          process.env
            .MYSQL_DATABASE ||
          'ayosons'
        }`
      )

    } finally {

      if (connection) {
        connection.release()
      }
    }
  }


export default pool