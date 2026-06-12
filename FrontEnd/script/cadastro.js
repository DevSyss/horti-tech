// ==========================================
// CADASTRO DE COLABORADOR
// ==========================================

const formCadastro = document.getElementById("cadastroForm");

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();

    const colaborador = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("cpf").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        tipo: document.getElementById("tipo").value
    };

    try {

        const resposta = await fetch("http://localhost:8080/api/colaboradores", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(colaborador)
        });

        if (resposta.ok) {

            const dados = await resposta.json();

            console.log("Colaborador cadastrado:", dados);

            alert("Colaborador cadastrado com sucesso!");

            formCadastro.reset();

            window.location.href = "/index.html";

        } else {

            const erro = await resposta.text();

            console.error("Erro:", erro);

            alert("Erro ao cadastrar colaborador.\n" + erro);
        }

    } catch (erro) {

        console.error("Erro de conexão:", erro);

        alert("Não foi possível conectar ao servidor.");
    }
});


// ==========================================
// MÁSCARA CPF
// ==========================================

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", function(e) {

    let valor = e.target.value.replace(/\D/g, "");

    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    e.target.value = valor;
});