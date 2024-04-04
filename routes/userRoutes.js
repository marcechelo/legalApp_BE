const express                               = require('express');
const UserController                        = require('../controllers/userController');
const PdfGenerator                          = require('../pdfGenerator/pdfGenerator');
const PdfTest                               = require('../pdfGenerator/pdf');
const { registerValidator, loginValidator } = require('../validators/userValidator');
const router                                = express.Router();

router.post('/login', loginValidator, UserController.login);
router.post('/register', registerValidator, UserController.registerUser);
router.post('/authToken', registerValidator, UserController.authToken);

router.get('/download', registerValidator, PdfGenerator.generatePdf);
router.get('/test', registerValidator, PdfGenerator.test);
router.get('/testPdf', registerValidator, PdfTest.work);

module.exports = router;