const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Book = require('./book')

const userSchema = new mongoose.Schema(
  {
    first_name: {
        type: String,
        required: true,
        trim: true,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
    },
    fullname: {
        type: String,
        trim: true,
        
    },
    role: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: "Role"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
            throw new Error('email is invalid')
            }
        },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.generateAuthToken = async function() {
  console.log(this)
  const user = this
  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, 'my_secret')

  user.tokens = user.tokens.concat({ token })
  await user.save()

  try {
    let saveUser = await user.save();; //when fail its goes to catch
    console.log(saveUser); //when success it print.
    console.log('after save');
  } catch (err) {
    console.log('err' + err);
    res.status(500).send(err);
  }

  return token
}

userSchema.virtual('books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'owner',
})

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  console.log(user)
  if (!user) {
    throw new Error('Login Failed')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  
  if (!isMatch) {
    throw new Error('Login Failed')
  }

  return user
}

userSchema.pre('save', async function(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre('remove', async function(next) {
  const user = this
  await Book.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
