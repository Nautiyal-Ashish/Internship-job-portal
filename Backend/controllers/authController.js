const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/User");


const registerUser = async (req, res) => {
  const { name, email, password } = req.body; //User se laya  
  try {
    // First finding if User already exists 
    let user = User.findOne({ email }); //mongodb ka findOne 
    if (user) {
      return res.staus(400).json({ msg: "User already exists" }); //msg return
    }

    // If User not already new user created
    user = new User({ name, email, password });

    // Then making the password hashed and salting 
    const salt = await bcrypt.genSalt(10); //salt =To improve security, bcrypt incorporates a random number called a salt. 
    user.password = await bcrypt.hash(password, salt); //hashing of the password

    // saving the user 
    await user.save();

    //setup of JWT
    const payload = { user: { id: user_id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token })
    }
    );

    // catch block
  } catch (err) {
    console.log(err.message);
  }
}


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = User.findOne({ email });
    if (!user) {
      return res.staus(400).json({ msg: "Invalid creadentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.staus(400).json({ msg: "Invalid credentials" });
    }
    const payload = { user: { id: user_id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
  } catch (err) {
    console.log(err.message);
    res.staus(500).send("Server Error", err)
  }
}



module.exports = { registerUser, loginUser }