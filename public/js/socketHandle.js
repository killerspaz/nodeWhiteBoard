var socket = io.connect();

$(function() {
	// when the client clicks SEND
	$('#datasend').click(function() {
		var userName = $('#user').val();
		var userMessage = $('#data').val()
			
		if ('' == userMessage) {
			return;
		}
	
	  	var message = { username: userName, data: userMessage }
	  
	  $('#data').val('');
	  $('#datasend').attr('disabled', '');
	  
	  socket.emit('sendChat', message);
	});
	
	// when the client hits ENTER on their keyboard
	$('#data').keyup(function(e) {
		if (true == checkFields()) {
			return;
		}

		if(e.which == 13) {
			$('#datasend').click();
			$('#data').focus();
		}
	});
	
	$('#user').keyup(function(e) {
		if (true == checkFields()) {
			return;
		}
		
		if(e.which == 13) {
			$('#data').focus();
		}
	});
});

function checkFields() {
	var userName = $('#user').val();
	var userMessage = $('#data').val()

	var invalid = ('' == userName) || ('' == userMessage);
	
	if (true == invalid) {
		$('#datasend').attr('disabled', '');
	} else {
		$('#datasend').removeAttr('disabled');
	}
	
	return invalid;
}

socket.on('updateChat', function(message) {
  showChat(message);
});

