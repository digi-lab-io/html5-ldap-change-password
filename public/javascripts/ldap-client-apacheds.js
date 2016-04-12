var ldap = require('ldapjs');
var ldapCfg = require('../../config');


var client = ldap.createClient({
    url: ldapCfg.ldap_host_url,
    idleTimeout: 200
});

function bind() {
    client = ldap.createClient({
        url: ldapCfg.ldap_host_url,
        idleTimeout: 200
    });
    client.bind(ldapCfg.ldap_bind_user, ldapCfg.ldap_bind_password, function (err) {
        if (err != null) {
            console.log(err);
        } else {
            console.log('LDAP-Client successful binded.');
        }
    });
}


exports.changePassword = function (userId, oldPassword, newPassword) {
    bind();
    client.search(ldapCfg.ldap_base_dn, opts = {
        filter: ldapCfg.ldap_user_prefix + userId,
        scope: 'sub',
        attributes: ['dn']
    }, function (err, res) {
        res.on('searchEntry', function (entry) {
            var userDN = entry.object.dn;
            client.bind(userDN, oldPassword, function (err) {
                client.modify(userDN, [
                    new ldap.Change({
                        operation: 'replace',
                        modification: {
                            userPassword: newPassword
                        }
                    })
                ], function (err) {
                    if (err) {
                        console.log(err.code);
                        console.log(err.name);
                        console.log(err.message);
                    }
                    else {
                        console.log('Password changed!');
                    }
                });
            });
        });
        res.on('end', function (result) {
            console.log('Status: ' + result.status);
        });
    });

};

exports.userExists = function (userId) {
    bind();
    client.search(ldapCfg.ldap_base_dn, opts = {
        filter: ldapCfg.ldap_user_prefix + userId,
        scope: 'sub',
        attributes: ['dn']
    }, function (err, res) {
        if (err != null)
            console.log(err);

        res.on('searchEntry', function (_entry) {
            client.userAvailable = true;
            console.log('entry: ' + JSON.stringify(_entry.object));
        });

        res.on('error', function (err) {
            console.error('error: ' + err.message);
        });

        res.on('end', function (result) {
            console.log('LDAP-Client successful search. Status: ' + result.status);
            client.unbind();
        });

    });

};