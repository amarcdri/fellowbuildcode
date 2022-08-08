import DBConnect from './DBConnect';
class Query extends DBConnect {
  table: string;
  constructor(table: string) {
    super();
    this.con.connect((err) => {
      if (err) throw err;
    });
    this.table = table;
  }

  queryDB = (query: string, args:object) => new Promise((resolve, reject) => {
    this.con.query(query, args, (err, rslt) => {
      if (err) {
        return reject(err);
      }
      resolve(rslt);
    });
    this.con.end;
  });

  insertData = (req: any) => {
    let table = req.table? req.table: this.table;
    let query = "INSERT INTO " + table + " SET ?";
    let rslt = this.queryDB(query, req.input).then(
      (val: any) => {
        if (val.affectedRows == 1) {
          return this.getData({
            where: 'id = ?',
            args: [val.insertId]
          });
        }
      }
    );
    return rslt;
  }
  
  bulkInsertData = (req: any) => {
    let table = req.table? req.table: this.table;
    let query = "INSERT INTO " + table + " ("+req.fields+") VALUES ?";
    let rslt = this.queryDB(query, req.input).then(
      (val: any) => {
        if (val.affectedRows > 0) {
          return this.getData({
            table: table,
            where: req.get_where.where,
            args: req.get_where.args
          });
        }
      }
    );
    return rslt;
  }

  updateData = (req: any) => {
    let table = req.table? req.table: this.table;
    let query = "UPDATE " + table + " SET ? WHERE id = ?";
    let rslt = this.queryDB(query, [req.input, req.id]).then(
      (val: any) => {
        if (val.affectedRows == 1) {
          return this.getData({
            select: req.select? req.select: "*",
            where: 'id = ?',
            args: [req.id]
          });
        }
      }
    );
    return rslt;
  }

  getData = async (req:any) => {
    let table = req.table? req.table: this.table;
    let select = "a.*";
    let from = table + " a";
    let where = 1;
    let other = '';
    let args = {};
    if (req) {
      if (req.select) {
        select = req.select;
      }
      if (req.from) {
        from = req.from + " a";
      }
      if (req.join) {
        from += " "+req.join;
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

  deleteData = async (req: any) => {
    let table = req.table? req.table: this.table;
    let where_fields = req.where.fields? req.where.fields: "id = ?";
    let query = "DELETE FROM " + table + " WHERE "+where_fields;
    let rslt: any = await this.queryDB(query, req.where.args);
    if (rslt.affectedRows == 0) {
      return false;
    }
    return true;
  }
}

export = Query;