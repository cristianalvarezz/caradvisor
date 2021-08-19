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

const { validateJWT } = require('../middlewares/validate-jwt')

router.post('/', validateJWT, saveFollow);
router.delete('/:id', validateJWT, deleteFollow);

router.get('/get-my-follows', validateJWT, getMyFollows);
router.get('/get-follow-backs', validateJWT, getFollowBacks);

router.get('/following/:id?/:page?', validateJWT, getFollowingUsers);
router.get('/followed/:id?/:page?', validateJWT, getFollowedUsers);



module.exports = router;