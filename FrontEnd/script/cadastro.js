const form =
    document.getElementById(
        "cadastroForm"
    );

const botao =
    document.getElementById(
        "btnCadastrar"
    );

// MÁSCARA CPF
document
    .getElementById("cpf")
    .addEventListener("input", (e) => {

        let value =
            e.target.value
                .replace(/\D/g, "");

        value = value.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );

        value = value.replace(
            /(\d{3})(\d)/,
            "$1.$2"
        );

        value = value.replace(
            /(\d{3})(\d{1,2})$/,
            "$1-$2"
        );

        e.target.value = value;
    });

form.addEventListener(
    "submit",

    async (event) => {

        event.preventDefault();

        botao.innerHTML =
            "CADASTRANDO...";

        botao.disabled = true;

        // DADOS
        const colaborador = {

            nome:
                document
                    .getElementById("nome")
                    .value
                    .trim(),

            cpf:
                document
                    .getElementById("cpf")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            senha:
                document
                    .getElementById("senha")
                    .value
                    .trim()
        };

        console.log(colaborador);

        try {

            const response =
                await fetch(

                    "http://localhost:8080/api/colaboradores",

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(colaborador)
                    }
                );

            // SUCESSO
            if(response.ok) {

                const data =
                    await response.json();

                console.log(data);

                alert(
                    "Colaborador cadastrado com sucesso!"
                );

                form.reset();

                window.location.href =
                    "login.html";
            }

            // ERRO
            else {

                const erro =
                    await response.text();

                console.log(erro);

                alert(
                    "Erro ao cadastrar:\n" + erro
                );
            }

        }

        catch(error) {

            console.error(error);

            alert(
                "Erro ao conectar com backend!"
            );
        }

        botao.innerHTML =
            "CADASTRAR";

        botao.disabled = false;
    }
);