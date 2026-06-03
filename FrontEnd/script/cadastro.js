const form = document.getElementById("cadastroForm");
const botao = document.getElementById("btnCadastrar");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    botao.innerText = "CADASTRANDO...";
    botao.disabled = true;

    // Monta o objeto idêntico à classe Usuario.java do seu backend
    const usuario = {
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        tipo: document.getElementById("tipo").value // Deve enviar 'CHEFE' ou 'FUNCIONARIO'
    };

    try {
        // Envia para o endpoint correto: UsuarioController -> @PostMapping("/cadastro")
        const response = await fetch("http://localhost:8080/api/usuarios/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            form.reset();
            window.location.href = "login.html"; // Vai para a tela de login
        } else {
            const erroTexto = await response.text();
            alert("Erro nas validações do sistema:\n" + erroTexto);
        }
    } catch (error) {
        console.error("Erro de rede:", error);
        alert("Erro ao conectar com o servidor.");
    } finally {
        botao.innerText = "CADASTRAR";
        botao.disabled = false;
    }
});