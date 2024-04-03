const express = require('express');
const CatalogueController = require('../controllers/catalogueController');
const router = express.Router();

router.post('/getCatalogue', CatalogueController.getCatalogue);

module.exports = router;