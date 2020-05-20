function _addPrefix(msg) {
	return `${process.env.PREFIX}${msg}`;
}

function _codeStyle(msg) {
	return '```' + msg + '```';
}

module.exports = { _addPrefix, _codeStyle };
