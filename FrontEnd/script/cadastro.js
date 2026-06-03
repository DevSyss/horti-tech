// Captura os elementos do HTML
const formCadastro = document.getElementById("cadastroForm");
const btnCadastrar = document.getElementById("btnCadastrar");
const inputCpf = document.getElementById("cpf");

// 📊 MÁSCARA DE CPF AUTOMÁTICA (Formata em tempo real: 000.000.000-00)
inputCpf.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo o que não for número
    
    if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    
    e.target.value = value;
});

// 🚀 EVENTO DE SUBMIT DO FORMULÁRIO
formCadastro.addEventListener("submit", async (event) => {
    // Evita o recarregamento padrão da página
    event.preventDefault();

    // Feedback visual no botão e bloqueio contra cliques repetidos
    btnCadastrar.innerText = "CADASTRANDO...";
    btnCadastrar.disabled = true;

    // Monta o objeto exatamente com as propriedades da sua entidade Java (Colaboradores.java)
    const colaborador = {
        nome: document.getElementById("nome").value.trim(),
        cpf: inputCpf.value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        tipo: document.getElementById("tipo").value // Pega diretamente "CHEFE" ou "FUNCIONARIO" do select
    };

    try {
        // Realiza a chamada AJAX via Fetch API para o seu Back-end local
        const response = await fetch("http://localhost:8080/api/colaboradores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(colaborador)
        });

        // Se o Spring Boot salvar com sucesso (HTTP Status 201 Created)
        if (response.ok) {
            alert("Colaborador cadastrado com sucesso no ecossistema HortiTech!");
            formCadastro.reset(); // Limpa o formulário da tela
            window.location.href = "/pages/login.html"; // Redireciona para o login
        } else {
            // Captura erros devolvidos pelo Spring (Ex: CPF Inválido, E-mail repetido)
            const erroTexto = await response.text();
            alert("Não foi possível cadastrar:\n" + erroTexto);
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        alert("Erro de conexão! Verifique se a API do Spring Boot está iniciada na porta 8080.");
    } finally {
        // Retorna o botão ao estado visual padrão
        btnCadastrar.innerText = "CADASTRAR";
        btnCadastrar.disabled = false;
    }
});