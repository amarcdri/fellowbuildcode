import DBConnect from './DBConnect';
class Query extends DBConnect {
  table: string;
  constructor(table) {
    super();
    this.table = table;
  }

  queryDB = (query, args) => new Promise((resolve, reject) => {
    
  });

  insertData = async (req) => {
    let query = "INSERT INTO " + this.table + " SET ?";
    let rslt: any = await this.queryDB(query, req.input);
    if (rslt.affectedRows == 1) {
      rslt = this.getData({ id: rslt.insertId });
    }
    return rslt;
  }

  updateData = async (req) => {
    let query = "UPDATE " + this.table + " SET ? WHERE id = ?";
    let rslt: any = await this.queryDB(query, [req.input, req.id]);
    if (rslt.affectedRows == 1) {
      rslt = this.getData({ id: req.id });
    }
    return rslt;
  }

  getData = async (req) => {
    let select = "*";
    let from = this.table;
    let where = 1;
    let other = '';
    let args = '';
    if (req) {
      if (req.select) {
        select = req.select;
      }
      if (req.from) {
        from = req.from;
      }
      if (req.where) {
        where = req.where;
      }
      if (req.other) {
        other = req.other;
      }
      if(req.args) {
        args = req.args;
      }
    }
    let query = "SELECT " + select + " FROM " + from + " WHERE " + where + " " + other;
    let rslt = await this.queryDB(query, args);
    return rslt;
  }

  deleteData = async (req) => {
    let query = "DELETE FROM " + this.table + " WHERE id = ?";
    let rslt: any = await this.queryDB(query, [req.id]);
    if (rslt.affectedRows == 0) {
      return false;
    }
    return true;
  }
}

export = Query;