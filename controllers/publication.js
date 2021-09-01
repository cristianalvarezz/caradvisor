const { response, request } = require('express');
const Follow = require('../models/publication');
const User = require('../models/user');
const Publication = require('../models/publication');

const mongoosePaginate = require('mongoose-pagination');
const moment = require('moment');

const savePublication = async(req = request, res = response) => {
    const publication = new Publication(req.body);
    publication.created_at = moment().unix();
    if (!await User.findById(publication.user)) return res.status(200).send({ publication: 'El usuario no existe' });
    if (!publication.text) return res.status(200).send({ publication: 'ERROR: Envía los datos necesarios!!!' });
    await publication.save();
    res.json({
        publication
    });
}

const getPublications = async(req = request, res = response) => {
    const { user } = req.body;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var items_per_page = 5;

    Follow.find({ user: user }).exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'ERROR al devolver el seguimiento!!!' });

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        follows_clean.push(user); // Añado también mis publicaciones

        Publication.find({ user: { '$in': follows_clean } }).sort('-created_at').populate('user', 'name surname image _id').paginate(page, items_per_page, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'ERROR al devolver publicaciones!!!' });
            if (total == 0) return res.status(404).send({ message: 'NO hay publicaciones' });

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total / items_per_page),
                page: page,
                items_per_page: items_per_page,
                publications
            })
        });
    });
}

const getPublicationsByUser = async(req = request, res = response) => {

    var user_id;
    var page = 1;

    if (!req.params.id) {
        return res.status(500).send({ message: 'ERROR al devolver publicaciones!!!' });
    } else {
        user_id = req.params.id;
    }
    if (req.params.page) {
        page = req.params.page;
    }

    var items_per_page = 5;

    Publication.find({ user: user_id }).sort('-created_at').populate('user', 'name surname image _id').paginate(page, items_per_page, (err, publications, total) => {
        if (err) return res.status(500).send({ message: 'ERROR al devolver publicaciones!!!' });
        if (total == 0) return res.status(404).send({ message: 'NO hay publicaciones' });

        return res.status(200).send({
            total_items: total,
            pages: Math.ceil(total / items_per_page),
            page: page,
            items_per_page: items_per_page,
            publications
        })
    });
}

const getPublication = async(req = request, res = response) => {
    var publication_id = req.params.id;
    await Publication.findById(publication_id, (err, publication) => {
        if (err) return res.status(500).send({ message: 'ERROR al devolver la publicacion!!!' });
        if (publication) res.status(404).send({ message: 'NO existe la publiación!!' });

        return res.status(200).send({ publication });
    });
}

const deletePublication = async(req = request, res = response) => {
    var id_user = req.params.id_user;
    var id_publication = req.params.id_publication;
    Publication.findOneAndRemove({ user: id_user, '_id': id_publication }, (err, publicationRemoved) => {
        if (err) return res.status(500).send({ message: 'ERROR al borrar la publicacion!!!' });
        if (!publicationRemoved) res.status(404).send({ message: 'NO se ha borrado la publicación!! Comprueba que seas su autor.' });

        return res.status(200).send({ message: 'Publicación eliminada correctamente' });
    });
}

const uploadImage = async(req = request, res = response) => {}




module.exports = {
    savePublication,
    getPublications,
    getPublicationsByUser,
    getPublication,
    deletePublication,
    uploadImage


}