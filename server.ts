import app from "./src/app";
import { dbConfig } from "./src/config/dbConnect";



dbConfig()
const port = process.env.PORT || 3000;


app.listen(port,()=> console.log(`App running in port ${port}`));

process.on('unhandledRejection',(err:any) => console.log(err.name,err.message))
