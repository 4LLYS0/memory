// Variáveis globais
let nivel;
let gameBoard = document.getElementById('gameBoard');
let contadorErros = 0;
let totalErros = document.getElementById('contadorErros');
let timer = document.getElementById('temporizador');
let cartas = [];
let paresEncontrados = [];
let paresSelecionados = [];
let tempoTotal;
let intervalo;
let emojis = [
    '🧛‍♂️', '🦇', '🩸', '🖤', '⚰️', '🕯️', '🕸️', '🧟‍♂️', '🧟‍♀️', 
    '🧙‍♂️', '🧙‍♀️', '🪦', '🕷️', '🧫', '🕱', '🔮', '💀', '👻', '🦷', 
    '🌕', '🌑', '🩹', '🔪', '🍷', '🧿', '📜', '🔗', '🧥', '🧤', 
    '🌹', '🕯️', '🩸', '⚰️', '🦇',
];

// Modo dupla
let modoDupla = false;
let jogadores = [
    { nome: 'Jogador 1', pontuacao: 0 },
    { nome: 'Jogador 2', pontuacao: 0 }
];
let jogadorAtual = 0; // Controla o turno do jogador (0 ou 1)

// Função para iniciar o jogo solo
function iniciarJogo() {
    nivel = document.getElementById('nivel').value; // Pegando o nível aqui
    modoDupla = false; // Reiniciar o modo de jogo
    resetarJogo();
    gerarCartas();
    iniciarTemporizador();
}

// Função para iniciar o jogo em dupla
function iniciarJogoDupla() {
    nivel = document.getElementById('nivel').value; // Pegando o nível aqui também
    modoDupla = true;
    jogadorAtual = 0; // Iniciar com o jogador 1
    resetarJogo();
    gerarCartas();
    iniciarTemporizador();
}

// Função para gerar as cartas baseado no nível
function gerarCartas() {
    let numCartas;
    if (nivel === 'facil') numCartas = 12;
    if (nivel === 'medio') numCartas = 16;
    if (nivel === 'dificil') numCartas = 24; // Ajuste o número de cartas para o nível difícil

    let cartasEscolhidas = emojis.slice(0, numCartas / 2);
    cartas = cartasEscolhidas.concat(cartasEscolhidas);
    cartas.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = '';

    cartas.forEach(emoji => {
        let carta = document.createElement('div');
        carta.classList.add('carta');
        carta.dataset.valor = emoji;
        carta.innerHTML = '❓'; // Estado inicial
        carta.onclick = virarCarta;
        gameBoard.appendChild(carta);
    });
}

// Função para virar as cartas e verificar se há par
function virarCarta(evento) {
    let carta = evento.target;
    let valorCarta = carta.dataset.valor;

    if (paresSelecionados.length < 2 && !carta.classList.contains('virada')) {
        carta.innerHTML = valorCarta;
        carta.classList.add('virada');
        paresSelecionados.push(carta);

        if (paresSelecionados.length === 2) {
            verificarPares();
        }
    }
}

// Função para verificar se as cartas viradas formam um par
function verificarPares() {
    let [carta1, carta2] = paresSelecionados;

    if (carta1.dataset.valor === carta2.dataset.valor) {
        paresEncontrados.push(carta1, carta2);
        paresSelecionados = [];
        if (modoDupla) {
            jogadores[jogadorAtual].pontuacao++; // Incrementar a pontuação do jogador atual
            atualizarPlacar();
        }
        verificarFimDeJogo(); // Verifique se o jogo acabou aqui
    } else {
        setTimeout(() => {
            carta1.innerHTML = '❓';
            carta2.innerHTML = '❓';
            carta1.classList.remove('virada');
            carta2.classList.remove('virada');
            paresSelecionados = [];
            incrementarErros();

            if (modoDupla) {
                alternarJogador(); // Alternar a vez do jogador
            }
        }, 1000);
    }
}

// Função para exibir a mensagem de parabéns
function exibirParabens() {
    let mensagemParabens = document.getElementById('mensagemParabens');
    let fundoDesfocado = document.getElementById('fundoDesfocado');
    
    let texto = modoDupla ? 
                `Fim de Jogo! O vencedor é ${jogadores[0].pontuacao > jogadores[1].pontuacao ? jogadores[0].nome : jogadores[1].nome} com ${Math.max(jogadores[0].pontuacao, jogadores[1].pontuacao)} pontos!` :
                `Fim de Jogo! Você acertou todas as cartas com ${contadorErros} erros!`;
    
    mensagemParabens.textContent = texto;
    mensagemParabens.classList.add('visivel'); // Exibir a mensagem

    // Mostrar fundo desfocado
    fundoDesfocado.classList.add('visivel');

    setTimeout(() => {
        mensagemParabens.classList.remove('visivel'); // Ocultar a mensagem após 5 segundos
        // Remover fundo desfocado
        fundoDesfocado.classList.remove('visivel');
    }, 3000);
}

// Função para incrementar o contador de erros
function incrementarErros() {
    contadorErros++;
    totalErros.textContent = `Erros: ${contadorErros}`;
}

// Função para verificar se o jogo acabou
function verificarFimDeJogo() {
    if (paresEncontrados.length === cartas.length) {
        clearInterval(intervalo);
        exibirParabens(); // Chamar para exibir a mensagem de parabéns
        atualizarHistorico();
    }
}

// Função para atualizar o placar dos jogadores
function atualizarPlacar() {
    document.getElementById('pontuacaoJogador1').textContent = jogadores[0].pontuacao;
    document.getElementById('pontuacaoJogador2').textContent = jogadores[1].pontuacao;
}

// Função para alternar entre os jogadores
function alternarJogador() {
    jogadorAtual = (jogadorAtual + 1) % 2;
}

// Função para reiniciar o jogo
function resetarJogo() {
    contadorErros = 0;
    totalErros.textContent = `Erros: ${contadorErros}`;
    tempoTotal = 0;
    clearInterval(intervalo);
    timer.textContent = 'Tempo: 00:00';
    paresEncontrados = [];
    paresSelecionados = [];
    gameBoard.innerHTML = '';
}

// Função para iniciar o temporizador
function iniciarTemporizador() {
    intervalo = setInterval(() => {
        tempoTotal++;
        let minutos = Math.floor(tempoTotal / 60);
        let segundos = tempoTotal % 60;
        timer.textContent = `Tempo: ${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, 1000);
}

// Função para atualizar o histórico de jogos
function atualizarHistorico() {
    let corpoHistorico = document.getElementById('historicoCorpo');
    let novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
        <td>${new Date().toLocaleString()}</td>
        <td>${timer.textContent.split(': ')[1]}</td>
        <td>${nivel}</td>
        <td>${contadorErros}</td>
    `;
    corpoHistorico.appendChild(novaLinha);
}

// Eventos dos botões
document.getElementById('soloBtn').onclick = iniciarJogo;
document.getElementById('duoBtn').onclick = iniciarJogoDupla;
