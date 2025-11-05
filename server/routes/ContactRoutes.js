const express = require('express');
const { searchContacts, getDmContactList } = require('../controllers/ContactController');
const router = express.Router();

router.post('/search', searchContacts).get('/getdmcontacts', getDmContactList);

module.exports = router;