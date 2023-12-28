const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "Available",
    },
    profilePic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign(
      { id: this._id, email: this.email },
      process.env.SECRET,
      {
        expiresIn: "24h",
      }
    );

    return token;
  } catch (error) {
    console.log("error while generating token");
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;

// try {
//   const {
//     page = req.query.page,
//     limit = req.query.limit,
//     sortBy = "todoName",
//     sortOrder = "asc",
//     search,
//     filterBy,
//   } = req.query;
//   let matchStage = { $match: { isDeleted: false } };
//   let sortStage = {};
//   let filterStage = { $match: {} };
//   if (search) {
//     matchStage = {
//       $match: { todoName: { $regex: search, $options: "i" }, isDeleted: false },
//     };
//   }
//   if (filterBy) {
//     filterStage = {
//       $match: { taskCategorie: filterBy },
//     };
//   }
//   if (sortBy) {
//     sortStage = {
//       $sort: { [sortBy]: sortOrder === "desc" ? -1 : 1 },
//     };
//   }
//   const pipeline = [
//     matchStage,
//     filterStage,
//     sortStage,
//     {
//       $skip: page * limit,
//     },
//     {
//       $limit: parseInt(limit),
//     },
//   ];
//   const results = await Todo.aggregate(pipeline);
//   const totalDocuments = await Todo.count();
//   const resData = {
//     data: results,
//     totalPages: Math.ceil(totalDocuments / limit),
//     currentPage: parseInt(page),
//     totalRecords: totalDocuments,
//   };
//   sendResponse(res, 200, resData, RETRIEVED_SUCCESSFULLY);
// } catch (error) {
//   sendResponseError(res, 500, INTERNAL_ERROR);
// }
