/**
 * Object for the 'meteors' service.
 *
 * @see http://www.amsmeteors.org/fireball_event/2013/&page=1
 */

var service = require('./base-service'),
	jsdom = require('jsdom'),
	request = require('request');

/**
 * @class {Meteors}
 */

var Meteors = function() {

	service.BaseService.call(this);

	this.id = 3;

	this.identifier = 'Meteors';

	this.url = 'http://www.amsmeteors.org/fireball_event/2013/&page=1';

	this.interval = 900;

};

Meteors.prototype = new service.BaseService();

/**
 * @method fetch
 * @param {Object} last
 * @param {Function} onSuccess
 */

Meteors.prototype.fetch = function(last, onSuccess) {

  var self = this;

  request({uri: this.url}, function (error, response, body) {

		if (error) {
			throw new Error('Error fetching data from ' + self.url);
		} else {

			if (typeof onSuccess === 'function') {
				// We only want the last 10KB of data
				var data = self.processData(body, last);

				if(data.newElements > 0) {
					console.log('Found new elements: ' + data.newElements);
				}

				onSuccess(data, data.newElements > 0 ? true : false);
			}

		}

	});

};

/**
 * @param {HTMLCollection} rows
 * @param {Object} last
 * @return {Integer}
 */

Meteors.prototype.getLastAddedPosition = function(rows, last) {

	var position = rows.length;

	if (last !== null) {
		for (var i = 0; i < rows.length; i++) {
			var current = this.getRowObject(rows[i]);
			if (current !== null) {
				if (current.id === last.id) {
					position = i;
				}
			}
		}
	}

	return position;

};

/**
 * @method filter
 * @return {String}
 */

Meteors.prototype.filter = function(value) {
	value = value.replace(/(<([^>]+)>)/ig, '');
	value = value.replace(/"/g,'');
  value = value.replace(/[^\w]/gi, '');
	return value;
};

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
				id: this.filter(columns[0].innerHTML),
				reports: this.filter(columns[1].innerHTML),
				date: this.filter(columns[2].innerHTML)
			};
		}
	} catch(e) {
	}

	return result;

};

/**
 * @param {String} body
 * @return {Object} data
 */

Meteors.prototype.processData = function(body, last) {

	var rows = [];

	var data = {
		size: body.length,
		rows: []
	};

	var window = jsdom.jsdom(body).createWindow();
	rows = window.document.getElementsByTagName('tr');

	// Locate the new elements since the last search
	var limit = this.getLastAddedPosition(rows, last);

	for (var i = 1; i < limit; i++) {
		var rowObject = this.getRowObject(rows[i]);
		if (rowObject !== null) {
			data.rows.push(rowObject);
		}
	}

	// Store the number of new elements, for fast reference.
	data.newElements = data.rows.length;

	return data;

};

exports.Service = Meteors;
