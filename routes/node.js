const express = require('express')
const networks = new express.Router()
const Node = require('../models').node
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let node = req.body;
        
        let result = await Node.create({
            mesh_uuid: req.meshUUID,
            name: node.name,
            unicast_address: node.unicast_address,
            device_key: node.device_key,
            security: node.security,
            configComplete: node.configComplete,
            name: node.node,
            cid: node.cid,
            pid: node.pid,
            vid: node.vid,
            crpl: node.crpl,
            features: node.features,
            appKeys:  node.appKeys,
            netKeys: node.netKeys,
            elements: node.elements,
            secureNetworkBeacon: node.secureNetworkBeacon,
            defaultTTL: node.defaultTTL,
            networkTransmit: node.networkTransmit,
            relayRetransmit: node.relayRetransmit,
            blacklisted: node.blacklisted,

        });

        res.status(201).send({type: "success", message: result})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

networks.get('/', async (req, res) => {

    try {
        var result = await Node.findAll({
            where: {mesh_uuid: "22ab54523c525333b4ac512aa44b222b"}
        });

        res.status(200).send({type: "success", message: result})
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