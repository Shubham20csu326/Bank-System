const router = require('express').Router()
const User = require('../models/user')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var ObjectId = require('mongoose').Types.ObjectId;
router.get('/ok', (req, res) => {
    res.json({ message: "All Working" })
})
function generateRandomNumber() {
    let number = ''
    for (let i = 0; i < 16; i++) {
        number += Math.floor(Math.random() * 10).toString()
        if (i === 3 || i === 7 || i === 11) {
            number += '-'
        }
    }
    return number
}
// router.post('/insertMany', (req, res) => {
//     var data = req.body;
//     console.log(data)
//     User.insertMany(data).then(() => {
//         res.json({ success: true, message: "Data Inserted" })
//     }).catch((err) => {
//         console.log(err)
//         res.json({ success: false, message: "Data cannot be inserted" })
//     })
// })
router.post('/login', (req, res) => {
    User.find({ account: req.body.account }).then((value) => {
        if (value.length < 1) {
            res.json({ success: false, message: "Account Not Found For Details" })
        }
        else {
            const user = value[0]
            bcrypt.compare(req.body.password, user.password, (err, value) => {
                if (value) {
                    const payload = {
                        userId: user._id,
                        userName: user.name,
                        userPhone: user.phone,
                        userAccount: user.account

                    }
                    const token = jwt.sign(payload, "webBatch")
                    res.json({ success: true, message: "Login Successful", token: token })
                }
                else {
                    res.json({ success: false, message: "Credentials Not Matched For Email" })
                }
            })
        }
    })
})
router.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        const data = new User({
            name: req.body.name,
            phone: req.body.phone,
            password: hash,
            account: req.body.account,
            balance: req.body.balance,
            card: generateRandomNumber()
        })

        data.save().then(() => {
            res.json({ message: "Registered Successfully", success: true })
        }).catch(() => {
            res.json({ message: "All Fields Are Required", success: false })
        })
    })
})
router.post('/getuser/:id', (req, res) => {
    User.findById(req.params.id).then((value) => {
        res.json({ success: true, value: value })
    })
})
router.get('/getUsers', (req, res) => {
    User.find().then((value) => {
        res.json({ value, message: "Data Fetched" })
    }).catch(() => {
        res.json({ message: "No Data Fetched For Details" })
    })
})

module.exports = router