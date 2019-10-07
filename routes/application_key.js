const express = require('express')
const networks = new express.Router()
const Network = require('../models').network
const Provisioner = require('../models').provisioner
const ApplicationKey = require('../models').application_key
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let application_key = req.body;
        
        let  result = await ApplicationKey.create({
            application_type: application_key.application_type,
            application_name: application_key.application_name,
            mesh_uuid: req.meshUUID,
        });
        
        res.status(201).send({type: "success", message: result})
        
    } catch (e) {
        res.status(400).send(e)
    }
})

networks.get('/', async (req, res) => {
    try {
        let application_key = req.body;
        
        let appKey = await ApplicationKey.findOne(
            {
                where: {
                    mesh_uuid: req.meshUUID,
                    application_type: req.query.application_type
                    }
                }
            );

        res.status(201).send({type: "success", message: appKey})

    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = networks