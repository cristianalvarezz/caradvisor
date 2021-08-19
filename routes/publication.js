const { Router } = require("express");
const router = Router();
const express = require('express');

const {
    savePublication,
    getPublications,
    getPublicationsByUser,
    getPublication,
    deletePublication,
    uploadImage,
} = require('../controllers/publication')



router.post('/', [], savePublication);
router.get('/publications/:page?', [], getPublications);
router.get('/publications-user/:id/:page?', [], getPublicationsByUser);
router.get('/publication/:id', [], getPublication);
router.delete('/:id', [], deletePublication);
router.post('/upload-image-pub/:id', [], uploadImage);



module.exports = router;