/**
 * Handles the schedule of services, run their fetch method and store
 * the information in the DB.
 *
 * @author Tomas Perez <tom@0x101.com>
 */

var fs = require('fs'),
	config = require('./node-config/config'),
	storage = require('./model/service');

/**
 * @class Service
 */

Service = function() {

	/**
	 * Interval delay in ms.
	 * @type {Integer} intervalDelay
	 */

	this.intervalDelay = 1000;

	/**
	 * Stores the instances of the services.
	 *
	 * @type {Array} services
	 */

	this.services = [];

	/**
	 * @type {Object} config
	 */

	this.config = {
		servicesFolder: './core/service/'
	};

	// Load all the services
	this.preload();

};

/**
 * @method preload
 */

Service.prototype.preload = function() {

	try {
		services = fs.readdirSync(this.config.servicesFolder)
	} catch(e) {
		// Error loading files from the folder.
	}

	var nServices = services.length;
	for (var i = 0; i < nServices; i++) {

		var definition = require('./service/' + services[i]);
		if (typeof definition.Service === 'function') {
			this.services.push(new definition.Service());
		}

	}

};

/**
 * @method onInterval
 */

Service.prototype.onInterval = function() {

	var storageService = new storage.Service();
	var numServices = this.services.length;

	for (var i = 0; i < numServices; i++) {

		var service = this.services[i];

		var timestamp = this.getCurrentTimestamp();
		var delta = (timestamp - service.lastExecutionTime);

		if (delta >= service.interval) {

			console.log('Retrieving ' + service.identifier);

			service.lastExecutionTime = timestamp;

			storageService.load({}, function(result) {

				var lastValue = result.data.length > 0 ? result.data[0].data : null;
				if (lastValue !== null) {
					lastValue = JSON.parse(lastValue);
					rows = lastValue.rows;
					lastValue = rows.length > 0 ? rows[0] : null;
				}

				// Retrieve and store the data
				var data = service.fetch(lastValue, function(result, store) {
					if (store) {

						console.log('New elements found');

						storageService.create({
							data: JSON.stringify(result),
							service_id: service.id,
							time: timestamp
						});

					}
				});

			}, 1, {column: 'time', type: 'DESC'});


		}

	}

};

/**
 * @method getCurrentTimestamp
 * @return {Integer}
 */

Service.prototype.getCurrentTimestamp = function() {
	return Math.round((new Date()).getTime() / 1000);
};

/**
 * @method run
 */

Service.prototype.run = function() {

	var self = this;
	setInterval(function() {
		self.onInterval()
	}, this.intervalDelay)

};

exports.Service = Service;
