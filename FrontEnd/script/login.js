const form = document.getElementById("loginForm");
const botao = document.getElementById("btnEntrar");

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // Feedback visual
    botao.innerText = "VERIFICANDO...";
    botao.disabled = true;

    const emailInput = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value.trim();
    
    // Captura o valor do cargo selecionado (CHEFE ou FUNCIONARIO)
    const perfilInput = document.querySelector('input[name="perfil"]:checked').value;

    // Monta o JSON combinando perfeitamente com os atributos da sua classe Usuario.java
    const dadosLogin = {
        email: emailInput,
        senha: senhaInput,
        tipo: perfilInput
    };

    console.log("Tentando realizar login para:", emailInput);

    try {
        // Efetuando a requisição para a porta do Spring Boot (8080)
        const response = await fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosLogin)
        });

        // Se o login der certo (Status 200)
        if (response.ok) {
            const textoResposta = await response.text();
            
            // Verifica se o Spring não devolveu uma resposta vazia
            if (!textoResposta) {
                alert("Erro: O servidor validou suas credenciais, mas retornou dados vazios.");
                return;
            }

            const usuarioLogado = JSON.parse(textoResposta);
            console.log("Usuário autenticado com sucesso:", usuarioLogado);

            // Salva na sessão do navegador para usar nas próximas páginas
            sessionStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            alert("Login realizado com sucesso!");

            // Redirecionamento baseado no cargo salvo no banco de dados
            if (usuarioLogado.tipo === "CHEFE") {
                window.location.href = "dashboard_chefe.html";
            } else {
                window.location.href = "dashboard_funcionario.html";
            }

        } else {
            // Se o backend recusar as credenciais (Retornos 401, 404, etc.)
            let mensagem = "E-mail ou senha incorretos.";
            try {
                const erroJson = await response.json();
                if (erroJson.message) mensagem = erroJson.message;
            } catch (e) {
                // Caso não seja um JSON, não quebra a tela
            }
            alert("Falha ao entrar: " + mensagem);
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Não foi possível conectar ao servidor. Certifique-se de que o Spring Boot está rodando em localhost:8080");
    } finally {
        botao.innerText = "ENTRAR";
        botao.disabled = false;
    }
});