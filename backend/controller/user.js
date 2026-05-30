const express = require("express");
const path = require("path");
const User = require("../model/user.js");
const router = express.Router();
const { upload } = require("../multer.js");
const ErrorHandler = require("../utils/ErrorHandler");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated } = require("../utils/auth.js");

router.post("/create-user", upload.single("file"), async (req, res, next) => {
  const { name, email, password } = req.body;
  const userEmail = await User.findOne({ email });

  if (userEmail) {
    const filename = req.file.filename;
    const filepath = `uploads/${filename}`;
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(err);
        res.json({ message: "Error deleting file" });
      } else {
        res.json({ message: "File deleted successfully" });
      }
    });

    return next(new ErrorHandler("User already exists", 400));
  }

  try {
    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: fileUrl,
    };
    console.log(user);

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.mail,
        subject: "Activate your account",
        messgae: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`
      })
      res.status(201).json({
        success: true,
        message: `please check your email:- ${user.email} to activate your account!`
      })
    } catch (error) {
      return next(ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(ErrorHandler(error.message, 500));
  }
  // const newUser = await User.create(user)
  // res.status(201).json({
  //     success: true,
  //     nweUser,
  // })
});

// create activation token
const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "10m",
  });
};

// activate user
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
  try {
    const {activationToken} = req.body;
    const newUser = jwt.verify(activationToken, process.env.ACTIVATION_SECRET)

    if(!newUser) {
      return next(new ErrorHandler("Invalid Token", 400))  
    }
    const {name, email, password, avatar} = newUser

    let user = await User.findOne({email})

    if(user) {
      return next(new ErrorHandler("User already exists", 400))
    }

      user = await User.create({
        name,
        email,
        password,
        avatar,
    })
    sendToken(newUser, 201, res)
    
  } catch (error) {
    return nexr(new ErrorHandler(Error.message, 500))
  }
}))

// Login User
router.post('/login', catchAsyncErrors(async(req, res, next) => {
  try {
    const {email, password} = req.body

    if(!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
      return next(new ErrorHandler("User not found", 404))
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
      return next(new ErrorHandler("Invalid password", 401))
    }
    sendToken(user, 200, res)
  } catch (error) {
    return next(new ErrorHandler(error.message, 500))
  }
}))

// Load User
router.post('/getuser', isAuthenticated, catchAsyncErrors(async(req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if(!user) {
      return next(new ErrorHandler('User not found', 400))
    }
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return next(new ErrorHandler(error.message), 500)
  }
}))


module.exports = router;