/**
 * Object model for the table service
 *
 * create table service(
 *	id serial PRIMARY KEY,
 *	time timestamp,
 *	data text,
 *	service_id integer
 * );
 *
 */

var DataBaseModel = require('../node-postgre-orm/model/database-model');

Service = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'service';

}

Service.prototype = new DataBaseModel.DataBaseModel(); 

exports.Service = Service;
