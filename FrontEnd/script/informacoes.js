

document.addEventListener("DOMContentLoaded",()=>{


const camera = JSON.parse(
localStorage.getItem("cameraCadastrada")
);



if(!camera){

    document.getElementById("dadosCamera").innerHTML = 
    `
    <div class="card">
    <h2>Nenhuma câmera cadastrada</h2>
    </div>
    `;

    return;
}



document.getElementById("dadosCamera").innerHTML = `


<section class="card">


<div class="card-header">

<div class="card-title">

<div class="icon">
<i class="fa-solid fa-warehouse"></i>
</div>


<h2>
${camera.nome}
</h2>


</div>


<div class="tag">
ATIVA
</div>


</div>




<div class="info-grid">


<div class="info-box">

<span>Local</span>

<strong>
${camera.local}
</strong>

</div>



<div class="info-box">

<span>Temperatura Mínima</span>

<strong>
${camera.temperaturaMinima}°C
</strong>

</div>



<div class="info-box">

<span>Temperatura Máxima</span>

<strong>
${camera.temperaturaMaxima}°C
</strong>

</div>



<div class="info-box">

<span>Sensor</span>

<strong>
${camera.sensor}
</strong>

</div>


</div>


</section>


`;



});
