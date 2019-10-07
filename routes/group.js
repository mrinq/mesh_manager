const express = require('express')
const groups = new express.Router()
const Network = require('../models').network
const Provisioner = require('../models').provisioner
const Group = require('../models').group
const GroupNode = require('../models').group_node
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
groups.post('/', async (req, res) => {
    try {
        
        let group = req.body;
        
        let  result = await Group.create({
            mesh_uuid: req.meshUUID,
            name: group.name,
            address: group.address,
            parentAddress:group.parentAddress
        });

        if(group.nodes){
            group.nodes.forEach(async function(uuid) {
                await GroupNode.create({
                    node_uuid: uuid,
                    group_id: result.id
                });
            })
        }


        res.status(201).send({type: "success", message: result})

    } catch (e) {
        res.status(400).send(e)
    }
})


groups.get('/', async (req, res) => {
    try {
        let network = await Network.findOne(
            {
                where: {
                    mesh_uuid: req.meshUUID
                    },
                    include: [
                        {
                            model: Group,
                            as: "groups",
                        }
                    ]
                }
            );

        res.send(_groupSerializer(network.groups))
    } catch (e) {
        res.status(400).send(e)
    }
})

function _groupSerializer(groups) {
    let toReturn = [];

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i]
        toReturn.push({
            id: group.id,
            name: group.name,
            address: group.address,
            parentAddress: group.parentAddress,
        })
    }

    return {type: "success", message: toReturn}
}

module.exports = groups