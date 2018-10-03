const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function (req, res) {

    let index = req.query.index || 0;
    index = Number(index);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    filter = {
        status: true
    }

    User.find(filter, 'name email role status google img')
        .skip(index)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count(filter, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    count
                });
            })

        })

})

app.post('/usuario', function (req, res) {

    let body = req.body;


    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })
    })

})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            user: userDB
        })
    })


})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User does not exist"
                }
            })
        }

        res.json({
            ok: true,
            userDeleted
        })

    })
})

// app.delete('/usuario/:id', function (req, res) {
//     let id = req.params.id;
//     User.findByIdAndRemove(id, (err, userDeleted) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             })
//         }

//         if (!userDeleted) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: "User does not exist"
//                 }
//             })
//         }

//         res.json({
//             ok: true,
//             userDeleted
//         })

//     })
// })

module.exports = app;
