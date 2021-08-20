const User = require('../models/user');
const Publication = require('../models/publication')

const allowablecollections = [
    'users',
    'publications'
]
const searchUsers = async(term = '', res = response) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    const esMongoID = ObjectId.isValid(term); // TRUE 
    if (esMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        });
    }
    const regex = new RegExp(term, 'i');
    const user = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }]
    });

    res.json({
        results: user
    });
}

const searchPublication = async(term = '', res = response) => {
    var ObjectId = require('mongoose').Types.ObjectId;
    const esMongoID = ObjectId.isValid(term); // TRUE 
    if (esMongoID) {
        const publication = await Publication.findById(term);
        return res.json({
            results: (publication) ? [publication] : []
        });
    }
    const regex = new RegExp(term, 'i');
    const publication = await Publication.find({
        $or: [{ text: regex }]
    });
    res.json({
        results: publication
    });
}

const search = (req, res = response) => {
    const { colection, term } = req.params;
    if (!allowablecollections.includes(colection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ allowablecollections }`
        })
    }
    switch (colection) {
        case 'users':
            searchUsers(term, res)
            break;
        case 'publications':
            searchPublication(term, res)
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }
}

module.exports = {
    search
}