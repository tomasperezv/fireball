/**
 * Object model for the error table.
 *
 * create table error(
 *	id serial PRIMARY KEY,
 *	service_id int,
 *	timestamp int,
 *	content text
 * );
 *
 */

var DataBaseModel = require('../node-postgre-orm/model/database-model');

var ServiceError = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'error';

};

ServiceError.prototype = new DataBaseModel.DataBaseModel(); 

exports.ServiceError = ServiceError;
