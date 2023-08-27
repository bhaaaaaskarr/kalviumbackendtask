const mongoose = require("mongoose");

async function connectToMongoDB() {
  await mongoose.connect(
    "mongodb+srv://bhaaaaakarr:bsinha389@cluster0.jvci5hg.mongodb.net/bhaskardb?retryWrites=true&w=majority"
  );
  console.log("connected to mongodb");
}

const operationSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Operations = new mongoose.model("operation", operationSchema);

module.exports = { Operations, connectToMongoDB };
