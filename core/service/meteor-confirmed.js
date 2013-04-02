/**
 * Object for the 'meteors' service.
 *
 * @see http://www.amsmeteors.org/fireball_event/2013/&page=1
 */

var webpage = require('./base/webpage'),
	jsdom = require('jsdom'),
	request = require('request');

/**
 * @class {Meteors}
 */

var MeteorsConfirmed = function() {

	webpage.Service.call(this);

	this.id = 4;

	this.identifier = 'Meteors confirmed';

	this.url = 'http://www.amsmeteors.org/fireball_event/2013/&page=1';

	this.interval = 1800;

};

MeteorsConfirmed.prototype = new webpage.Service();

/**
 * @param {HTMLElement} row
 * @return {Object}
 */

MeteorsConfirmed.prototype.getRowObject = function(row) {

	var result = null;

	var columns = row.getElementsByTagName('td');

	try {
		if (columns[1].innerHTML !== '') {
			result = {
				id: this.filter(columns[0].innerHTML),
				reports: this.filter(columns[1].innerHTML),
				date: this.filter(columns[2].innerHTML)
			};
		}
	} catch(e) {
	}

	return result;

};

exports.Service = MeteorsConfirmed;
