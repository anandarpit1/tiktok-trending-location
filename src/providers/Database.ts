import mongoose from "mongoose";
import Locals from "./Locals";

export class Database {
    public static init = () => {
        mongoose.connect(Locals.config().MONGODB_URI);

        mongoose.connection.on("connected", () => {
            console.log("[Mongodb connected]");
        });

        mongoose.connection.on("error", (error) => {
            console.log("[Error in mongodb connection]", error);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("[Mongodb connection disconnected]");
        });
    };
    public static close(): any {
        mongoose.connection.close();
    }
}

export default mongoose;
