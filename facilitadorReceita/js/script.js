$(document).ready(function(){
	//#0000B8

	$('#buscar').on('click', function(){
		busca();
	});

	$('#voltar').on('click', function(){
		$('#passo-1').show();
		$('#passo-2').hide();
	});
	
	$('#prosseguir').on('click', function(){
		if($('#input_responsavel_footer').val()!=''){
			$('#responsavel_footer').text('Responsável legal: '+$('#input_responsavel_footer').val());
		}else{
			$('#responsavel_footer').text('Responsável legal: _____________________');
		}
		if($('#input_cpf_footer').val()!=''){
			$('#cpf_footer').text('CPF: '+$('#input_cpf_footer').val());
		}else{
			$('#cpf_footer').text('CPF: _____________________');
		}
		$('#atividade_selecionada_impressao').text($('#atividade_selecionada option:selected').text());
		
		if($('#atividade_selecionada').val()==-1){
			alert("É obrigatório selecionar uma atividade principal!");
			return false;
		}

		if($('#input_cpf_footer').val()=='' || $('#input_responsavel_footer').val()==''){
			var confirma = false;
			if($('#input_cpf_footer').val()=='' && $('#input_responsavel_footer').val()==''){
				confirma = confirm("Atenção! O responsável legal e o CPF não foram preenchidos, estas informações estarão aguardando preenchimento manual no documento. Deseja continuar?");
			}else if($('#input_cpf_footer').val()==''){
				confirma = confirm("Atenção! O CPF não foi preenchido, esta informação estará aguardando preenchimento manual no documento. Deseja continuar?");
			}else{
				confirma = confirm("Atenção! O responsável legal não foi preenchido, esta informação estará aguardando preenchimento manual no documento. Deseja continuar?");
			}
			if(confirma){
				print();
			} else {
				return false;
			}
		}else{
			print();
		}
		function print(){
			window.print();
		}
	});

	$(document).on('change', '#atividade_selecionada', function(){
		$('#atividade_selecionada').removeClass('input-errado');
		if($('#atividade_selecionada').val()==-1){
			$('.atividade-inelegivel').css('display', 'inline-block');
			$('#prosseguir').hide();
			return;
		}
		if( atividadeValida($('#atividade_selecionada option:selected').attr('data-codigo').replace(/-/g, '').replace('.', '')) ){
			$('.atividade-inelegivel').hide();
			$('#prosseguir').show();
		}else{
			$('#atividade_selecionada').addClass('input-errado');
			$('.atividade-inelegivel').css('display', 'inline-block');
			$('#prosseguir').hide();
		}
	});
	
	$('#cnpj_entrada').on('blur', function(){
		formataCNPJ();
	});
	$('#cnpj_entrada').on('change', function(){
		formataCNPJ();
	});
	
	function formataCNPJ(){
		var entrada = $('#cnpj_entrada').val();
		entrada = entrada.replace(/\D/g,'');
		$('#cnpj_entrada').val(entrada);
	}
	
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
				console.log("Resultado da busca na Receita Federal", json);
				
				var html = html_inf = '';
				
				//############################ VERIFICA SITUAÇÃO DA EMPRESA
				if(json.situacao!="ATIVA"){
					alert("O CNPJ informado encontra-se com situação baixada/inapta. Favor entrar em contato com o órgão responsável para regularização");
				}
				
				//############################ MONTA SELECT ATIVIDADES
				var array_atividades = [
					{
						text: json.atividade_principal[0].text,
						code: json.atividade_principal[0].code
					}
				];
				if(json.atividades_secundarias[0].code!='00.00-0-00'){
					for(var i=0; i < json.atividades_secundarias.length; i++){
						var atividade = {
							text: json.atividades_secundarias[i].text,
							code: json.atividades_secundarias[i].code
						};
						array_atividades.push(atividade);
					}
				}
				html += '<select class="form-control" id="atividade_selecionada">';
				html += '<option value="-1">&lt;selecionar atividade principal&gt;</option>';
				for(var i=0; i<array_atividades.length;i++){
					html += '<option value="'+i+'" data-codigo="'+array_atividades[i].code+'">'+array_atividades[i].code+' - '+array_atividades[i].text+'</option>';
				}
				html += '</select>';
				$('#lista-atividades').html(html);
				$('.atividade-inelegivel').hide();
				
				//############################ BLOQUEIA DECLARAÇÃO POR NÃO POSSUIR DUPLA CATEGORIA
				if(possuiDuplaCategoria(array_atividades)){
					$('.cnpj-inelegivel').hide();
				}else{
					$('.atividade-inelegivel').css('display', 'inline-block');
				}
				
				//############################ LISTA ATIVIDADES
				for(var i=0; i < array_atividades.length; i++){
					if(i==0){
						var borda = '';
					}else{
						var borda = 'class="border-top-tabela"';
					}
					html_inf += '<tr>';
					html_inf += '	<td align="center" '+borda+'>'+(i+1)+'</td>';
					html_inf += '	<td align="center" '+borda+'>'+array_atividades[i].code+'</td>';
					html_inf += '	<td '+borda+'>'+array_atividades[i].text+'</td>';
					html_inf += '</tr>';
				}

				$('#lista-atividades-inf').html(html_inf);
				
				//############################ LIMPA INFORMAÇÕES
				$('.texto_resultado').text('');
				
				//############################ INSERE NOVAS INFORMAÇÕES
				var keys = Object.keys(json);
				for(var i=0; i<keys.length; i++){
					$('#'+keys[i]).text(json[keys[i]]);
				}
				
				//############################ MONTA IMPRESSÃO
				var html_imp = '<li>CNAE '+json.atividade_principal[0].code+' - '+json.atividade_principal[0].text+'</li>';
				if(json.atividades_secundarias[0].code!='00.00-0-00'){
					for(var i=1; i<=json.atividades_secundarias.length; i++){
						html_imp += '	<li>CNAE '+json.atividades_secundarias[i-1].code+' - '+json.atividades_secundarias[i-1].text+'</li>';
					}
				}
				$('#lista_atividades_impressao').html(html_imp);
				$('#email_impressao').html("E-mail: "+json.email);
				$('#data_impressao').html(json.municipio+", "+getData());
				
				var identificacao = '<b>"'+json.nome+'"</b>, inscrito no CNPJ nº '+json.cnpj+", estabelecido à Rua "+json.logradouro+", CEP: "+json.cep+", "+json.municipio+"/"+json.uf+", portador dos CNAES abaixo listados:"
				$('#identificacao').html(identificacao);
				
				$('#passo-1').hide();
				$('#passo-2').show();
			}, error: function(){
				alert('Ocorreu um erro, tente novamente!');
			}
		})
	}
	
	function getData(){
		var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		return ((day<10?'0':'')+day + '/' + (month<10?'0':'')+month + '/' + d.getFullYear())
	}

	function possuiDuplaCategoria(array_atividades){
		var concreteira = revenda = industria = false;

		for(var i=0; i<array_atividades.length; i++){
			var atividade = array_atividades[i].code.replace(/-/g, '').replace('.', '');
			if(jQuery.inArray(parseInt(atividade,), array_concreteira)>-1){
				concreteira = true;
			}
			if(jQuery.inArray(parseInt(atividade,), array_revenda)>-1){
				revenda = true;
			}
			if(jQuery.inArray(parseInt(atividade,), array_industria)>-1){
				industria = true;
			}
		}

		if( (concreteira && revenda) || (concreteira && industria) || (revenda && industria) ){
			return true;
		}else{
			return false;
		}
	}
	window.possuiDuplaCategoria = possuiDuplaCategoria;

	function atividadeValida(atividade){
		var concreteira = industria = false;

		if(jQuery.inArray(parseInt(atividade,), array_concreteira)>-1){
			concreteira = true;
		}
		if(jQuery.inArray(parseInt(atividade,), array_industria)>-1){
			industria = true;
		}

		if(concreteira || industria){
			return true;
		}else{
			return false;
		}
	}

	var array_revenda = [
		4671100,
		4672900,
		4673700,
		4674500,
		4679601,
		4679602,
		4679603,
		4679604,
		4679699,
		4689399,
		4691500,
		4693100,
		4711301,
		4711302,
		4712100,
		4741500,
		4742300,
		4743100,
		4744001,
		4744002,
		4744003,
		4744004,
		4744005,
		4744099,
		4789099
	];
	
	var array_industria = [
		2073800,
		2320600,
		2330301,
		2330302,
		2330303,
		2330399,
		2342701,
		2392300
	];
	
	var array_concreteira = [
		2230305,
		4110700,
		4120400,
		4211101,
		4211102,
		4212000,
		4213800,
		4221901,
		4221902,
		4221903,
		4221904,
		4221905,
		4222701,
		4222702,
		4223500,
		4291000,
		4292801,
		4292802,
		4299501,
		4299599,
		4311801,
		4311802,
		4312600,
		4313400,
		4319300,
		4321500,
		4322301,
		4322302,
		4322303,
		4329101,
		4329102,
		4329103,
		4329104,
		4329105,
		4329199,
		4330401,
		4330402,
		4330403,
		4330404,
		4330405,
		4330499,
		4391600,
		4399101,
		4399102,
		4399103,
		4399104,
		4399105,
		4399199
	];
});
