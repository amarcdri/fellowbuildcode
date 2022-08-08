import mysql from 'mysql';
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
class DBConnect
{
  protected con;
  constructor() {
    let config = {
      host    : DB_HOST,
      user    : DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    };
    this.con = mysql.createConnection(config);
  }    
}
export = DBConnect;