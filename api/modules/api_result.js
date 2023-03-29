const data = {
	success: null,
	data: null,
	msg: null
};

var api_result = function(success, input_data, msg) {

	data.success = success;
	data.data = input_data;
	data.msg = msg;
	return data;
	
}

module.exports = api_result;