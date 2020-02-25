const m = require("mongoose");

m.connect(
  `mongodb+srv://${process.env.MONGO_USERS}:${process.env.MONGO_PASWD}@cluster0-8w3b6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => console.log(`MongoError: ${err}`)
);