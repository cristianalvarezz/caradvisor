const { Router } = require("express");
const router = Router();


const {
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    countUnviewedMessages,
    setViewedMessages
} = require('../controllers/message')


router.post('/', [], saveMessage)
router.get('/my-messages/:page?', [], getReceivedMessages)
router.get('/messages/:page?', [], getEmittedMessages)

router.get('/unviewed-messages/:page?', [], getUnviewedMessages)
router.get('/count-unviewed-messages', [], countUnviewedMessages)
router.get('/set-viewed-messages', [], setViewedMessages)


module.exports = router;