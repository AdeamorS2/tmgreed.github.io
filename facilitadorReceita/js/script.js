$(document).ready(function(){
	$('#buscar').on('click', function(){
		var baseURL = 'https://www.receitaws.com.br/v1/cnpj/';
		var cnpj = $('#cnpj').val();
		if(cnpj!='' && cnpj.length>=14){
			
			
			$.getJSON( baseURL+cnpj, function(data) {
				console.log( "success" );
			}).done(function() {
				console.log( "second success" );
			})
			.fail(function() {
				console.log( "error" );
			})
			.always(function() {
				console.log( "complete" );
			});
		}
	});
	
});