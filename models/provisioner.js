'use strict';
const randomstring = require("randomstring");
const BigNumber = require('bignumber.js');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


module.exports = (sequelize, DataTypes) => {
  const provisioner = sequelize.define('provisioner', {
    mesh_uuid: DataTypes.STRING,
    provisioner_uuid: DataTypes.STRING,
    address: DataTypes.STRING,
    allocated_unicast_range: DataTypes.JSON,
    allocated_group_range: DataTypes.JSON,
    allocated_scene_range: DataTypes.JSON,
    range_sort_value: DataTypes.JSON,
    sort_value: DataTypes.JSON,

  }, {
    hooks: {
      beforeCreate: async function(provisioner, options, fn) {
        provisioner.provisioner_uuid = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
      },
      afterCreate: async function(provisioner, options, fn) {
        var range = await provisioner.FetchNewAvailableRange()
        await provisioner.FetchNewGroupRange()
        await provisioner.FetchNewSceneRange()
        await sequelize.models.node.create({
          mesh_uuid: provisioner.mesh_uuid,
          node_uuid: provisioner.provisioner_uuid,
          unicast_address: range.lowAddress
        })
        await provisioner.AssignProvisionerNewUicastAddress(range)
      }
    }
  });

  provisioner.prototype.AssignProvisionerNewUicastAddress = async function (range) {
    var lowAddress = new BigNumber(range.lowAddress, 16)
    this.allocated_unicast_range = {lowAddress: (lowAddress.plus(new BigNumber(1, 16))).toString(16), highAddress: range.highAddress}
    await this.save()
  }

  provisioner.prototype.FetchNewAvailableRange = async function () {
    let existingUserNetwork = await provisioner.findOne({
      where: {
        mesh_uuid: this.mesh_uuid,
        allocated_unicast_range:{
          [Op.not]: null
        }
      },
      order: [
        [sequelize.json("sort_value.unicast"), "DESC"],
      ]
    });

    
    if(existingUserNetwork){
      var a = existingUserNetwork.allocated_unicast_range //14 is decimal in 20
      var proxy = new BigNumber(a.highAddress, 16)
      var new_from = proxy.plus(new BigNumber(1, 16))
      
      var new_to = new_from.plus(new BigNumber(13, 16)) //13 is decimal in 19
      
      this.sort_value.unicast = existingUserNetwork.sort_value.unicast + 1;
      this.sort_value = this.sort_value

      this.allocated_unicast_range = {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      await this.save()
      return {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      
    }else{
      this.allocated_unicast_range = {lowAddress: "1", highAddress: "14"}
      this.sort_value.unicast = 0
      this.sort_value = this.sort_value
      await this.save()
      return {lowAddress: "1", highAddress: "14"} //14 is 20 in decimal
    }
  },


  provisioner.prototype.FetchNewGroupRange = async function () {
    let existingUserNetwork = await provisioner.findOne({
      where: {
        mesh_uuid: this.mesh_uuid,
        allocated_group_range:{
          [Op.not]: null
        }
      },
      order: [
        [sequelize.json("sort_value.group"), "DESC"],
      ]
    });

    if(existingUserNetwork){
      var a = existingUserNetwork.allocated_group_range //14 is decimal in 20
      var proxy = new BigNumber(a.highAddress, 16)
      var new_from = proxy.plus(new BigNumber(1, 16))
      
      var new_to = new_from.plus(new BigNumber(13, 16)) //13 is decimal in 19
      
      this.sort_value.group = existingUserNetwork.sort_value.group + 1;
      this.sort_value = this.sort_value

      
      this.allocated_group_range = {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      await this.save()

      return {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      
    }else{
      this.allocated_group_range = {lowAddress: "C000", highAddress: "C014"}
      this.sort_value.group = 0
      this.sort_value = this.sort_value
      await this.save()
      return {lowAddress: "C000", highAddress: "C014"} //14 is 20 in decimal
    }
  },

  provisioner.prototype.FetchNewSceneRange = async function () {
    let existingUserNetwork = await provisioner.findOne({
      where: {
        mesh_uuid: this.mesh_uuid,
        allocated_scene_range:{
          [Op.not]: null
        }
      },
      order: [
        [sequelize.json("sort_value.scene"), "DESC"],
      ]
    });

    if(existingUserNetwork){
      var a = existingUserNetwork.allocated_scene_range //14 is decimal in 20
      var proxy = new BigNumber(a.highAddress, 16)
      var new_from = proxy.plus(new BigNumber(1, 16))
      
      var new_to = new_from.plus(new BigNumber(13, 16)) //13 is decimal in 19
      
      this.sort_value.scene = existingUserNetwork.sort_value.group + 1;
      this.sort_value = this.sort_value

      
      this.allocated_scene_range = {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      await this.save()

      return {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      
    }else{
      this.allocated_scene_range = {lowAddress: "1", highAddress: "14"}
      this.sort_value.scene = 0
      this.sort_value = this.sort_value
      await this.save()
      return {lowAddress: "1", highAddress: "14"} //14 is 20 in decimal
    }
  },


  provisioner.associate = function(models) {
    provisioner.belongsTo(models.network, {
      foreignKey: "mesh_uuid",
      targetKey: 'mesh_uuid',
      as: "provisioner"
    });
  };
  return provisioner;
};