const form = document.getElementById("cadastroForm");

const botao = document.getElementById("btnCadastrar");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    botao.innerHTML = "CADASTRANDO...";
    botao.disabled = true;

    // Campos
    const email = document
        .getElementById("email")
        .value
        .trim();

    const senha = document
        .getElementById("senha")
        .value
        .trim();

    // Tipo
    const tipo = document.querySelector(
        'input[name="perfil"]:checked'
    ).value;

    // Objeto
    const usuario = {

        email: email,
        senha: senha,
        tipo: tipo

    };

    console.log(usuario);

    try {

        const response = await fetch(
            "http://localhost:8080/usuarios/cadastro",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(usuario)

            }
        );

        // SUCESSO
        if (response.ok) {

            const usuarioCriado =
                await response.json();

            console.log(usuarioCriado);

            alert("Usuário cadastrado com sucesso!");

            form.reset();

            window.location.href =
                "login.html";

        }

        // ERRO
        else {

            const erro =
                await response.text();

            alert(
                "Erro ao cadastrar:\n" + erro
            );

        }

    }

    catch (error) {

        console.error(error);

        alert(
            "Erro ao conectar com backend!"
        );

    }

    botao.innerHTML = "CADASTRE-SE";

    botao.disabled = false;

});