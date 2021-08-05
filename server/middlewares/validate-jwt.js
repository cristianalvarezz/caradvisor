const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = (req, res, next) => {

    // read the  Token
    const token = req.header('x-token');

    // I check the json web token
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'There is no token in the request '
        });
    }

    // I check the json web token
    try {
        // this will try to check the ide with the token and the signature
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Invalid token'
        });
    }

}
const varlidateADMIN_ROLE = async(req, res, next) => {

    const uid = req.uid;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        }

        if (userDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'You dont have the privilege of doing that'
            });
        }

        next();


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        })
    }

}

// this will prevent a non-administrator user from deleting other users 
const varlidateADMIN_ROLE_or_sameUser = async(req, res, next) => {

    // if these two become the same it means that it is a user trying to update itself
    const uid = req.uid;
    const id = req.params.id;

    try {

        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'User does not exist'
            });
        }

        if (userDB.role === 'ADMIN_ROLE' || uid === id) {

            next();

        } else {
            // if it is not, it does not have permissions to delete 
            return res.status(403).json({
                ok: false,
                msg: 'You have no privilege to do that'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Talk to the administrator'
        })
    }

}



module.exports = {
    validateJWT,
    varlidateADMIN_ROLE,
    varlidateADMIN_ROLE_or_sameUser
}