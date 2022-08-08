let dbDriver = process.env.DB_DRIVER;
let Query = require ('../dbDriver/'+dbDriver+'/Query');
class Model extends Query {
  constructor(table:string) {
    super(table);
  }
}

export = Model;