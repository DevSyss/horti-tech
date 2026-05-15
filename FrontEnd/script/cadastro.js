const form =
    document.getElementById(
        "cadastroForm"
    );

form.addEventListener(
    "submit",

    async (event) => {

        event.preventDefault();

        // DADOS
        const colaborador = {

            nome:
                document.getElementById("nome").value,

            cpf:
                document.getElementById("cpf").value,

            email:
                document.getElementById("email").value,

            senha:
                document.getElementById("senha").value
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
                    "Cadastro realizado com sucesso!"
                );

                // REDIRECIONA
                window.location.href =
                    "login.html";
            }

            // ERRO
            else {

                const erro =
                    await response.text();

                console.log(erro);

                alert(
                    "Erro ao cadastrar!"
                );
            }

        }

        catch(error) {

            console.log(error);

            alert(
                "Erro ao conectar com backend!"
            );
        }

    }
);