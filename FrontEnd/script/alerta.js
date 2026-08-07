document.addEventListener("DOMContentLoaded", () => {

  // =========================================
  // BASE DE DADOS DE ALERTAS (MOCK/DINÂMICO)
  // =========================================
  let alertsData = [
    {
      id: 1,
      title: "Aumento de Temperatura",
      severity: "warning", // warning, critical, info
      camara: "Câmara 01",
      setor: "Setor A",
      device: "ESP32 (Node-01)",
      time: "14:30h",
      fullTime: "14:30:12h",
      value: "38.5°C",
      expected: "18.0°C - 24.0°C",
      status: "active", // active, acknowledged
      icon: "fa-temperature-high",
      diagnosis: "Oscilação térmica crítica detectada pelo sensor DHT22. Risco moderado de estresse térmico nas mudas de hortaliças.",
      actions: [
        "Inspecione a ventilação principal da Câmara 01.",
        "Verifique a calibração do sensor DHT22 no módulo ESP32.",
        "Ative a irrigação nebulizada para resfriamento se exceder 40°C."
      ]
    },
    {
      id: 2,
      title: "Falha de Conexão",
      severity: "critical",
      camara: "Setor Norte",
      setor: "Gateway Principal",
      device: "Gateway LoRa",
      time: "12:15h",
      fullTime: "12:15:45h",
      value: "OFFLINE",
      expected: "Sinal Rssi > -90dBm",
      status: "active",
      icon: "fa-plug-circle-xmark",
      diagnosis: "Perda de heartbeat do Gateway há mais de 15 minutos. Dados de telemetria do Setor Norte interrompidos.",
      actions: [
        "Verifique a fonte de alimentação PoE do Gateway.",
        "Inspecione os cabos de rede e o roteador do Setor Norte.",
        "Execute um ciclo de energia (power cycle) no módulo."
      ]
    },
    {
      id: 3,
      title: "Umidade Crítica do Solo",
      severity: "critical",
      camara: "Câmara 02",
      setor: "Setor B",
      device: "ESP32 (Node-02)",
      time: "11:00h",
      fullTime: "11:00:02h",
      value: "18%",
      expected: "60% - 80%",
      status: "active",
      icon: "fa-droplet-slash",
      diagnosis: "Nível de umidade do substrato abaixo do mínimo recomendado. Risco iminente de murchamento das plantas.",
      actions: [
        "Ligue manualmente a bomba de irrigação da Câmara 02.",
        "Limpe as válvulas solenoide de água.",
        "Confira o sensor capacitivo de umidade."
      ]
    },
    {
      id: 4,
      title: "Nível de CO2 Elevado",
      severity: "warning",
      camara: "Estufa Sul",
      setor: "Estufa 03",
      device: "Sensor MH-Z19",
      time: "09:40h",
      fullTime: "09:40:20h",
      value: "1450 PPM",
      expected: "400 - 900 PPM",
      status: "acknowledged",
      icon: "fa-wind",
      diagnosis: "Acúmulo de dióxido de carbono acima dos parâmetros desejados. Necessária renovação de ar no ambiente fechado.",
      actions: [
        "Abra os exaustores laterais da Estufa Sul.",
        "Verifique a taxa de renovação de ar do sistema automatizado."
      ]
    }
  ];

  // ESTADO DE FILTRAGEM
  let activeFilters = {
    search: "",
    severity: "all",
    camara: "all",
    status: "all"
  };

  let selectedAlertId = null;

  // ELEMENTOS DO DOM
  const container = document.getElementById("alerts-list-container");
  const inputSearch = document.getElementById("input-search");
  const btnClearSearch = document.getElementById("btn-clear-search");
  const emptyState = document.getElementById("empty-state");
  const alertCounterBadge = document.getElementById("alert-counter-badge");
  const alertCountText = document.getElementById("alert-count-text");
  const filterIndicator = document.getElementById("filter-indicator");

  // BARRA DE FILTROS ATIVOS
  const activeFiltersBar = document.getElementById("active-filters-bar");
  const filterTagsList = document.getElementById("filter-tags-list");
  const btnClearAllFilters = document.getElementById("btn-clear-all-filters");

  // MODAL DE DETALHES
  const modalDetailsBackdrop = document.getElementById("modal-details-backdrop");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnAcknowledgeAlert = document.getElementById("btn-acknowledge-alert");
  const btnResolveAlert = document.getElementById("btn-resolve-alert");

  // MODAL DE FILTROS
  const modalFilterBackdrop = document.getElementById("modal-filter-backdrop");
  const btnOpenFilter = document.getElementById("btn-open-filter");
  const btnCloseFilterModal = document.getElementById("btn-close-filter-modal");
  const btnApplyFilters = document.getElementById("btn-apply-filters");
  const btnResetFilters = document.getElementById("btn-reset-filters");
  const selectFilterCamara = document.getElementById("select-filter-camara");

  // =========================================
  // RENDERIZAÇÃO DOS CARDS DE ALERTA
  // =========================================
  function renderAlerts() {
    const filtered = alertsData.filter(alert => {
      // Busca em tempo real (Título, Câmara, Setor ou Dispositivo)
      const query = activeFilters.search.toLowerCase().trim();
      const matchSearch = !query || 
        alert.title.toLowerCase().includes(query) ||
        alert.camara.toLowerCase().includes(query) ||
        alert.setor.toLowerCase().includes(query) ||
        alert.device.toLowerCase().includes(query) ||
        alert.value.toLowerCase().includes(query);

      // Filtro de Severidade
      const matchSeverity = activeFilters.severity === "all" || alert.severity === activeFilters.severity;

      // Filtro de Câmara
      const matchCamara = activeFilters.camara === "all" || alert.camara === activeFilters.camara;

      // Filtro de Status
      const matchStatus = activeFilters.status === "all" || 
        (activeFilters.status === "active" && alert.status === "active") ||
        (activeFilters.status === "acknowledged" && alert.status === "acknowledged");

      return matchSearch && matchSeverity && matchCamara && matchStatus;
    });

    // Atualizar Contadores
    const activeCount = alertsData.filter(a => a.status === "active").length;
    alertCounterBadge.textContent = activeCount;
    alertCountText.textContent = filtered.length;

    // Atualizar Estado Vazio
    if (filtered.length === 0) {
      container.innerHTML = "";
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
      container.innerHTML = filtered.map(alert => createAlertCardHTML(alert)).join("");
    }

    updateActiveFilterTags();
  }

  function createAlertCardHTML(alert) {
    const statusPillHTML = alert.value === "OFFLINE"
      ? `<div class="status-pill danger">OFFLINE</div>`
      : `<strong style="color: ${alert.severity === 'critical' ? 'var(--danger)' : 'var(--warning)'};">${alert.value}</strong>`;

    const acknowledgedClass = alert.status === "acknowledged" ? "acknowledged" : "";

    return `
      <article class="alert-card ${alert.severity} ${acknowledgedClass}" data-id="${alert.id}">
        <div class="alert-main-content">
          <div class="icon-box">
            <i class="fa-solid ${alert.icon}"></i>
          </div>
          <div class="alert-info">
            <h3>${alert.title} ${alert.status === 'acknowledged' ? '<small style="font-size:12px; color: var(--muted);">(Reconhecido)</small>' : ''}</h3>
            <div class="meta">
              <span><i class="fa-solid fa-warehouse"></i> ${alert.camara}</span>
              <span><i class="fa-solid fa-microchip"></i> ${alert.device}</span>
              <span><i class="fa-solid fa-clock"></i> ${alert.time}</span>
            </div>
          </div>
        </div>
        <div class="alert-side">
          ${statusPillHTML}
          <button class="btn-details" onclick="window.openAlertDetails(${alert.id})">
            Detalhes <i class="fa-solid fa-chevron-right" style="font-size: 11px;"></i>
          </button>
        </div>
      </article>
    `;
  }

  // =========================================
  // LÓGICA DE BUSCA EM TEMPO REAL
  // =========================================
  inputSearch.addEventListener("input", (e) => {
    activeFilters.search = e.target.value;
    btnClearSearch.style.display = activeFilters.search ? "block" : "none";
    renderAlerts();
  });

  btnClearSearch.addEventListener("click", () => {
    inputSearch.value = "";
    activeFilters.search = "";
    btnClearSearch.style.display = "none";
    renderAlerts();
  });

  document.getElementById("btn-reset-search").addEventListener("click", () => {
    inputSearch.value = "";
    activeFilters = { search: "", severity: "all", camara: "all", status: "all" };
    resetFilterChips();
    btnClearSearch.style.display = "none";
    renderAlerts();
  });

  // =========================================
  // MODAL DE DETALHES
  // =========================================
  window.openAlertDetails = function(id) {
    const alert = alertsData.find(a => a.id === id);
    if (!alert) return;

    selectedAlertId = id;

    // Preencher dados no modal
    document.getElementById("modal-camara-tag").textContent = `${alert.camara} • ${alert.setor}`;
    document.getElementById("modal-alert-title").textContent = alert.title;
    document.getElementById("modal-metric-value").textContent = alert.value;
    document.getElementById("modal-metric-expected").textContent = alert.expected;
    document.getElementById("modal-metric-time").textContent = alert.fullTime;
    document.getElementById("modal-metric-device").textContent = alert.device;
    document.getElementById("modal-diagnosis-text").textContent = alert.diagnosis;

    // Ícone e Severidade
    const iconBadge = document.getElementById("modal-severity-icon");
    if (alert.severity === "critical") {
      iconBadge.style.background = "#FEF2F2";
      iconBadge.style.color = "var(--danger)";
      iconBadge.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else {
      iconBadge.style.background = "#FFF9F0";
      iconBadge.style.color = "var(--warning)";
      iconBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    }

    // Ações recomendadas
    const actionsList = document.getElementById("modal-actions-list");
    actionsList.innerHTML = alert.actions.map(action => `<li>${action}</li>`).join("");

    // Estado dos botões do modal
    if (alert.status === "acknowledged") {
      btnAcknowledgeAlert.style.display = "none";
    } else {
      btnAcknowledgeAlert.style.display = "inline-flex";
    }

    // Exibir Modal
    modalDetailsBackdrop.classList.add("active");
  };

  function closeModalDetails() {
    modalDetailsBackdrop.classList.remove("active");
    selectedAlertId = null;
  }

  btnCloseModal.addEventListener("click", closeModalDetails);
  modalDetailsBackdrop.addEventListener("click", (e) => {
    if (e.target === modalDetailsBackdrop) closeModalDetails();
  });

  // Ação: Reconhecer Alerta
  btnAcknowledgeAlert.addEventListener("click", () => {
    if (!selectedAlertId) return;
    const alert = alertsData.find(a => a.id === selectedAlertId);
    if (alert) {
      alert.status = "acknowledged";
      renderAlerts();
      closeModalDetails();
    }
  });

  // Ação: Resolver Alerta
  btnResolveAlert.addEventListener("click", () => {
    if (!selectedAlertId) return;
    alertsData = alertsData.filter(a => a.id !== selectedAlertId);
    renderAlerts();
    closeModalDetails();
  });

  // =========================================
  // MODAL DE FILTROS AVANÇADOS
  // =========================================
  btnOpenFilter.addEventListener("click", () => {
    modalFilterBackdrop.classList.add("active");
  });

  function closeFilterModal() {
    modalFilterBackdrop.classList.remove("active");
  }

  btnCloseFilterModal.addEventListener("click", closeFilterModal);
  modalFilterBackdrop.addEventListener("click", (e) => {
    if (e.target === modalFilterBackdrop) closeFilterModal();
  });

  // Evento dos Chips de Opção
  document.querySelectorAll(".chip-btn").forEach(chip => {
    chip.addEventListener("click", function() {
      const group = this.dataset.filterType;
      document.querySelectorAll(`.chip-btn[data-filter-type="${group}"]`).forEach(c => c.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Aplicar Filtros
  btnApplyFilters.addEventListener("click", () => {
    const activeSeverity = document.querySelector('.chip-btn[data-filter-type="severity"].active')?.dataset.value || "all";
    const activeStatus = document.querySelector('.chip-btn[data-filter-type="status"].active')?.dataset.value || "all";
    const selectedCamara = selectFilterCamara.value;

    activeFilters.severity = activeSeverity;
    activeFilters.status = activeStatus;
    activeFilters.camara = selectedCamara;

    renderAlerts();
    closeFilterModal();
  });

  // Limpar Filtros
  btnResetFilters.addEventListener("click", () => {
    resetFilterChips();
    activeFilters.severity = "all";
    activeFilters.status = "all";
    activeFilters.camara = "all";
    selectFilterCamara.value = "all";
    renderAlerts();
    closeFilterModal();
  });

  btnClearAllFilters.addEventListener("click", () => {
    resetFilterChips();
    inputSearch.value = "";
    btnClearSearch.style.display = "none";
    activeFilters = { search: "", severity: "all", camara: "all", status: "all" };
    selectFilterCamara.value = "all";
    renderAlerts();
  });

  function resetFilterChips() {
    document.querySelectorAll(".chip-btn").forEach(c => {
      c.classList.toggle("active", c.dataset.value === "all");
    });
  }

  function updateActiveFilterTags() {
    const tags = [];

    if (activeFilters.severity !== "all") {
      const labels = { critical: "Crítico", warning: "Atenção", info: "Informativo" };
      tags.push({ key: "severity", label: `Severidade: ${labels[activeFilters.severity]}` });
    }
    if (activeFilters.camara !== "all") {
      tags.push({ key: "camara", label: `Local: ${activeFilters.camara}` });
    }
    if (activeFilters.status !== "all") {
      const labels = { active: "Ativos", acknowledged: "Reconhecidos" };
      tags.push({ key: "status", label: `Status: ${labels[activeFilters.status]}` });
    }

    if (tags.length > 0) {
      activeFiltersBar.style.display = "flex";
      filterIndicator.style.display = "block";
      filterTagsList.innerHTML = tags.map(t => `
        <span class="filter-tag">
          ${t.label}
          <i class="fa-solid fa-xmark" onclick="window.removeSingleFilter('${t.key}')"></i>
        </span>
      `).join("");
    } else {
      activeFiltersBar.style.display = "none";
      filterIndicator.style.display = "none";
    }
  }

  window.removeSingleFilter = function(key) {
    activeFilters[key] = "all";
    if (key === "camara") selectFilterCamara.value = "all";
    document.querySelectorAll(`.chip-btn[data-filter-type="${key}"]`).forEach(c => {
      c.classList.toggle("active", c.dataset.value === "all");
    });
    renderAlerts();
  };

  // RENDERIZAÇÃO INICIAL
  renderAlerts();
});