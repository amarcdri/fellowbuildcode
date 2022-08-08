import authController from "./AuthController";
import fs from 'fs';
class UploadController {
  configTypeDefs = () => {
    let typeDefs = `
    type File {
      filename: String!
      mimetype: String!
      encoding: String!
    }

    extend type Query {
      uploads: [File]
    }

    extend type Mutation {
      singleUpload(file: Upload!): File!
    }`;
    return typeDefs;
  }

  configResolvers = (resolvers: any) => {
    resolvers.Mutation.singleUpload = this.singleUpload;
  }

  singleUpload = async (parent, { file }, context) => {
    try {
      await authController.getData(context);
      const { filename, mimetype, encoding, createReadStream } = await file;
      
      // console.log(file);
      const fileStream = createReadStream()
      fileStream.pipe(fs.createWriteStream(`./uploads/${filename}`))

      return { filename, mimetype, encoding };
    } catch (e) {
      if(e.name != "CustomError") {
        e.message = "Something went wrong";
      }
      return new Error(e.message);
    }
  }  
}

export = UploadController;