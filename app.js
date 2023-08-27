const express = require("express");
const path = require("path");
const cors = require("cors");

const { connectToMongoDB, Operations } = require("./db");

const app = express();
const PORT = 4000;

app.use(cors());

app.use(express.json());
app.use(express.static('views'));
app.set("view engine", "hjs");

connectToMongoDB();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/history", async (req, res) => {
  try {
    const operations = await Operations.find()
      .sort({ updatedAt: -1 })
      .select("question answer")
      .limit(20);

    return res.status(200).render("history", { operations });
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.get("*", async (req, res) => {
  let expression = req.params[0];
  const parts = expression.split("/").filter((i) => i != "");

  if (parts.length < 3 || parts.length % 2 === 0) {
    return res.status(400).send("Invalid expression format");
  }

  expression = `${parseFloat(parts[0])}`;

  for (let i = 1; i < parts.length; i += 2) {
    const operation = parts[i];
    const operand = parseFloat(parts[i + 1]);

    switch (operation) {
      case "plus":
        expression += `+${operand}`;
        break;
      case "minus":
        expression += `-${operand}`;
        break;
      case "into":
        expression += `*${operand}`;
        break;
      case "divide":
        expression += `*${operand}`;
        break;
      default:
        res.status(400).send("Invalid operation");
        return;
    }
  }
  const result = { question: expression, answer: eval(expression) };
  const newOperation = new Operations(result);
  await newOperation.save();
  return res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
