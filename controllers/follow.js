const { response, request } = require('express');
const Follow = require('../models/follow')
const User = require('../models/user');
const mongoosePaginate = require('mongoose-pagination');

const saveFollow = async(req = request, res = response) => {
    const { user, followed } = req.body;

    const follow = new Follow(req.body);

    await Follow.findOne({ user: user, followed: followed }, async(err, result) => { // evitamos duplicados
        if (err) return res.status(500).send({ message: 'ERROR al guardar el follow!!!' });
        if (result) return res.status(200).send({ message: 'YA está siguiendo a ese usuario!!!' });
        await follow.save((err, followStored) => {
            if (err) return res.status(500).send({ message: 'ERROR al guardar el follow!!!' });
            if (!followStored) return res.status(404).send({ message: 'ERROR el follow no se ha guardado!!!' });

            return res.status(200).send({ follow: followStored });
        });
    });

}
const deleteFollow = async(req = request, res = response) => {
    const { user } = req.body;
    const { id } = req.params;

    Follow.find({ 'user': user, 'followed': id }).remove(async(err, result) => {
        if (err) return res.status(500).send({ message: 'ERROR al borrar el follow!!!' });
        if (result) return res.status(200).send({ message: 'El follow se ha eliminado' });
    });
}

/***	
 *	Método paginado para listar usuarios seguidos, por defecto del usuario actual,
 *	pero si recibe un id por url, serían los seguidos por ese usuario 
 ***/
const getFollowingUsers = async(req = request, res = response) => {
    var page = 1;
    var { user_id } = req.body;


    if (req.params.id && req.params.page) {
        user_id = req.params.id;
        page = req.params.page;
    }
    if (req.params.id) {
        if (req.params.id.length >= 4) { // el id es un string largo
            user_id = req.params.id;
        } else {
            page = req.params.id;
        }
    }

    var items_per_page = 3;

    Follow.find({ followed: user_id }).populate('user', '_id name surname nick').paginate(page, items_per_page, async(err, follows, total) => {
        if (err) return res.status(500).send({ message: 'ERROR en el servidor!!!' });

        User.findById(user_id, '-password', (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición!!' });
            if (!user) return res.status(404).send({ message: 'El usuario no existe!!' });
            if (total == 0) return res.status(200).send({ user: user });

            followUserIds(user_id).then((value) => {
                return res.status(200).send({
                    total: total,
                    user: user,
                    pages: Math.ceil(total / items_per_page),
                    follows: follows,
                    users_following: value.following,
                    users_followed: value.followed,
                    items_per_page: items_per_page
                });
            });
        });
    });
}
const getFollowedUsers = async(req = request, res = response) => {
    var page = 1;
    var { user_id } = req.body;
    if (req.params.id && req.params.page) {
        user_id = req.params.id;
        page = req.params.page;
    }
    if (req.params.id) {
        if (req.params.id.length >= 4) { // el id es un string largo
            user_id = req.params.id;
        } else {
            page = req.params.id;
        }
    }

    var items_per_page = 5;

    // con populate() lo que hacemos es recuperar el usuario seguido completo
    Follow.find({ user: user_id }).populate('followed', '_id name surname nick').paginate(page, items_per_page, async(err, follows, total) => {
        if (err) return res.status(500).send({ message: 'ERROR en el servidor!!!' });

        User.findById(user_id, '-password', async(err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición!!' });
            if (!user) return res.status(404).send({ message: 'El usuario no existe!!' });
            if (total == 0) return res.status(200).send({ user: user });

            followUserIds(user_id).then((value) => {
                return res.status(200).send({
                    total: total,
                    user: user,
                    pages: Math.ceil(total / items_per_page),
                    follows: follows,
                    users_following: value.following,
                    users_follow_me: value.followed,
                    items_per_page: items_per_page
                });
            });
        });
    });
}

/*** Método auxiliar ASÍNCRONO para sacar los ids de los usuarios seguidos y que me siguen ***/
async function followUserIds(user_id) {
    try {
        // con select 'valor':0 lo que hago es deseleccionar ese campo
        var followings = await Follow.find({ 'user': user_id }).select({ '_id': 0, '_v': 0, 'user': 0 }).exec()
            .then((followings) => {
                var follows_clean = [];

                followings.forEach((follow) => {
                    follows_clean.push(follow.followed);
                });

                return follows_clean;
            })
            .catch((err) => {
                return handleError(err);
            });

        var followeds = await Follow.find({ 'followed': user_id }).select({ '_id': 0, '_v': 0, 'followed': 0 }).exec()
            .then((followeds) => {
                var follows_clean = [];

                followeds.forEach((follow) => {
                    follows_clean.push(follow.user);
                });

                return follows_clean;
            })
            .catch((err) => {
                return handleError(err);
            });

        return {
            following: followings,
            followed: followeds
        }

    } catch (e) {
        console.log(e);
    }
}


/*** Método no paginado para listar los usuarios que estoy siguiendo ***/
const getMyFollows = async(req = request, res = response) => {
        const { user_id } = req.body;

        Follow.find({ user: user_id }).populate('user followed', '_id name surname nick').exec(async(err, follows) => {
            if (err) return res.status(500).send({ message: 'ERROR en el servidor!!!' });
            if (follows.length == 0) return res.status(404).send({ message: 'NO sigues a ningún usuario!!!' });

            return res.status(200).send({ follows });
        });
    }
    /*** Método no paginado para listar los usuarios que nos están siguiendo ***/
function getFollowBacks(req, res) {
    const { user_id } = req.body;

    Follow.find({ followed: user_id }).populate('user followed', '_id name surname nick').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'ERROR en el servidor!!!' });
        if (follows.length == 0) return res.status(404).send({ message: 'NO te sigue ningún usuario!!!' });

        return res.status(200).send({ follows });
    });
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getMyFollows,
    getFollowBacks,
    getFollowedUsers
}