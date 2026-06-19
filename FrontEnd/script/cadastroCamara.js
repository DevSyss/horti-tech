const formCadastro = document.getElementById("cameraForm");

formCadastro.addEventListener("submit", async function(event) {

    event.preventDefault();

    const camaraFria = {
        nome: document.getElementById("nome").value.trim(),
        local: document.getElementById("local").value.trim(),
        temperaturaMinima: document.getElementById("temperaturaMinima").value.trim(),
        temperaturaMaxima: document.getElementById("temperaturaMaxima").value.trim(),
        sensor: document.getElementById("sensor").value
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


    localStorage.setItem(
        "cameraCadastrada",
        JSON.stringify(dados)
    );


    alert("Câmara cadastrada com sucesso!");

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



