var file = "wordlist";
var playlist = [0];
var palavras = [0];
var indiceAudio = 1;
var todasPalavras = '';
var caracteresEspeciais = [0];

$(document).ready(function(){
	function getFile(){
		$.get(file,function(wordlist){
			//wordlist = wordlist.replace(/(\r\n\t|\n|\r\t)/gm,"");
			todasPalavras = wordlist;
			removeTagWordlist('nao-listar');
			removeTagWordlist('especiais');
			removeTagWordlist('palavras');
			removeTagWordlist('palavras2');
			var indicePalavras = 0;
			var lines = todasPalavras.split(";");
			for (var i = 0, len = lines.length; i < len; i++){
				palavras[indicePalavras] = lines[i];
				indicePalavras++;
			}
		});
	}
	
	function removeTagWordlist(tag){
		var tagInicio = '<'+tag+'>';
		var tagFim = '</'+tag+'>';
		var indiceInicio = todasPalavras.indexOf(tagInicio);
		var indiceFim = (todasPalavras.indexOf(tagFim))+(tagFim.length);
		var tamanhoTag = indiceFim-indiceInicio;
		
		var conteudo = todasPalavras.substr(indiceInicio, tamanhoTag);
		conteudo = conteudo.replace(tagInicio, '').replace(tagFim, '');
		
		todasPalavras = todasPalavras.replace(tagInicio, '').replace(tagFim, '');
		var lines = conteudo.split(";");
		switch(tag){
			case 'especiais':
				for (var i = 0, len = lines.length; i < len; i++){
					if((i+1)<len){
						espaco = ', ';
					}else{
						espaco = '';
					}
					var novaPalavra = '<p class="'+lines[i]+'">'+lines[i]+espaco+'</p>';
					$('#wordlist').append(novaPalavra);
				}
				break;
			case 'palavras':
			case 'palavras2':
				$('#wordlist').append('<br><br>');
				for (var i = 0, len = lines.length; i < len; i++){
					if((i+1)<len){
						espaco = ', ';
					}else{
						espaco = '';
					}
					var novaPalavra = '<p class="'+lines[i]+'"> '+lines[i]+espaco+'</p>';
					$('#wordlist').append(novaPalavra);
				}
				break;
			case 'nao-listar':
				var indiceCaracteres = 0;
				for (var i = 0, len = lines.length; i < len; i++){
					caracteresEspeciais[indiceCaracteres] = lines[i];
					indiceCaracteres++;
				}
				break;
		}
	}
	
	$(document).on('keydown', '#palavra-pesquisa', function(){buscaPalavra();});
	$(document).on('keyup', '#palavra-pesquisa', function(){buscaPalavra();});
	$(document).on('blur', '#palavra-pesquisa', function(){buscaPalavra();});
	$(document).on('change', '#palavra-pesquisa', function(){buscaPalavra();});
	
	$(document).on('click','#adicionar', function(){
		var palavraPesquisa = $('#palavra-pesquisa').val();
		palavraPesquisa = removerAcentos(palavraPesquisa).replace(/ /g,'-').toLowerCase();
		if(palavras.indexOf(palavraPesquisa)>-1){
			var novoConteudo = $('#frase').val()+' '+palavraPesquisa;
			$('#frase').val(novoConteudo);
			$('#palavra-pesquisa').val('');
		}
	});
	
	function buscaPalavra(){
		var palavra = $('#palavra-pesquisa').val();
		palavra = removerAcentos(palavra).replace(/ /g,'-').toLowerCase();
		if(caracteresEspeciais.indexOf(palavra)==-1){
			if(palavra != ''){
				$('#wordlist p').removeClass('palavra-encontrada');
				$('#wordlist .'+palavra).addClass('palavra-encontrada');
			}else{
				$('#wordlist p').removeClass('palavra-encontrada');
			}
		}else{
			$('#wordlist p').removeClass('palavra-encontrada');
		}
	}
	
	function iniciaLeitor(){
		setInterval(function(){
			realizaLeitura();
		}, 300);
	}
	
	function realizaLeitura(){
		var frase = $('#frase').val();
		frase = removerAcentos(frase);
		frase = frase.replace(/ /g,'-').toLowerCase();
		if(frase != ''){
			var resultado = buscaSubPalavra(frase, frase.length);
			if(resultado){
				tocaAudios();
			}
		}
	}
	
	var map={"â":"a","Â":"A","à":"a","À":"A","á":"a","Á":"A","ã":"a","Ã":"A","ê":"e","Ê":"E","è":"e","È":"E","é":"e","É":"E","î":"i","Î":"I","ì":"i","Ì":"I","í":"i","Í":"I","õ":"o","Õ":"O","ô":"o","Ô":"O","ò":"o","Ò":"O","ó":"o","Ó":"O","ü":"u","Ü":"U","û":"u","Û":"U","ú":"u","Ú":"U","ù":"u","Ù":"U","ç":"c","Ç":"C"};
	function removerAcentos(s){ return s.replace(/[\W\[\] ]/g,function(a){return map[a]||a}) };
	
	function buscaSubPalavra(frase, tamanho){
		if(tamanho == 0){
			return false;
		}else{
			var silaba = frase.substr(0, tamanho);
			if(palavras.indexOf(silaba)>-1){
				var textoTodo = $('#frase').val();
				var restoFrase = textoTodo.substr(tamanho, textoTodo.length);
				$('#frase').val(restoFrase);
				adicionaTabela(silaba);
				return true;
			}else{
				return buscaSubPalavra(frase, (tamanho-1));
			}
		}
	}
	
	function adicionaTabela(silaba){
		silaba = verificaCasosEspeciais(silaba);
		if(silaba=='espaco'){
			display = 'display: none;';
		}else{
			display = 'display: table-row;';
		}
		var audio_html = '<audio id="'+indiceAudio+'" controls class="audio"><source src="palavras/'+silaba+'.mp3" type="audio/mp3"></audio>';
		var linha_tabela = '<tr style="'+display+'"><td><strong class="silaba-tabela">'+silaba+'</strong>'+audio_html+'</td></tr>';
		$('#lista').prepend(linha_tabela);
		if(playlist[0]!=0){
			playlist = playlist.concat(indiceAudio);
		}else{
			playlist[0] = indiceAudio;
		}
		indiceAudio++;
	}
	
	function tocaAudios(){
		if(playlist[0] != 0){
			if(playlist.length>0){
				for(i=0;i<playlist.length;i++){
					var audio = $('#'+playlist[i]);
					audio.get(0).play();
					playlist.splice(i, 1);
				}
			}
		}
	}
	
	function verificaCasosEspeciais(silaba){
		switch(silaba){
			case ',':
			case '.':
			case '-':
				silaba = 'espaco';
				break;
			case 'thais':
				silaba = 'tais';
				break;
		}
		return silaba;
	}
	
	getFile();
	iniciaLeitor();
});