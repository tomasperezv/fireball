/**
 * Object for the 'meteors' service.
 *
 * @see https://docs.google.com/spreadsheet/pub?hl=en_US&key=0AgGDeiZffDrudEFHbHg1Y2ViZ2VjS2ozejNiQnhteHc&hl=en_US&chrome=false&gid=1
 */

var service = require('./base-service'),
	jsdom = require('jsdom'),
	request = require('request');

/**
 * @class {Meteors}
 */

Meteors = function() {

	service.BaseService.call(this);

	this.id = 2;

	this.identifier = 'Meteors';

	this.url = 'https://docs.google.com/spreadsheet/pub?hl=en_US&key=0AgGDeiZffDrudEFHbHg1Y2ViZ2VjS2ozejNiQnhteHc&hl=en_US&chrome=false&gid=1';

	this.interval = 1800;

};

Meteors.prototype = new service.BaseService();

/**
 * @method fetch
 * @param {Object} last
 * @param {Function} onSuccess
 * @param {Function} onError
 */

Meteors.prototype.fetch = function(last, onSuccess, onError) {

	var self = this;

	request({uri: this.url}, function (error, response, body) {

		if (error) {

			// Something went wrong
			if (typeof onError === 'function') {
				onError();
			}

		} else {

			if (typeof onSuccess === 'function') {
				// We only want the last 10KB of data
				body = body.substr(0, 100*1024);
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
		for (var i = 2; i < rows.length; i++) {
			var current = this.getRowObject(rows[i]);
			if (this.getFingerPrint(current) === this.getFingerPrint(last)) {
				position = i;
			}
		}
	}

	return position;

};

/**
 * @param {Object} row
 * @return {String}
 */

Meteors.prototype.getFingerPrint = function(row) {
	return row.date + row.time + row.location;
};

/**
 * @method filter
 * @return {String}
 */

Meteors.prototype.filter = function(value) {
	var pos = value.indexOf('<');
	value = value.substr(0, pos);
	value = value.replace(/(<([^>]+)>)/ig, '');
	value = value.replace(/"/g,'')
	return value;
};

/**
 * @param {HTMLElement} row
 * @return {Object}
 */

Meteors.prototype.getRowObject = function(row) {

	var result = null;

	var columns = row.getElementsByTagName('td');

	if (columns[1].innerHTML !== '') {
		result = {
			date: this.filter(columns[1].innerHTML),
			location: this.filter(columns[3].innerHTML),
			time: this.filter(columns[4].innerHTML),
			duration: this.filter(columns[5].innerHTML),
			start: this.filter(columns[6].innerHTML),
			color: this.filter(columns[7].innerHTML),
			fragments: this.filter(columns[9].innerHTML)
		};
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

	try {

		var window = jsdom.jsdom(body).createWindow();
		rows = window.document.getElementsByTagName('tr');

		// Locate the new elements since the last search
		var limit = this.getLastAddedPosition(rows, last);

		// The first element is the table header.
		for (var i = 2; i < limit; i++) {
			var rowObject = this.getRowObject(rows[i]);
			if (rowObject !== null) {
				data.rows.push(rowObject);
			}
		}

	} catch (e) {
		// Problem parsing elements.
		console.log(e);
	}

	// Store the number of new elements, for fast reference.
	data.newElements = data.rows.length;

	return data;

};

exports.Service = Meteors;
