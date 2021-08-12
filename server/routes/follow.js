const { Router } = require("express");
const router = Router();
const {
    deleteFollow,
    saveFollow,
    getFollowingUsers,
    getMyFollows,
    getFollowBacks,
    getFollowedUsers
} = require('../controllers/follow');


router.post('/', [], saveFollow);
router.delete('/:id', [], deleteFollow);

router.get('/get-my-follows', [], getMyFollows);
router.get('/get-follow-backs', [], getFollowBacks);

router.get('/following/:id?/:page?', [], getFollowingUsers);
router.get('/followed/:id?/:page?', [], getFollowedUsers);



module.exports = router;