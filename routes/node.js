const express = require('express')
const networks = new express.Router()
const Node = require('../models').node
const Network = require('../models').network
const GroupNode = require('../models').group_node
const Group = require('../models').group
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const randomstring = require("randomstring");

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let node = req.body;
        
        let result = await Node.create({
            mesh_uuid: req.meshUUID,
            node_uuid: genenrate_node_uuid(),
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

        if(node.group_id){
            await GroupNode.create({
                node_uuid: result.node_uuid,
                group_id: node.group_id
            });
        }

        res.send(_nodeSerializer(result))

    } catch (e) {
        res.status(400).send(e)
    }
})

networks.get('/', async (req, res) => {

    try {
        let network = await Network.findOne(
            {
                where: {
                    mesh_uuid: req.meshUUID
                    },
                    include: [
                        {
                            model: Node,
                            as: "nodes",
                            include:[
                                {
                                    model: Group,
                                    as: "groups",
                                }
                            ]
                        }
                    ]
                }
            );

        res.send(_nodesSerializer(network.nodes))
    } catch (e) {
        res.status(400).send(e)
    }
})


networks.delete('/:uuid', async (req, res) => {
    try {

        let node = await Node.findOne({
            where: {
                node_uuid: req.params.uuid,
            }})   

        await node.destroy();

        res.status(200).send({type: "success",message: {}})
    } catch (e) {
        res.status(500).send()
    }
})


networks.patch('/:uuid', async (req, res) => {
    try {

        await Node.update(
            {
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
            },
            { where: { node_uuid: req.params.uuid } }
            )

        res.status(200).send({type: "success",message: {}})
    } catch (e) {
        res.status(500).send()
    }
})

function genenrate_node_uuid() {
    var node_uuid = randomstring.generate({
        charset: 'abc12345',
        length: 32
      });

      console.log(node_uuid)

      return node_uuid
  }

  function _nodeSerializer(node) {

      var returnValue = {
        node_uuid: node.node_uuid,
        unicast_address: node.unicast_address
      }

      return {type: "success", message: returnValue}
  }


function _nodesSerializer(nodes) {
    let toReturn = [];

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        toReturn.push({
            mesh_uuid: node.meshUUID,
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
            groups: node.groups.map(a => a.id),
        })
    }

    return {type: "success", message: toReturn}
}

module.exports = networks