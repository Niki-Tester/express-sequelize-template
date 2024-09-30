const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	return res.render('index', {
		routeTemplate: 'home',
		title: 'Home',
	});
});

module.exports = router;
