var express = require('express')
var router = express.Router()

var api = require('../api/api_accounts')

router.post('/login', function (req, res) {
    api.login(req, res)
})

router.get('/select_accounts', function (req, res) {
    api.select_accounts(req, res)
})

router.post('/insert_accounts', function (req, res) {
    api.insert_accounts(req, res)
})

router.patch('/update_accounts', function (req, res) {
    api.update_accounts(req, res)
})

router.patch('/update_password', function (req, res) {
    api.update_password(req, res)
})

router.post('/delete_accounts', function (req, res) {
    api.delete_accounts(req, res)
})

module.exports = router
