const API_URL = "http://localhost:8080/api/usuarios";

document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const msgElement = document.getElementById("mensagem");

    const dadosLogin = { email, senha };

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosLogin)
        });

        if (response.ok) {
            const usuarioLogado = await response.json();
            
            // Salva dados no localStorage para persistência de sessão
            localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
            
            msgElement.style.color = "green";
            msgElement.innerText = "Login bem-sucedido!";
            
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            const data = await response.json();
            msgElement.style.color = "red";
            msgElement.innerText = data.message || "Credenciais inválidas.";
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        msgElement.style.color = "red";
        msgElement.innerText = "Erro ao conectar com o servidor.";
    }
});