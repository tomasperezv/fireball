/**
 * @author tom@0x101.com
 *
 * Every service that we want to monitorize must extend this object.
 */

/**
 * @class BaseService
 */

BaseService = function() {

	/**
	 * Defines the time frequency to execute the service, and
	 * retrieve the data.
	 *
	 * - Currently supported strings: 'daily'
	 * - If it's an integer, expects seconds.
	 * - Set it to 0 to disable the service.
	 *
	 * @type {String|Integer} interval
	 */

	this.interval = 0;

	/**
	 * Used to identify the service in the storage.
	 *
	 * @type {Integer} id
	 */

	this.id = 1;

	/**
	 * The name of the service.
	 *
	 * @type {String} identifier
	 */

	this.identifier = 'Base service';

	/**
	 * Used by the service manager to determine when we need to
	 * run the service.
	 *
	 * @type {Integer} lastExecutionTime
	 */

	this.lastExecutionTime = 0;

};

/**
 * This method will be implemented in the child classes, the
 * data returned will be stored in the database as JSON.
 *
 * @method fetch
 * @param {Object} last The previous value we added.
 * @param {Function} onSuccess => Will pass an object, that will be stringified, and stored in the db.
 * @param {Function} onError
 */

BaseService.prototype.fetch = function(last, onSuccess, onError) {
};

exports.BaseService = BaseService;
