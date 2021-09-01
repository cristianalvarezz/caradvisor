const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Follow = require('../models/follow')
const User = require('../models/user');

/*** Método de Inicio ***/
const home = async(req = request, res = response) => {
    res.json({
        mensaje: "Hola "
    });
}

const saveUser = async(req = request, res = response) => {
    try {
        const { name, email, password, rol } = req.body;
        const user = new User(req.body);

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
        // // Guardar en BD
        await user.save();
        res.json({
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
}


const updateUser = async(req, res = response) => {

    try {
        const { id } = req.params;
        const {...resto } = req.body;

        const user = await User.findByIdAndUpdate(id, resto);
        res.json({
            user
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }

}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const userDelete = async(req, res = response) => {
    try {
        const { id } = req.params;

        await User.findByIdAndUpdate(id, { status: false });
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
}

const getUsers = async(req, res = response) => {
    const { identity_user_id } = req.body;

    var page = 1; // nos indica en que página estamos, por defecto la 1
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 9;
    await User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return res.status(500).send({ message: 'Error en la petición!!' });
        if (!users) return res.status(404).send({ message: 'No hay usuarios disponibles!!' });

        followUserIds(identity_user_id).then((value) => {
            return res.status(200).send({
                users: users, // --> se puede poner solo users, pq no cambiamos el nombre
                users_following: value.following,
                users_follow_me: value.followed,
                total: total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}
const getUser = async(req, res = response) => {

        var user_id = req.params.id;
        const { identity_user_id } = req.body;
        //eliminamos password al devolver el usuario
        User.findById(user_id, '-password', (err, user) => {
            if (err) return res.status(500).send({ message: 'Error en la petición!!' });
            if (!user) return res.status(404).send({ message: 'El usuario no existe!!' });

            // Compruebo si ya estoy siguiendo al usuario o si me está siguiendo
            /* 	Con el siguiente código comprobamos si lo seguimos, pero para saber si nos sigue
            *	tendríamos que hacer otro callback anidado
            Follow.findOne({user:req.user.sub, followed:user_id}).exec((err, follow) => {
            	if(err) return res.status(500).send({message: 'Error en la petición!!'});
            	return res.status(200).send({user, follow});
            });*/

            followThisUser(user_id, user_id).then((value) => {
                return res.status(200).send({ user, followed: value.followed, following: value.following });
            });
        });
    }
    /*** Método auxiliar ASÍNCRONO para sacar los ids de los usuarios seguidos y que me siguen ***/
const followUserIds = async(user_id) => {
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
    /*** Método auxiliar ASÍNCRONO para saber si seguimos a un usuario y si nos sigue ***/
async function followThisUser(identity_user_id, user_id) {
    try {
        var following = await Follow.findOne({ 'user': identity_user_id, 'followed': user_id }).exec()
            .then((following) => {
                return following;
            })
            .catch((err) => {
                return handleError(err);
            });

        var followed = await Follow.findOne({ 'user': user_id, 'followed': identity_user_id }).exec()
            .then((followed) => {
                return followed;
            })
            .catch((err) => {
                return handleError(err);
            });

        return {
            following: following,
            followed: followed
        }
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    home,
    saveUser,
    updateUser,
    userPatch,
    userDelete,
    getUsers,
    getUser
}