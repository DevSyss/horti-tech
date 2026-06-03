const form = document.getElementById("loginForm");
const botao = document.getElementById("btnEntrar");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    botao.innerText = "VERIFICANDO...";
    botao.disabled = true;

    const emailInput = document.getElementById("email").value.trim();
    const senhaInput = document.getElementById("senha").value.trim();
    
    // Coleta a opção marcada no rádio button do HTML (name="perfil")
    const perfilMarcado = document.querySelector('input[name="perfil"]:checked').value; 

    // Mapeia o payload JSON correspondendo estritamente com os atributos da Entidade Java
    const payload = {
        email: emailInput,
        senha: senhaInput,
        tipo: perfilMarcado 
    };

    try {
        const response = await fetch("http://localhost:8080/api/colaboradores/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const colaboradorLogado = await response.json();
            
            // Grava na sessão local do navegador para futuras verificações de segurança
            sessionStorage.setItem("usuario_logado", JSON.stringify(colaboradorLogado));
            alert("Bem-vindo ao sistema HortiTech!");

            if (colaboradorLogado.tipo === "CHEFE") {
                window.location.href = "dashboard_chefe.html";
            } else {
                window.location.href = "dashboard_funcionario.html";
            }
        } else {
            const erroMensagem = await response.text();
            alert("Falha ao entrar: " + erroMensagem);
        }
    } catch (error) {
        console.error("Erro na comunicação:", error);
        alert("Erro de conexão: Não foi possível se comunicar com o servidor HortiTech.");
    } finally {
        botao.innerText = "ENTRAR";
        botao.disabled = false;
    }
});