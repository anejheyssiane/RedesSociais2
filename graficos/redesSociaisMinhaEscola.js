import { criarGrafico, getCSS, incluirTexto } from "./common.js"

async function redesSociaisFavoritasMinhaEscola() {
    const dadosLocaisString = localStorage.getItem('respostaRedesSociais')
    
    if (dadosLocaisString) {
        const dadosLocais = JSON.parse(dadosLocaisString)
        processarDados(dadosLocais)
    } else {

        const url = 'https://script.googleusercontent.com/macros/echo?...'
        
        try {
            const res = await fetch(url)

            if (!res.ok) {
                throw new Error('Erro ao buscar dados.')
            }
            
            const dados = await res.json()

            localStorage.setItem('respostaRedesSociais', JSON.stringify(dados))
            processarDados(dados)

        } catch (error) {

            console.error('Erro ao carregar os dados:', error)
        }
    }
}

function processarDados(dados) {

    const redesSociais = dados.slice(1).map(redes => redes[1])

    const contagemRedesSociais = redesSociais.reduce((acc, rede) => {
        acc[rede] = (acc[rede] || 0) + 1
        return acc
    }, {})

    const valores = Object.values(contagemRedesSociais)
    const labels = Object.keys(contagemRedesSociais)

    const data = [
        {
            values: valores,
            labels: labels,
            type: 'pie',
            textinfo: 'label+percent'
        }
    ]

    const layout = {
        plot_bgcolor: getCSS('--bg-color'), // Cor de fundo do gráfico
        paper_bgcolor: getCSS('--bg-color'), // Cor de fundo da área de visualização
        height: 700, // Altura do gráfico
        title: {
            text: 'Redes sociais que as pessoas da minha escola mais gostam',
            x: 0,
            font: {
                color: getCSS('--primary-color'),
                family: getCSS('--font'),
                size: 30
            }
        },
        legend: {
            font: {
                color: getCSS('--primary-color'),
                size: 16
            }
        }
    }

    // Criação do gráfico
    criarGrafico(data, layout)

    incluirTexto(`Como no mundo, a amostra de pessoas entrevistadas por mim demonstra um apreço pelo <span>Instagram</span> em relação a outras redes.`)
}

// "Chama" a função principal
redesSociaisFavoritasMinhaEscola()
