const formCadastro = document.getElementById("cameraForm");

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();

    const camaraFria = {
        nome: document.getElementById("nome").value.trim(),
        cpf: document.getElementById("local").value.trim(),
        email: document.getElementById("temperaturaMinima").value.trim(),
        senha: document.getElementById("temperaturaMaxima").value.trim(),
        tipo: document.getElementById("sensor").value
    };

    try {

        const resposta = await fetch("http://localhost:8080/api/camaraFria", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(camaraFria)
        });

        if (resposta.ok) {

            const dados = await resposta.json();

            console.log("Câmara Fria cadastrada:", dados);

            alert("Câmara Fria cadastrada com sucesso!");

            formCadastro.reset();

            window.location.href = "/index.html";

        } else {

            const erro = await resposta.text();

            console.error("Erro:", erro);

            alert("Erro ao cadastrar câmara fria.\n" + erro);
        }

    } catch (erro) {

        console.error("Erro de conexão:", erro);

        alert("Não foi possível conectar ao servidor.");
    }
});
