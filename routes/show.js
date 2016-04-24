/**
 * Created by Administrator on 2016/4/23 0023.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('show/front', { title: 'Express' });
});

router.get('/menu', function(req, res, next) {
    res.render('show/menu', { title: 'Express' });
});

module.exports = router;
