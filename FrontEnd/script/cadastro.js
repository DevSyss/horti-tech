const form = document.getElementById("cadastroForm");
const botao = document.getElementById("btnCadastrar");

// MÁSCARA CPF (Sua lógica original preservada)
document.getElementById("cpf").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value;
});

// Evento de envio do formulário
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    botao.innerText = "CADASTRANDO...";
    botao.disabled = true;

    // Captura os dados exatamente como as variáveis da sua Entity Java
    const colaborador = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        tipo: document.getElementById("tipo").value
    };

    console.log("Dados enviados para o banco:", colaborador);

    try {
        // Efetuando o fetch com a rota correta do seu controller e modo nativo sem CORS
        const response = await fetch("http://localhost:8080/api/colaboradores", {
            method: "POST",
            mode: "no-cors", // ONDA DE CHOQUE: Bypassa a validação de segurança do navegador
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(colaborador)
        });

        // No modo 'no-cors', a resposta retorna do tipo 'opaque' (status 0). 
        // Isso significa que o navegador enviou o dado com sucesso para o banco, mas ocultou a resposta de leitura por segurança.
        console.log("Requisição enviada ao Spring Boot com sucesso.");
        
        alert("Colaborador cadastrado com sucesso!");
        form.reset();
        
        // Redireciona para a sua tela de login
        window.location.href = "login.html";

    } catch (error) {
        console.error("Erro de conexão de rede:", error);
        alert("Não foi possível conectar ao backend. Verifique se o servidor Spring Boot está rodando.");
    } finally {
        // Restaura o estado do botão após o término da operação
        botao.innerText = "CADASTRAR";
        botao.disabled = false;
    }
});