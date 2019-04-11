$(document).ready(function(){
	$('#buscar').on('click', function(){
		busca();
	});
	
	$('#prosseguir').on('click', function(){
		alert('puff! *Imprimindo*');
	});
	
	$('#cnpj_entrada').on('blur', function(){
		var entrada = $(this).val();
		entrada = entrada.replace(/\D/g,'');
		$(this).val(entrada);
	});
	
	function busca(){
		var baseURL = 'https://www.receitaws.com.br/v1/cnpj/';
		var cnpj = $('#cnpj_entrada').val();
		$.ajax({
			type: "GET",
			dataType: 'jsonp',
			url: baseURL+cnpj,
			crossDomain : true,
			xhrFields: {
				withCredentials: true
			}, success : function(json){
				var html = html_inf = '';
				
				html += '<select class="form-control">';
				html += '<option value="0">'+json.atividade_principal[0].text+'</option>';
				if(json.atividades_secundarias[0].code!='00.00-0-00'){
					for(var i=1; i<=json.atividades_secundarias.length; i++){
						html += '<option value="'+i+'">'+json.atividades_secundarias[i-1].text+'</option>';
					}
				}
				html += '</select>';
				$('#lista-atividades').html(html);
				
				html_inf += '<tr>';
				html_inf += '	<td align="center">1</td>';
				html_inf += '	<td>'+json.atividade_principal[0].text+'</td>';
				html_inf += '	<td align="center">'+json.atividade_principal[0].code+'</td>';
				html_inf += '</tr>';
				if(json.atividades_secundarias[0].code!='00.00-0-00'){
					for(var i=1; i<=json.atividades_secundarias.length; i++){
						html_inf += '<tr>';
						html_inf += '	<td class="border-top-tabela" align="center">'+(i+1)+'</td>';
						html_inf += '	<td class="border-top-tabela">'+json.atividades_secundarias[i-1].text+'</td>';
						html_inf += '	<td class="border-top-tabela" align="center">'+json.atividades_secundarias[i-1].code+'</td>';
						html_inf += '</tr>';
					}
				}
				$('#lista-atividades-inf').html(html_inf);
				
				limpaDadosEmpresa();
				$('#nome').text(json.nome);
				$('#situacao').text(json.situacao);
				$('#fantasia').text(json.fantasia);
				$('#data_situacao').text(json.data_situacao);
				$('#cnpj').text(json.cnpj);
				$('#ultima_atualizacao').text(json.ultima_atualizacao);
				$('#porte').text(json.porte);
				$('#abertura').text(json.abertura);
				$('#natureza_juridica').text(json.natureza_juridica);
				$('#status').text(json.status);
				$('#tipo').text(json.tipo);
				$('#efr').text(json.efr);
				$('#logradouro').text(json.logradouro);
				$('#numero').text(json.numero);
				$('#complemento').text(json.complemento);
				$('#bairro').text(json.bairro);
				$('#municipio').text(json.municipio);
				$('#uf').text(json.uf);
				$('#cep').text(json.cep);
				$('#telefone').text(json.telefone);
				$('#email').text(json.email);
				$('#situacao_especial').text(json.situacao_especial);
				$('#motivo_situacao').text(json.motivo_situacao);
				$('#data_situacao_especial').text(json.data_situacao_especial);
				$('#capital_social').text(json.capital_social);
				
				$('#passo-1').hide();
				$('#passo-2').show();
				console.log(json);
			}, error: function(){
				alert('Ocorreu um erro, tente novamente!');
			}
		})
	}
	
	$('#voltar').on('click', function(){
		$('#passo-1').show();
		$('#passo-2').hide();
	});
	
	function limpaDadosEmpresa(){
		$('#nome').text('');
		$('#situacao').text('');
		$('#fantasia').text('');
		$('#data_situacao').text('');
		$('#cnpj').text('');
		$('#ultima_atualizacao').text('');
		$('#porte').text('');
		$('#abertura').text('');
		$('#natureza_juridica').text('');
		$('#status').text('');
		$('#tipo').text('');
		$('#efr').text('');
		$('#logradouro').text('');
		$('#numero').text('');
		$('#complemento').text('');
		$('#bairro').text('');
		$('#municipio').text('');
		$('#uf').text('');
		$('#cep').text('');
		$('#telefone').text('');
		$('#email').text('');
		$('#situacao_especial').text('');
		$('#motivo_situacao').text('');
		$('#data_situacao_especial').text('');
		$('#capital_social').text('');
	}
	/*
	function teste1(){
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
	}
	
	function teste2(){
		makeCorsRequest();
		
		// Create the XHR object.
		function createCORSRequest(method, url) {
			var xhr = new XMLHttpRequest();
			if ("withCredentials" in xhr) {
				// XHR for Chrome/Firefox/Opera/Safari.
				xhr.open(method, url, true);
			} else if (typeof XDomainRequest != "undefined") {
				// XDomainRequest for IE.
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				// CORS not supported.
				xhr = null;
			}
			return xhr;
		}

		// Helper method to parse the title tag from the response.
		function getTitle(text) {
			return text.match('<title>(.*)?</title>')[1];
		}

		// Make the actual CORS request.
		function makeCorsRequest() {
			// This is a sample server that supports CORS.
			//var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';
			var url = 'https://www.receitaws.com.br/v1/cnpj/00000000000191';

			var xhr = createCORSRequest('GET', url);
			if (!xhr) {
				alert('CORS not supported');
				return;
			}

			// Response handlers.
			xhr.onload = function() {
				var text = xhr.responseText;
				var title = getTitle(text);
				alert('Response from CORS request to ' + url + ': ' + title);
			};

			xhr.onerror = function() {
				alert('Woops, there was an error making the request.');
			};

		  xhr.send();
		}
	}*/
});