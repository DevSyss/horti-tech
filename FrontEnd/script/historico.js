function createChart(canvasId, label, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h'],
            datasets: [{
                label: label,
                data: [4, 5, 5, 6, 5, 4, 5, 3.5, 10],
                borderColor: color,
                backgroundColor: color + '22', // Transparência
                fill: true,
                tension: 0.4, // Curva suave
                borderWidth: 4,
                pointRadius: 6,
                pointBackgroundColor: 'white',
                pointBorderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: '#f1f5f9' }, min: 0, max: 10 },
                x: { grid: { display: false } }
            }
        }
    });
}

// Inicializa os gráficos
const tempChart = createChart('tempChart', 'Temperatura', '#88a070');
const umidChart = createChart('umidChart', 'Umidade', '#88a070');

// Função para atualizar os dados manualmente
function updateChart(chart, inputId) {
    const val = document.getElementById(inputId).value;
    if (val !== "") {
        chart.data.datasets[0].data.push(parseFloat(val));
        chart.data.datasets[0].data.shift(); // Remove o dado mais antigo
        chart.update();
        document.getElementById(inputId).value = "";
    }
}
