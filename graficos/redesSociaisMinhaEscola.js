import { criarGrafico, getCSS, incluirTexto } from "./common.js"

async function redesSociaisFavoritasMinhaEscola() {
    const dadosLocaisString = localStorage.getItem('respostaRedesSociais')
    try {
        let dados;
        if (dadosLocaisString) {
            dados = JSON.parse(dadosLocaisString);
        } else {
            const url = 'https://script.googleusercontent.com/macros/echo?user_content_key=rSe23zaQC7gOvWgFJbdtPaqh7ewsO5hQmusYOeqdorTRN8C25vVV3BicsPoS6HS3jnJY9NHhy_pNZj6prQdxDH3305Mro8vNm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnPvESZ9fvnAeFWqfIvIacdoRZcVMZ-nDSydw9_0gseo2TN3y60rOTtwDBCYnKQf6yIqgf8yOzNfccjP633C9VnHmUmPZvRBJY9z9Jw9Md8uu&lib=MCARBaBtNBMHKiEwMeRap3j6V_G7SlGWF';
            const res = await fetch(url);
            dados = await res.json();
            localStorage.setItem('respostaRedesSociais', JSON.stringify(dados));
        }
        processarDados(dados);
    } catch (error) {
        console.error("Erro ao buscar ou processar os dados:", error);
        // Pode adicionar uma lógica para mostrar uma mensagem de erro para o usuário.
    }
}

function processarDados(dados) {
    const redesSociais = dados.slice(1).map(redes => redes[1]);
    const contagemRedesSociais = redesSociais.reduce((acc, rede) => {
        acc[rede] = (acc[rede] || 0) + 1;
        return acc;
    }, {});
    const valores = Object.values(contagemRedesSociais);
    const labels = Object.keys(contagemRedesSociais);

    const data = [
        {
            values: valores,
            labels: labels,
            type: 'pie',
            textinfo: 'label+percent'
        }
    ];

    const layout = {
        plot_bgcolor: getCSS('--bg-color') || '#ffffff',  // Valor de fallback
        paper_bgcolor: getCSS('--bg-color') || '#ffffff',  // Valor de fallback
        height: 700,
        title: {
            text: 'Redes sociais que as pessoas da minha escola mais gostam',
            x: 0,
            font: {
                color: getCSS('--primary-color') || '#000000',  // Valor de fallback
                family: getCSS('--font') || 'Arial',  // Valor de fallback
                size: 30
            }
        },
        legend: {
            font: {
                color: getCSS('--primary-color') || '#000000',  // Valor de fallback
                size: 16
            }
        }
    };

    criarGrafico(data, layout);
    incluirTexto(`Como no mundo, a amostra de pessoas entrevistadas por mim, demonstra um apreço pelo <span>Instagram</span> em relação a outras redes.`);
}

redesSociaisFavoritasMinhaEscola();
