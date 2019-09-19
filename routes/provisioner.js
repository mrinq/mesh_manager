const express = require('express')
const networks = new express.Router()
const Network = require('../models').network
const Provisioner = require('../models').provisioner
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let network = req.body;
        
        let  result = await Provisioner.create({
            mesh_uuid: req.meshUUID,
        });

        await result.FetchNewAvailableRange()

        res.status(201).send({type: "success", message: result})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

networks.get('/:provisionerUUID/unicast_range', async (req, res) => {

    try {
        
        let provisioner = await Provisioner.findOne({
            where: {
                provisioner_uuid: req.params.provisionerUUID,
            }
        });

        provisioner.available_range = await provisioner.FetchNewAvailableRange()


        res.status(200).send({type: "success", message: {available_range: provisioner.available_range}})
    } catch (e) {
        res.status(500).send()
    }
})


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