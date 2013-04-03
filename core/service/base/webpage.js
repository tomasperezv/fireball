/**
 * Parent object for scrapping web pages.
 */

var service = require('./base-service'),
	jsdom = require('jsdom'),
	request = require('request');

/**
 * @class {Webpage}
 */

var Webpage = function() {

	service.BaseService.call(this);

	this.identifier = 'Webpage';

	this.url = '';

	this.interval = 900;

};

Webpage.prototype = new service.BaseService();

/**
 * @method fetch
 * @param {Object} last
 * @param {Function} onSuccess
 */

Webpage.prototype.fetch = function(last, onSuccess) {

  var self = this;

  request({uri: this.url}, function (error, response, body) {

		if (error) {
			throw new Error('Error fetching data from ' + self.url);
		} else {

			if (typeof onSuccess === 'function') {
				var data = self.processData(body, last);
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

Webpage.prototype.getLastAddedPosition = function(rows, last) {

	var position = rows.length;

	if (last !== null) {
		for (var i = 1; i < rows.length; i++) {
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

Webpage.prototype.filter = function(value) {
	value = value.replace(/(<([^>]+)>)/ig, '');
	value = value.replace(/"/g,'');
  value = value.replace(/[^\w]/gi, '');
	return value;
};

/**
 * @param {HTMLElement} row
 * @return {Object}
 */

Webpage.prototype.getRowObject = function(row) {
	// Implement in child objects
};

/**
 * @param {String} body
 * @return {Object} data
 */

Webpage.prototype.processData = function(body, last) {

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

exports.Service = Webpage;
