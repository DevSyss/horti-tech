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
.addEventListener(

"input",

(e)=>{

let value=
e.target.value.replace(
    /\D/g,
''
);

value=value.replace(
/(\d{3})(\d)/,
'$1.$2'
);

value=value.replace(
/(\d{3})(\d)/,
'$1.$2'
);

value=value.replace(
/(\d{3})(\d{1,2})$/,
'$1-$2'
);

e.target.value=value;

});



form.addEventListener(

"submit",

async(event)=>{

event.preventDefault();

botao.innerText=
"CADASTRANDO...";

botao.disabled=true;

const colaborador={

nome:
document
.getElementById(
"nome"
)
.value.trim(),

cpf:
document
.getElementById(
"cpf"
)
.value.trim(),

email:
document
.getElementById(
"email"
)
.value.trim(),

senha:
document
.getElementById(
"senha"
)
.value.trim(),

tipo:
document
.getElementById(
"tipo"
)
.value

};

console.log(colaborador);

try{

const response=
await fetch(

"http://localhost:8080/colaboradores",

{

method:"POST",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(
colaborador
)

}

);

if(response.ok){

const data=
await response.json();

console.log(data);

alert(
"Colaborador cadastrado com sucesso!"
);

form.reset();

window.location.href=
"login.html";

}else{

const erro=
await response.text();

console.log(erro);

alert(
"Erro ao cadastrar:\n"+
erro
);

}

}catch(error){

console.log(error);

alert(
"Erro ao conectar ao backend"
);

}

botao.innerText=
"CADASTRAR";

botao.disabled=false;

});