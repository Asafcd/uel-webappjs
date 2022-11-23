const express = require('express')
const router = express.Router();
const newsController = require('../controllers/newsController')

router.get('/:id', newsController.getCategorizedNews );
router.get('/vernoticia/:id', newsController.getOneNew );

module.exports = router;