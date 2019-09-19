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
    range_sort_value: DataTypes.JSON,

  }, {
    hooks: {
      beforeCreate: async function(provisioner, options, fn) {
        provisioner.provisioner_uuid = randomstring.generate({
          charset: 'abc12345',
          length: 32
        });
        // await provisioner.FetchNewAvailableRange()
      }
    }
  });
  provisioner.prototype.FetchNewAvailableRange = async function () {
    let existingUserNetwork = await provisioner.findOne({
      where: {
        mesh_uuid: this.mesh_uuid,
        allocated_unicast_range:{
          [Op.not]: null
        }
      },
      order: [ [ 'range_sort_value', 'DESC' ]]
    });

    if(existingUserNetwork){
      var a = existingUserNetwork.allocated_unicast_range //14 is decimal in 20
      var proxy = new BigNumber(a.highAddress, 16)
      var new_from = proxy.plus(new BigNumber(1, 16))
      
      var new_to = new_from.plus(new BigNumber(13, 16)) //13 is decimal in 19
      
      var sortValue = new_to.toString(10) //13 is decimal in 19

      this.range_sort_value = existingUserNetwork.range_sort_value + 1;
      
      this.allocated_unicast_range = {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      await this.save()

      return {lowAddress: new_from.toString(16), highAddress: new_to.toString(16)}
      
    }else{
      this.allocated_unicast_range = {lowAddress: "1", highAddress: "14"}
      this.range_sort_value = 0
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