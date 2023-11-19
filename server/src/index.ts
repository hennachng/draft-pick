import express from "express";
import { CreateDraft, DraftPick, LoadDraft } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/create", CreateDraft);
app.post("/api/pick", DraftPick);
app.get("/api/load", LoadDraft);
app.listen(port, () => console.log(`Server listening on ${port}`));
