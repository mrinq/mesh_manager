const express = require('express')
const networks = new express.Router()
const Network = require('../models').network
const NetworkKey = require('../models').network_key
const ApplicationKey = require('../models').application_key
const nodes = require('./node')
const application_keys = require('./application_key')
const provisioners = require('./provisioner')
const groups = require('./group')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

//Creates a new network
networks.post('/', async (req, res) => {
    try {
        
        let network = req.body;
        
        let result = await Network.create({
            name: network.name,
            network_type: network.network_type,
            application_type: "access_control"
        });


        res.status(201).send(await _networksSerializer(result))

       

    } catch (e) {
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
        res.status(400).send(e)
    }
})


networks.get('/:meshUUID', async (req, res) => {
    try {
        
        let network = req.body;

        
        let result = await Network.findOne(
            { where: { mesh_uuid: req.params.meshUUID  },
        })

        res.status(201).send(await _networksSerializer(result, req.query.provisioner_uuid))
        

    } catch (e) {
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


networks.use('/:meshUUID/groups', function(req, res, next) {
    req.meshUUID = req.params.meshUUID;
    next()
}, groups);


networks.use('/:meshUUID/application_keys', function(req, res, next) {
    req.meshUUID = req.params.meshUUID;
    next()
}, application_keys);

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


async function _networksSerializer(network, provisioner_uuid=null) {

    var provisioner;
    if(provisioner_uuid == null){
        provisioner = await network.getProvisioners({attributes: ['provisioner_uuid','allocated_unicast_range','allocated_group_range','allocated_scene_range'],raw:true})
    }else{
        provisioner = await network.getProvisioners({where: {provisioner_uuid: provisioner_uuid}, attributes: ['provisioner_uuid','allocated_unicast_range','allocated_group_range','allocated_scene_range'],raw:true})
    }
    

    var toReturn = {
        "meshUUID": network.mesh_uuid,
        "netKeys": await network.getNetwork_keys({attributes: ['index','key','phase','minSecurity'], raw:true}),
        "appKeys": await network.getApplication_keys({attributes: ['index','boundNetKey','key'], raw:true}),
        "provisioners": provisioner,
        "nodes": await network.getNodes({attributes: ['name', 'node_uuid', 'unicast_address','device_key','security','configComplete','name','cid','pid','vid','crpl','features','elements','secureNetworkBeacon','defaultTTL','networkTransmit','relayRetransmit','blacklisted'], raw:true}),
        "groups": await network.getGroups({attributes: ['address','parentAddress'], raw:true})
    }

    console.log(toReturn)

    return {type: "success", message: toReturn}
}

module.exports = networks