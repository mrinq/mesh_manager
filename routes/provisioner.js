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
        await result.FetchNewGroupRange()
        await result.FetchNewSceneRange()

        console.log(result)

        res.status(201).send({type: "success", message: {mesh_uuid: result.mesh_uuid, provisioner_uuid: result.provisioner_uuid, alllocated_unicast_range: result.allocated_unicast_range, allocated_group_range: result.allocated_group_range, allocated_scene_range: result.allocated_scene_range}})

    } catch (e) {
        res.status(400).send(e)
    }
})

networks.get('/:provisionerUUID/allocated_unicast_range', async (req, res) => {

    try {
        
        let provisioner = await Provisioner.findOne({
            where: {
                provisioner_uuid: req.params.provisionerUUID,
            }
        });

        var available_unicast_range = await provisioner.FetchNewAvailableRange()


        res.status(200).send({type: "success", message: {allocated_unicast_range: available_unicast_range}})
    } catch (e) {
        res.status(500).send()
    }
})

networks.get('/:provisionerUUID/allocated_group_range', async (req, res) => {

    try {
        
        let provisioner = await Provisioner.findOne({
            where: {
                provisioner_uuid: req.params.provisionerUUID,
            }
        });

        var available_group_range = await provisioner.FetchNewGroupRange()


        res.status(200).send({type: "success", message: {allocated_group_range: available_group_range}})
    } catch (e) {
        res.status(500).send()
    }
})


networks.get('/:provisionerUUID/allocated_scene_range', async (req, res) => {

    try {
        
        let provisioner = await Provisioner.findOne({
            where: {
                provisioner_uuid: req.params.provisionerUUID,
            }
        });

        var available_scene_range = await provisioner.FetchNewSceneRange()


        res.status(200).send({type: "success", message: {allocated_scene_range: available_scene_range}})
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