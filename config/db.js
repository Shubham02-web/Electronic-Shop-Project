import mongoose from "mongoose";
import colors from "colors";

const connectDB = async (URi) => {
  await mongoose
    .connect(URi, { dbName: "Electronic_Store" })
    .then((c) => {
      console.log(`DB Connected to ${c.connection.host}`.bgBlack.cyan);
    })
    .catch((e) => console.log(e));
};
export default connectDB;
