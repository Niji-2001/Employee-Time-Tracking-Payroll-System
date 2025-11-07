import app from "./app.js";
import dotenv from "dotenv";
const PORT = process.env.PORT || 5000;

dotenv.config()
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
