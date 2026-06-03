const API_CAMERA_URL = "http://localhost:8080/api/cameras";

// Proteção da Rota: Verifica se o usuário está logado
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = localStorage.getItem("usuario");
    if (!usuarioLogado) {
        alert("Acesso negado. Por favor, faça login.");
        window.location.href = "login.html";
        return;
    }

    const usuario = JSON.parse(usuarioLogado);
    document.getElementById("nomeUsuario").innerText = `Olá, ${usuario.nome}!`;
    
    // Carrega a lista de câmeras salvas
    listarCameras();
});

// Envio do formulário da Câmera
document.getElementById("formCamera").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nomeCamera = document.getElementById("nomeCamera").value;
    const localizacao = document.getElementById("localizacao").value;
    const temperaturaMaxima = parseFloat(document.getElementById("tempMax").value);
    const status = document.getElementById("status").value;
    const msgElement = document.getElementById("cameraMsg");

    const dadosCamera = { nomeCamera, localizacao, temperaturaMaxima, status };

    try {
        const response = await fetch(API_CAMERA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCamera)
        });

        if (response.ok) {
            msgElement.style.color = "green";
            msgElement.innerText = "Câmera cadastrada com sucesso!";
            document.getElementById("formCamera").reset();
            listarCameras(); // Atualiza a listagem na tela
        } else {
            msgElement.style.color = "red";
            msgElement.innerText = "Erro ao salvar câmera.";
        }
    } catch (error) {
        console.error("Erro:", error);
    }
});

// Busca e renderiza as câmeras cadastradas
async function listarCameras() {
    const lista = document.getElementById("listaCameras");
    lista.innerHTML = "";

    try {
        const response = await fetch(API_CAMERA_URL);
        const cameras = await response.json();

        cameras.forEach(cam => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${cam.nomeCamera}</strong> - Loc: ${cam.localizacao} | Limite: ${cam.temperaturaMaxima}°C | Status: <span class="status-${cam.status.toLowerCase()}">${cam.status}</span>`;
            lista.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao listar câmeras:", error);
    }
}

// Função de Logout
function logout() {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
}