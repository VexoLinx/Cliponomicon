require("dotenv").config();

const express = require("express");
const cors = require("cors");
const puentsRoutes = require("./routes/puents.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", puentsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

