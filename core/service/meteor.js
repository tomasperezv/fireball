/**
 * Object for the 'meteors' service.
 *
 * @see https://docs.google.com/spreadsheet/pub?hl=en_US&key=0AgGDeiZffDrudEFHbHg1Y2ViZ2VjS2ozejNiQnhteHc&hl=en_US&chrome=false&gid=1
 */

var service = require('./base-service');

Meteors = function() {

	service.BaseService.call(this);

	this.identifier = 2;

	this.url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&key=0AgGDeiZffDrudEFHbHg1Y2ViZ2VjS2ozejNiQnhteHc&hl=en_US&chrome=false&gid=1';

	this.interval = 3;

};

Meteors.prototype = new service.BaseService();

/**
 * @method fetch
 * @return {Object}
 */

Meteors.prototype.fetch = function() {
	return {test: 'a', z: 'aaa'};
};

exports.Service = Meteors;
