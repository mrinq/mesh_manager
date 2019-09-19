const express = require('express')
const networks = new express.Router()
const Network = require('../models').network
const NetworkKey = require('../models').network_key
const ApplicationKey = require('../models').application_key
const nodes = require('./node')
const provisioners = require('./provisioner')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let network = req.body;
        
        let result = await Network.create({
            name: network.name,
            network_type: network.network_type
        });

        var network_key = await result.getNetwork_keys({attributes: ['key']});
        var application_key = await result.getApplication_keys({attributes: ['key']});

        res.status(201).send({type: "success",message: {
            meshUUID: result.mesh_uuid,
            name: result.name,
            network_type: result.network_type,
            application_key: application_key,
            network_key: network_key
        }})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

//Update a new network
networks.patch('/:meshUUID', async (req, res) => {
    try {
        
        let network = req.body;
        
        let result = await Network.update(
            { name: network.name },
            { where: { meshUUID: req.params.meshUUID  }
        })

        res.status(201).send({type: "success", message: ""})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

networks.use('/:meshUUID/nodes', function(req, res, next) {
    req.meshUUID = req.params.meshUUID;
    next()
}, nodes);

networks.use('/:meshUUID/provisioners', function(req, res, next) {
    req.meshUUID = req.params.meshUUID;
    next()
}, provisioners);

networks.get('/', async (req, res) => {
    try {

        var result = await Network.findAll({
            // where: {mesh_uuid: {[Op.or]: req.query.array}},
            // include: [{ all: true, nested: true}]
            include: [{
                where: {mesh_uuid: {[Op.or]: req.query.array}},
                model: ApplicationKey,
                as: "application_keys",
            },
            { 
                where: {mesh_uuid: {[Op.or]: req.query.array}},
                model: NetworkKey,
                as: "network_keys",
            }]
            
        });



        res.status(201).send(_networksSerializer(result))
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


function _networksSerializer(networks) {
    let toReturn = [];

    
    for (let i = 0; i < networks.length; i++) {
        let network = networks[i]
            toReturn.push({
            meshUUID: network.mesh_uuid,
            name: network.name,
            network_type: network.network_type,
            application_key: network.application_keys[0].key,
            network_key: network.network_keys[0].key
        })
    }

    return {type: "success", message: toReturn}
}

module.exports = networks