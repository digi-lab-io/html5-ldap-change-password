var express = require('express');
var ldapClient = require('../public/javascripts/ldap-client-apacheds.js');
var router = express.Router();

/* GET ldapRoute listing. */
router.get('/', function (req, res, next) {
    console.log(req.body);
    //res.send('respond with a resource');
    res.render('ldap', {title: 'HTML5 LDAP Password Change Tool'});

});


router.use('/change/password', function (req, res, next) {
    ldapClient.changePassword(req.body.userName, req.body.oldPassword, req.body.confirmPassword);
    res.send('O.K.');
});

module.exports = router;
