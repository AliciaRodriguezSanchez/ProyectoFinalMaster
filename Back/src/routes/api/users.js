const express = require('express');
const { register, resetPassword, getNumberUsers, getUsers, stateChange, roleChange } = require('../../controllers/users.controller');
const router = express.Router();

router.post('/register', register);
router.patch('/reset-password', resetPassword);
router.get('/count', getNumberUsers);
router.get('/', getUsers);
router.put('/:id/status', stateChange);
router.put('/:id/role', roleChange)

module.exports = router;
