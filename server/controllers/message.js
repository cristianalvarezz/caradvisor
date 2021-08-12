const { response, request } = require('express');
const Follow = require('../models/follow')
const User = require('../models/user');
const Message = require('../models/message');
const mongoosePaginate = require('mongoose-pagination');
const moment = require('moment');

/*** Método que envía lo mensajes entre los usuarios ***/
const saveMessage = async(req = request, res = response) => {
    const message = new Message(req.body);
    message.created_at = moment().unix();
    if (!await User.findById(message.receiver) || !await User.findById(message.emitter)) return res.status(200).send({ message: 'El usuario no existe' });
    if (!message.text || !message.receiver) return res.status(200).send({ message: 'ERROR: Envía los datos necesarios!!!' });
    await message.save();
    res.json({
        message
    });
}

/*** Método para listar los mensajes recibidos ***/
const getReceivedMessages = async(req = request, res = response) => {

        const { receiver } = req.body;
        console.log(receiver)
        var page = 1;
        if (req.params.page) {
            page = req.params.page;
        }
        var items_per_page = 5;
        await Message.find({ receiver: receiver }).sort('-created_at').populate('receiver emitter', '_id name surname nick image').paginate(page, items_per_page, (err, messages, total) => {
            if (err) return res.status(500).send({ message: 'ERROR en la petición!!!' });
            if (total == 0) return res.status(404).send({ message: 'No hay mensajes recibidos' });

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total / items_per_page),
                messages: messages
            });
        });

    }
    /*** Método para listar los mensajes enviados ***/
const getEmittedMessages = async(req = request, res = response) => {
    var { emitter } = req.body;
    console.log(emitter);
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var items_per_page = 5;

    await Message.find({ emitter: emitter }).sort('-created_at').populate('receiver', '_id name surname nick image').paginate(page, items_per_page, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'ERROR en la petición!!!' });
        if (total == 0) return res.status(404).send({ message: 'No hay mensajes recibidos' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / items_per_page),
            messages: messages
        });
    });
}

/*** Método para listar los mensajes no leidos ***/
const getUnviewedMessages = async(req = request, res = response) => {
    const { receiver } = req.body;
    var page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    var items_per_page = 5;

    await Message.find({ receiver: receiver, viewed: false }).sort('-created_at').populate('emitter receiver', '_id name surname nick image').paginate(page, items_per_page, (err, messages, total) => {
        if (err) return res.status(500).send({ message: 'ERROR en la petición!!!' });
        if (total == 0) return res.status(404).send({ message: 'No hay mensajes no leidos' });

        return res.status(200).send({
            total: total,
            pages: Math.ceil(total / items_per_page),
            messages: messages
        });
    });
}

/*** Método para listar los mensajes no leidos ***/
const countUnviewedMessages = async(req = request, res = response) => {
    const { receiver } = req.body;
    await Message.count({ receiver: receiver, viewed: false }).exec((err, count) => {
        if (err) return res.status(500).send({ message: 'ERROR en la petición!!!' });
        if (count == 0) return res.status(404).send({ message: 'No hay mensajes no leidos' });

        return res.status(200).send({
            'unviewed': count
        });
    });
}

/*** Método para marcar como leidos los mensajes ***/
const setViewedMessages = async(req = request, res = response) => {
    const { receiver } = req.body;

    Message.updateMany({ receiver: receiver, viewed: false }, { viewed: true }, { 'multi': true }).exec((err, messagesUpdated) => {
        if (err) return res.status(500).send({ message: 'ERROR en la petición!!!' });

        return res.status(200).send({
            messages: messagesUpdated
        });
    });
}







module.exports = {
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    countUnviewedMessages,
    setViewedMessages

}