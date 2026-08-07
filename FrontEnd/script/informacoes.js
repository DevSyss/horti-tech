document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // ATUALIZAÇÃO DE HORÁRIO EM TEMPO REAL
  // =========================================
  function updateLiveTime() {
    const timeElement = document.getElementById("live-time");
    if (timeElement) {
      const now = new Date();
      timeElement.textContent = now.toLocaleTimeString('pt-BR');
    }
  }
  setInterval(updateLiveTime, 1000);
  updateLiveTime();

  // =========================================
  // SELEÇÃO DE ELEMENTOS DOS MODAIS
  // =========================================
  const modalDetailsBackdrop = document.getElementById("modal-details-backdrop");
  const btnCloseDetailsModal = document.getElementById("btn-close-details-modal");
  const btnCloseDetailsFooter = document.getElementById("btn-close-details-footer");

  const modalAddBackdrop = document.getElementById("modal-add-backdrop");
  const btnAddCamera = document.getElementById("btn-add-camera");
  const btnCloseAddModal = document.getElementById("btn-close-add-modal");
  const btnCancelAdd = document.getElementById("btn-cancel-add");
  const formAddCamera = document.getElementById("form-add-camera");

  const containerDadosCamera = document.getElementById("dadosCamera");

  // =========================================
  // CARREGAR CÂMARA SALVA NO LOCALSTORAGE
  // =========================================
  function renderSavedCameras() {
    const cameraCadastrada = JSON.parse(localStorage.getItem("cameraCadastrada")) || JSON.parse(localStorage.getItem("camera"));

    if (!cameraCadastrada) {
      containerDadosCamera.innerHTML = `
        <section class="card" style="border: 2px dashed #d1d5db; background: transparent; text-align: center;">
          <div style="padding: 20px; color: var(--muted);">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size: 32px; margin-bottom: 10px;"></i>
            <h3>Nenhuma câmara adicional cadastrada</h3>
            <p style="font-size: 13px;">Clique no botão "+ Nova Câmara" para adicionar um novo hardware.</p>
          </div>
        </section>
      `;
      return;
    }

    const cameraNome = cameraCadastrada.nome || "Câmara Cadastrada";
    const cameraLocal = cameraCadastrada.local || "Não informado";
    const tempMin = cameraCadastrada.temperaturaMinima || "--";
    const tempMax = cameraCadastrada.temperaturaMaxima || "--";
    const sensor = cameraCadastrada.sensor || "Padrão";

    containerDadosCamera.innerHTML = `
      <section class="card">
        <div class="card-header">
          <div class="card-title">
            <div class="icon">
              <i class="fa-solid fa-warehouse"></i>
            </div>
            <div>
              <h2>${cameraNome}</h2>
              <span class="card-subtitle">📍 Local: ${cameraLocal}</span>
            </div>
          </div>
          <div class="tag tag-online">ATIVA</div>
        </div>

        <div class="info-grid">
          <div class="info-box">
            <span>Temp. Mínima</span>
            <strong>${tempMin}°C</strong>
          </div>
          <div class="info-box">
            <span>Temp. Máxima</span>
            <strong>${tempMax}°C</strong>
          </div>
          <div class="info-box">
            <span>Sensor</span>
            <strong style="font-size: 14px;">${sensor}</strong>
          </div>
        </div>

        <div class="card-footer-action">
          <button class="btn-card-action" onclick="window.openDynamicCameraModal()">
            <i class="fa-solid fa-circle-info"></i> Ver Detalhes
          </button>
        </div>
      </section>
    `;
  }

  // =========================================
  // ABERTURA DE MODAIS DE DETALHES
  // =========================================
  window.openEsp32Details = function() {
    document.getElementById("modal-cam-title").textContent = "ESP32 • Dispositivo Principal";
    document.getElementById("modal-cam-location").textContent = "Localização: Sorocaba, SP";
    document.getElementById("modal-temp-min").textContent = "18.0°C";
    document.getElementById("modal-temp-max").textContent = "26.0°C";
    document.getElementById("modal-sensor-type").textContent = "Wi-Fi / LoRa Gateway";
    document.getElementById("modal-op-status").textContent = "Operacional (100%)";
    document.getElementById("modal-cam-description").textContent = "Microcontrolador mestre operando como Gateway Principal. Gerencia o tráfego de dados dos demais nós e envia medições diretas para a nuvem.";

    modalDetailsBackdrop.classList.add("active");
  };

  window.openDynamicCameraModal = function() {
    const camera = JSON.parse(localStorage.getItem("cameraCadastrada")) || JSON.parse(localStorage.getItem("camera"));
    if (!camera) return;

    document.getElementById("modal-cam-title").textContent = camera.nome || "Câmara Cadastrada";
    document.getElementById("modal-cam-location").textContent = `Local: ${camera.local || "Sorocaba"}`;
    document.getElementById("modal-temp-min").textContent = `${camera.temperaturaMinima || "--"}°C`;
    document.getElementById("modal-temp-max").textContent = `${camera.temperaturaMaxima || "--"}°C`;
    document.getElementById("modal-sensor-type").textContent = camera.sensor || "DHT22";
    document.getElementById("modal-op-status").textContent = "Ativa";
    document.getElementById("modal-cam-description").textContent = `Esta câmara está configurada para operar com o sensor ${camera.sensor}. Alertas automáticos serão disparados se as métricas ultrapassarem a faixa de ${camera.temperaturaMinima}°C a ${camera.temperaturaMaxima}°C.`;

    modalDetailsBackdrop.classList.add("active");
  };

  function closeDetailsModal() {
    modalDetailsBackdrop.classList.remove("active");
  }

  btnCloseDetailsModal.addEventListener("click", closeDetailsModal);
  btnCloseDetailsFooter.addEventListener("click", closeDetailsModal);
  modalDetailsBackdrop.addEventListener("click", (e) => {
    if (e.target === modalDetailsBackdrop) closeDetailsModal();
  });

  // =========================================
  // MODAL PARA CADASTRAR NOVA CÂMARA
  // =========================================
  if (btnAddCamera) {
    btnAddCamera.addEventListener("click", () => {
      modalAddBackdrop.classList.add("active");
    });
  }

  function closeAddModal() {
    modalAddBackdrop.classList.remove("active");
    formAddCamera.reset();
  }

  btnCloseAddModal.addEventListener("click", closeAddModal);
  btnCancelAdd.addEventListener("click", closeAddModal);
  modalAddBackdrop.addEventListener("click", (e) => {
    if (e.target === modalAddBackdrop) closeAddModal();
  });

  // SALVAR FORMULÁRIO E SALVAR NO LOCALSTORAGE
  formAddCamera.addEventListener("submit", (e) => {
    e.preventDefault();

    const novaCamera = {
      nome: document.getElementById("input-nome").value,
      local: document.getElementById("input-local").value,
      temperaturaMinima: document.getElementById("input-temp-min").value,
      temperaturaMaxima: document.getElementById("input-temp-max").value,
      sensor: document.getElementById("input-sensor").value
    };

    localStorage.setItem("cameraCadastrada", JSON.stringify(novaCamera));
    renderSavedCameras();
    closeAddModal();
  });

  // RENDERIZAÇÃO INICIAL
  renderSavedCameras();
});