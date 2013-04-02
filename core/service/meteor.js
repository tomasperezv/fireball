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

var Meteors = function() {

	webpage.Service.call(this);

	this.id = 3;

	this.identifier = 'Meteors';

	this.url = 'http://www.amsmeteors.org/members/fireball/browse_reports?report_status=pending';

	this.interval = 900;

};

Meteors.prototype = new webpage.Service();

/**
 * @param {HTMLElement} row
 * @return {Object}
 */

Meteors.prototype.getRowObject = function(row) {

	var result = null;

	var columns = row.getElementsByTagName('td');

	try {
		if (columns[1].innerHTML !== '') {
			result = {
				id: this.filter(columns[2].innerHTML + columns[5].innerHTML),
				reports: 1,
				date: this.filter(columns[2].innerHTML)
			};
		}
	} catch(e) {
	}

	return result;

};

exports.Service = Meteors;
