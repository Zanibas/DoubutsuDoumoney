const { prefix } = require('./config.json');

function _addPrefix(msg) {
	return `${prefix}${msg}`;
}

function _codeStyle(msg) {
	return '```' + msg + '```';
}

module.exports = { _addPrefix, _codeStyle };
