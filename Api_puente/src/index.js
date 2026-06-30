require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const puentsRoutes = require("./routes/puente.routes");

const app = express();

app.use(cors({
    origin: ["https://luigifun.es","http://localhost:5173","http://localhost:8500"],
    credentials: true,
}));

app.use(cookieParser());

app.use((req, res, next) => {
    if(req.headers['access-control-request-private-network']){
        res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    next();
})
app.use(express.json());
app.use("/api", puentsRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});

