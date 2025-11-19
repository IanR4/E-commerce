import mongoose from "mongoose";

export class MongoDBClient {
    static connect() {
        const uri = process.env.MONGODB_URI;

        //TEMPORAL
        console.log("MongoDB final URI:", process.env.MONGODB_URI);

        return mongoose
            .connect(uri)
            .then((conn) => {
                console.log(`MongoDB is connected: ${conn.connection.host}`);
            })
            .catch((error) => {
                console.error(`MongoDB Connection Error: ${error.message}`);
                process.exit(1);
            });
    }
}