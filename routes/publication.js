const { Router } = require("express");
const router = Router();
const express = require('express');
const { validateJWT } = require("../middlewares/validate-jwt")

const {
    savePublication,
    getPublications,
    getPublicationsByUser,
    getPublication,
    deletePublication,
    uploadImage,
} = require('../controllers/publication')



router.post('/', validateJWT, savePublication);
router.get('/publications/:page?', [], getPublications);
router.get('/publications-user/:id/:page?', [], getPublicationsByUser);
router.get('/publication/:id', [], getPublication);
router.delete('/:id_user/:id_publication', [], deletePublication);
router.post('/upload-image-pub/:id', [], uploadImage);



module.exports = router;