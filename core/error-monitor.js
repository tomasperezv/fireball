/**
 * In charge of monitoring services and application exceptions.
 *
 * @author Tomas Perez <tom@0x101.com>
 */

var storage = require('./model/service-error');

process.on('uncaughtException', function (exception) {

	var errorStorage = new storage.ServiceError();

	console.log('Storing exception: ' + exception.message);

	errorStorage.create({
		content: exception.stack,
		timestamp: Math.round((new Date()).getTime() / 1000)
	});

});
