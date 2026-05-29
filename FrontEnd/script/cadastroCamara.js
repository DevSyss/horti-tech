const form = document.getElementById("cameraForm");
const btnCadastrar = document.getElementById("btnCadastrar");

const API_URL = "http://localhost:8080/api/camaraFria";

function mostrarMensagem(texto,tipo){

    const mensagem = document.createElement("div");

    mensagem.innerText = texto;

    mensagem.style.position = "fixed";
    mensagem.style.top = "20px";
    mensagem.style.right = "20px";
    mensagem.style.padding = "15px";
    mensagem.style.borderRadius = "10px";
    mensagem.style.fontWeight = "bold";
    mensagem.style.zIndex = "999";

    if(tipo==="erro"){

        mensagem.style.background="#ff4d4d";
        mensagem.style.color="white";

    }else{

        mensagem.style.background="#5cb85c";
        mensagem.style.color="white";

    }

    document.body.appendChild(mensagem);

    setTimeout(()=>{

        mensagem.remove();

    },3000);

}


function alterarBotao(carregando){

    if(carregando){

        btnCadastrar.disabled=true;

        btnCadastrar.innerHTML=
        '<i class="fa-solid fa-spinner fa-spin"></i> CADASTRANDO...';

    }

    else{

        btnCadastrar.disabled=false;

        btnCadastrar.innerHTML=
        'CADASTRAR';

    }

}


form.addEventListener(

"submit",

async(event)=>{

event.preventDefault();

const camara={

nome:
document
.getElementById("nome")
.value
.trim(),

local:
document
.getElementById("local")
.value
.trim(),

temperaturaMinima:
parseFloat(
document
.getElementById("temperaturaMinima")
.value
),

temperaturaMaxima:
parseFloat(
document
.getElementById("temperaturaMaxima")
.value
),

sensor:
document
.getElementById("sensor")
.value
.trim()

};


if(!camara.nome){

mostrarMensagem(
"Informe o nome da câmera",
"erro"
);

return;

}

if(!camara.local){

mostrarMensagem(
"Informe o local",
"erro"
);

return;

}


if(

isNaN(
camara.temperaturaMinima
)

){

mostrarMensagem(
"Informe temperatura mínima",
"erro"
);

return;

}


if(

isNaN(
camara.temperaturaMaxima
)

){

mostrarMensagem(
"Informe temperatura máxima",
"erro"
);

return;

}


try{

alterarBotao(true);

console.log(
"Enviando:",
camara
);


const response=

await fetch(

API_URL,

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(
camara
)

}

);


if(response.ok){

const dados=
await response.json();

console.log(
dados
);

mostrarMensagem(
"Câmara cadastrada com sucesso",
"sucesso"
);

form.reset();

}

else{

const erro=
await response.text();

console.log(
erro
);

mostrarMensagem(
"Erro: "+erro,
"erro"
);

}

}

catch(error){

console.error(error);

mostrarMensagem(

"Erro ao conectar ao backend",

"erro"

);

}

finally{

alterarBotao(false);

}

}

);