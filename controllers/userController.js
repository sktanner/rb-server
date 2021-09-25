const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateJWT = require("../middleware/validate-jwt")


/* User Register */

router.post("/register", async (req, res) => {

    let { email, password, isAdmin } = req.body.user
    try {
        const user = await User.create({
            email,
            password: bcrypt.hashSync(password, 13),
            isAdmin
        });

        let token = jwt.sign({ id: user.id, password: bcrypt.hashSync(password, 13) }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });


        res.status(201).json({
            message: "You've successfully registered!",
            user: user,
            sessionToken: token
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email is already in use",
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
    let { email, password } = req.body.user;

    try {
        const loginUser = await User.findOne({
            where: {
                email: email,
            },
        });
        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {

                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "Welcome back!",
                    sessionToken: token
                });
            }
        } else {
            res.status(401).json({
                message: "Login failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Login"
        })
    }
});


/* Get all Users */ // WORKING

router.get("/", validateJWT, async (req, res) => {
    try {
        const u = await User.findAll()
        res.status(200).json(u)
    } catch (err) {
        res.status(500).json({ error: err })
    }
})


/* Validate User */

// router.get("/validate", validateJWT, async (req, res) => {
    
//     try {
// let validatedUser = await User.findOne({where: { id: req.user.id}})
// if (validatedUser && req.user.isAdmin === true)
        
//         res.status(200).json({message: "User Validated", validatedUser})
//     } catch (err) {
//         res.status(500).json({ error: err })
//     }
// })


/* User Delete */

router.delete("/:id", validateJWT, async (req, res) => {
    const userId = req.params.id

    try {
        const u = { where: { id: userId } }

        await User.destroy(u)
        res.status(200).json({ message: "User Removed" })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router;