import express, { json } from "express";
import cors from "cors";
import query from "./app.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(json());

app.get("/", (req, res) => {
    res.send("OurBK API Authorization Needed");
});

// -> [GET] host/api?username=..&password=..&action=..
app.get("/api", async (req, res) => {
    const data = await query(
        req.query.username,
        req.query.password,
        req.query.action
    );
    res.send(data);
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is listening on port ${port}`);
});
