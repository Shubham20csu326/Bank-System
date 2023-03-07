const router = require('express').Router()
const User = require('../models/user')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var ObjectId = require('mongoose').Types.ObjectId;
router.get('/ok', (req, res) => {
    res.json({ message: "All Working" })
})
router.post('/login', (req, res) => {
    User.find({ email: req.body.email }).then((value) => {
        if (value.length < 1) {
            res.json({ success: false, message: "Email Not Found For Details" })
        }
        else {
            const user = value[0]
            bcrypt.compare(req.body.password, user.password, (err, value) => {
                if (value) {
                    const payload = {
                        userId: user._id,
                        position: user.position
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
router.get('/loginAuthorised/:email', (req, res) => {
    User.findOne({ email: req.params.email }).then((value) => {
        res.json({ success: true, message: "Data Fetched", logindata: value })
    })
})
router.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        const data = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            position: req.body.position,
            phone: req.body.phone
        })

        data.save().then(() => {
            res.json({ message: "Registered Successfully", success: true })
        }).catch(() => {
            res.json({ message: "All Fields Are Required", success: false })
        })
    })
})
router.get('/getUsers', (req, res) => {
    User.find().then((value) => {
        res.json({ value, message: "Data Fetched" })
    }).catch(() => {
        res.json({ message: "No Data Fetched For Details" })
    })
})
router.post('/setAuthorised/:id', (req, res) => {
    var ob = {
        authorised: req.body.authorised
    }
    User.findByIdAndUpdate(req.params.id, { $set: ob }).then((value) => {
        res.json({ success: true, message: "Changed" })
    })
})
router.delete('/deleteUser/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id).then(() => {
        res.json({ success: true, message: "User Deleted" })
    }).catch(() => {
        res.json({ success: false, message: "User Cannot Be Deleted" })
    })
})
router.get('/getEditDataUser/:id', (req, res) => {
    User.findById(req.params.id).then((value) => {
        res.json({ success: true, message: "Data Fetched", value })
    })
})
router.put('/editUser/:id', (req, res) => {
    var ob = {
        name: req.body.name,
        email: req.body.email,
        position: req.body.position,
        phone: req.body.phone
    }
    User.findByIdAndUpdate(req.params.id, { $set: ob }).then(() => {
        res.json({ success: true, message: "Data Edited" })
    }).catch(() => {
        res.json({ success: false, message: "Not Edited" })
    })
})
module.exports = router