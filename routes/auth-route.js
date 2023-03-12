const router = require('express').Router()
const User = require('../models/user')
const Transaction = require('../models/user')
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
router.put('/editbalance/:id', (req, res) => {
    const data = {
        balance: req.body.balance
    };
    var date = new Date();
    var formattedDate = date.toLocaleDateString('en-GB');
    User.findById(req.params.id).then((value) => {
        User.findByIdAndUpdate(req.params.id, { $set: data }).then(() => {
            var ob = {
                date: formattedDate,
                amount: Math.abs(value.balance - req.body.balance),
                updatedBalance: req.body.balance,
                type: req.body.type
            }
            User.findByIdAndUpdate(req.params.id, { $push: { transactions: ob } }).then(() => {
                res.json({ success: true, message: "History Stored" })
            }).catch((error) => {
                console.log(errpr)
            })
        }).catch((err) => {
            console.log(err);
            res.json({ success: false, message: "Error Updating Balance" });
        });
    }).catch((error) => {
        console.log(error)
    })

});

router.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        const data = new User({
            name: req.body.name,
            phone: req.body.phone,
            password: hash,
            account: req.body.account,
            balance: req.body.balance,
            card: generateRandomNumber(),
            email: req.body.email
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
router.post('/transaction', async (req, res) => {
    const senderAccount = req.body.senderAccount;
    const recipientAccount = req.body.recipientAccount.replace(/\s+/g, '');
    const amount = parseInt(req.body.amount);

    try {
        const sender = await User.findOne({ account: senderAccount });
        const recipient = await User.findOne({ account: recipientAccount });

        if (!sender || !recipient) {
            res.json({ success: false, message: "Account Not Found Transaction Not Done" });
            return;
        }

        if (sender.balance < amount) {
            res.json({ success: false, message: "Insufficient balance" });
            return;
        }

        sender.balance -= amount;
        recipient.balance += amount;

        var date = new Date();
        var formattedDate = date.toLocaleDateString('en-GB');
        var senderTransaction = {
            date: formattedDate,
            amount: amount,
            updatedBalance: sender.balance,
            type: "debit",
            account: recipientAccount
        }
        var recipientTransaction = {
            date: formattedDate,
            amount: amount,
            updatedBalance: recipient.balance,
            type: "credit",
            account: senderAccount
        }
        sender.transactions.push(senderTransaction);
        recipient.transactions.push(recipientTransaction);

        await sender.save();
        await recipient.save();

        res.json({ success: true, message: "Transaction Done" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

router.put('/editbalance/:id', (req, res) => {
    const data = {
        balance: req.body.balance
    };
    var date = new Date();
    var formattedDate = date.toLocaleDateString('en-GB');
    User.findById(req.params.id).then((value) => {
        User.findByIdAndUpdate(req.params.id, { $set: data }).then(() => {
            var ob = {
                date: formattedDate,
                amount: Math.abs(value.balance - req.body.balance),
                updatedBalance: req.body.balance,
                type: req.body.type
            }
            User.findByIdAndUpdate(req.params.id, { $push: { transactions: ob } }).then(() => {
                res.json({ success: true, message: "History Stored" })
            }).catch((error) => {
                console.log(error)
            })
        }).catch((err) => {
            console.log(err);
            res.json({ success: false, message: "Error Updating Balance" });
        });
    }).catch((error) => {
        console.log(error)
    })

});
router.post('/checkemail', (req, res) => {
    const email = req.body.email;
    User.findOne({ email: email }).then((user) => {
        if (user) {
            const payload = {
                userId: user._id,
                userName: user.name,
                userPhone: user.phone,
                userAccount: user.account
            }
            const token = jwt.sign(payload, "webBatch")
            res.json({ success: true, message: "Email Found", token: token })
        }
        else {
            res.json({ success: false, message: "Email Not Exist Or Found" })
        }
    })
});
module.exports = router