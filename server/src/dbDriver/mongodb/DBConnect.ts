import {AnyError, MongoClient} from 'mongodb';
class DBConnect
{
  constructor() {
    let url = "mongodb://localhost:"+process.env.PORT+"/";
    MongoClient.connect(url, function(err: AnyError, db: MongoClient): void {
      if (err) throw err;
      var dbo = db.db("biodata");
      dbo.createCollection("users", function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        db.close();
      });
    });
  }   
}
export = DBConnect;

