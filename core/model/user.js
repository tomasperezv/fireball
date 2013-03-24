/**
 * Object model for the table users
 *
 * create table users(
 * 	id int not null,
 *	login string,
 *	password string,
 * 	permissions int
 * );
 */

var DataBaseModel = require('../node-postgre-orm/model/database-model');

User = function() {

	DataBaseModel.DataBaseModel.call(this);
	this.table = 'users';

}

User.prototype = new DataBaseModel.DataBaseModel(); 

exports.User = User;
