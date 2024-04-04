const express               = require('express');
const CatalogueController   = require('../controllers/catalogueController');
const router                = express.Router();

router.get('/getChildren', CatalogueController.getChildren);

module.exports = router;