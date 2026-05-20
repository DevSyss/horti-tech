const form = document.getElementById("loginForm");

const botao =
    document.getElementById("btnEntrar");

form.addEventListener(
    "submit",

    async function(event) {

        // impede reload
        event.preventDefault();

        // loading
        botao.innerHTML = "ENTRANDO...";
        botao.disabled = true;

        // pega email
        const email =
            document
            .getElementById("email")
            .value
            .trim();

        // pega senha
        const senha =
            document
            .getElementById("senha")
            .value
            .trim();

        // objeto login
        const usuarioLogin = {

            email: email,
            senha: senha

        };

        console.log(usuarioLogin);

        try {

            // REQUISIÇÃO
            const response =
                await fetch(
                    "http://localhost:8080/usuarios",

                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            usuarioLogin
                        )

                    }
                );

            // LOGIN OK
            if (response.ok) {

                const usuario =
                    await response.json();

                console.log(usuario);

                // salva login
                localStorage.setItem(
                    "usuarioLogado",

                    JSON.stringify(usuario)
                );

                alert(
                    "Login realizado com sucesso!"
                );

                // REDIRECIONA
                window.location.replace(
                    "index.html"
                );

            }

            // LOGIN ERRO
            else {

                alert(
                    "Email ou senha inválidos!"
                );
            }

        }

        // ERRO SERVIDOR
        catch(error) {

            console.error(error);

            alert(
                "Erro ao conectar com backend!"
            );
        }

        // volta botão
        botao.innerHTML = "ENTRAR";

        botao.disabled = false;

    }
);