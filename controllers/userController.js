const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get('/test', (req, res) => {
    res.send('Test route')
})


/* User Register */

router.post("/register", async (req, res) => {

    let { username, email, password } = req.body.user
    try {
    const user = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 13),
    });

    let token = jwt.sign({id: user.id, password: bcrypt.hashSync(password, 13)}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
  

    res.status(201).json({
        message: "You've successfully registered!",
        user: user,
        sessionToken: token
    });
} catch (err) {
    if (err instanceof UniqueConstraintError){
        res.status(409).json({
            message: "Username is already in use",
        });
    } else {
    res.status(500).json({
        message: "Failed to register"
    });
}
}
 });

 
 /* User Login */

 router.post("/login", async (req, res) => {
    let { username, password } = req.body.user; 
    
    try {
    const loginUser = await User.findOne({
        where: {
            username: username,
        },
    });
    if (loginUser) {

        let passwordComparison = await bcrypt.compare(password, loginUser.password);

        if (passwordComparison) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(200).json({
        user: loginUser,
        message: "Welcome back!",
        sessionToken: token
    });
}
} else {
    res.status(401).json({
        message:"Login failed"
    });
}
} catch (error) {
    res.status(500).json({
        message: "Failed to Login"
    })
}
 });

module.exports = router;