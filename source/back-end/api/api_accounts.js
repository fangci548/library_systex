var fs = require("fs");
var path = require('path');
var db = require('../utility/DbFactory');
var utility = require('../utility/utils');

var sha256 = require('js-sha256').sha256;

const dotenvAbsolutePath = path.join(__dirname, '../.env');
const dotenv = require('dotenv').config({ path: dotenvAbsolutePath });

if (dotenv.error) {
    throw dotenv.error;
}

let dbFactory = new db.DbFactory(   process.env.DB_HOST,
                                    process.env.DB_USER,
                                    process.env.DB_PASS,
                                    process.env.DB_NAME,
                                    process.env.DB_PORT,
                                    true);

module.exports = {
    login: function(req, res) {
        let example = ['account', 'password'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return
        }

        var sql = ' SELECT * FROM account_info WHERE account = ? AND password = ? ';

        sql = dbFactory.build_mysql_format(sql, [req.body.data.account, sha256(req.body.data.password)]);

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while login the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },

    select_accounts: function(req, res) {
        var sql = ' SELECT * FROM account_info ';

        let statusData = {
            successCode: 200,
            errorCode: 500,
            errorMsg: "Some error occurred while select the account."
        };

        dbFactory.action_db(sql, statusData, res);

    },

    insert_accounts: function(req, res) {
        let example = ['account', 'password', 'name', 'job_number'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return
        }

        var sql = ' INSERT INTO `account_info` (`account`,`password`,`name`,`job_number`) VALUES (?,?,?,?) ';

        sql = dbFactory.build_mysql_format(sql, [   req.body.data.account,
                                                    sha256(req.body.data.password),
                                                    req.body.data.name,
                                                    req.body.data.job_number]);

        let statusData = {
            successCode: 201,
            errorCode: 500,
            errorMsg: "Some error occurred while inserting the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },

    update_accounts: function(req, res) {
        let example = ['account', 'name', 'job_number'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return
        }

        var sql = ' UPDATE `account_info` SET `name` = ? , `job_number` = ? WHERE (`account` = ?) ';

        sql = dbFactory.build_mysql_format(sql, [   req.body.data.name,
                                                    req.body.data.job_number,
                                                    req.body.data.account]);

        let statusData = {
            successCode: 202,
            errorCode: 500,
            errorMsg: "Some error occurred while update the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },

    update_password: function(req, res) {
        let example = ['account', 'password'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!');
            return
        }

        var sql = ' UPDATE `account_info` SET `password` = ? WHERE (`account` = ?) ';

        sql = dbFactory.build_mysql_format(sql, [   sha256(req.body.data.password),
                                                    req.body.data.account]);

        let statusData = {
            successCode: 202,
            errorCode: 500,
            errorMsg: "Some error occurred while update the account password."
        };

        dbFactory.action_db(sql, statusData, res);
    },

    delete_accounts: function(req, res) {
        let example = ['account'];

        if (false === utility.data_check(req.body.data, example)) {
            res.status(400).json('傳入值出現非預期狀況，請確認後再進行操作!')
            return
        }

        var sql =   ' DELETE `account_info`,`account_role_info`     '+
                    ' FROM `account_info`,`account_role_info`       '+
                    ' WHERE `account_info`.account = ?              '+
                    ' and `account_role_info`.job_number = `account_info`.job_number ';

        sql = dbFactory.build_mysql_format(sql, req.body.data.account);

        let statusData = {
            successCode: 203,
            errorCode: 500,
            errorMsg: "Some error occurred while delete the account."
        };

        dbFactory.action_db(sql, statusData, res);
    },
}
