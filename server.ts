import app from "./src/app";
import { dbConfig } from "./src/config/dbConnect";



dbConfig()
const port = process.env.PORT || 3000;


app.listen(port,()=> console.log(`App running in port ${port}`));