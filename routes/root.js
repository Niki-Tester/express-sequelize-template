const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	return res.send('Root Route');
});

module.exports = router;
