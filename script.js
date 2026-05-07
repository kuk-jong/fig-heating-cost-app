const SAMPLE_MONTHLY_DEGREE_HOURS = {
  "영암권(목포 대리지점)": { 10: 620, 11: 2680, 12: 5850, 1: 7420, 2: 6150, 3: 3720 },
  "나주권(광주 대리지점)": { 10: 780, 11: 2950, 12: 6420, 1: 8010, 2: 6740, 3: 4050 },
  "해남": { 10: 560, 11: 2480, 12: 5380, 1: 6900, 2: 5650, 3: 3420 },
  "목포": { 10: 510, 11: 2320, 12: 4980, 1: 6350, 2: 5260, 3: 3180 },
};

let weatherRows = [];
let lastMonthly = [];

const $ = (id) => document.getElementById(id);

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function greenhouseSurfaceArea({ width, length, sideHeight, ridgeHeight }) {
  const roofSlope = Math.sqrt((width / 2) ** 2 + (ridgeHeight - sideHeight) ** 2);
  return 2 * length * roofSlope + 2 * length * sideHeight + 2 * width * (sideHeight + (ridgeHeight - sideHeight) / 2);
}

function getInputs() {
  return {
    region: $("region").value,
    width: number($("width").value, 7),
    length: number($("length").value, 100),
    sideHeight: number($("sideHeight").value, 2.5),
    ridgeHeight: number($("ridgeHeight").value, 5),
    targetTemp: number($("targetTemp").value, 12),
    coverU: number($("cover").value, 4.1),
    curtainFactor: number($("curtain").value, 0.55),
    efficiency: number($("efficiency").value, 1),
    price: number($("price").value, 53),
  };
}

function calculateFromDegreeHours(monthlyDegreeHours, inputs) {
  const surfaceArea = greenhouseSurfaceArea(inputs);
  const uEff = inputs.coverU * inputs.curtainFactor;
  const months = [10, 11, 12, 1, 2, 3];
  return months.map((month) => {
    const degreeHours = monthlyDegreeHours[month] || 0;
    const loadKwh = (surfaceArea * uEff * degreeHours) / 1000;
    const electricity = loadKwh / Math.max(inputs.efficiency, 0.01);
    const cost = electricity * inputs.price;
    return {
      month,
      hours: null,
      degreeHours,
      loadKwh,
      cost,
    };
  });
}

function calculateFromWeatherRows(inputs) {
  const grouped = new Map();
  for (const row of weatherRows) {
    if (row.region && row.region !== inputs.region) continue;
    if (![10, 11, 12, 1, 2, 3].includes(row.month)) continue;
    const diff = Math.max(inputs.targetTemp - row.ta, 0);
    if (!grouped.has(row.month)) grouped.set(row.month, { degreeHours: 0, hours: 0 });
    const item = grouped.get(row.month);
    item.degreeHours += diff;
    item.hours += 1;
  }

  const surfaceArea = greenhouseSurfaceArea(inputs);
  const uEff = inputs.coverU * inputs.curtainFactor;
  return [10, 11, 12, 1, 2, 3].map((month) => {
    const item = grouped.get(month) || { degreeHours: 0, hours: 0 };
    const loadKwh = (surfaceArea * uEff * item.degreeHours) / 1000;
    const electricity = loadKwh / Math.max(inputs.efficiency, 0.01);
    return {
      month,
      hours: item.hours,
      degreeHours: item.degreeHours,
      loadKwh,
      cost: electricity * inputs.price,
    };
  });
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^\uFEFF/, ""));
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    return Object.fromEntries(headers.map((h, index) => [h, (cols[index] || "").trim()]));
  });
}

function normalizeWeatherRows(rows) {
  return rows
    .map((row) => {
      const tm = row.tm || row.date || row.datetime || "";
      const month = number(row.month, tm ? number(tm.slice(5, 7), NaN) : NaN);
      const ta = number(row.ta_c || row.ta || row.temperature || row.temp, NaN);
      const region = row.region || row.stn_name_kma || row.stn_name || "";
      return { month, ta, region };
    })
    .filter((row) => Number.isFinite(row.month) && Number.isFinite(row.ta));
}

function render() {
  const inputs = getInputs();
  $("targetTempLabel").textContent = `${inputs.targetTemp}°C`;
  const surfaceArea = greenhouseSurfaceArea(inputs);
  const monthly =
    weatherRows.length > 0
      ? calculateFromWeatherRows(inputs)
      : calculateFromDegreeHours(SAMPLE_MONTHLY_DEGREE_HOURS[inputs.region], inputs);

  lastMonthly = monthly;
  const totalDegreeHours = monthly.reduce((sum, row) => sum + row.degreeHours, 0);
  const totalLoad = monthly.reduce((sum, row) => sum + row.loadKwh, 0);
  const totalCost = monthly.reduce((sum, row) => sum + row.cost, 0);

  $("surfaceArea").textContent = `${formatNumber(surfaceArea, 1)} ㎡`;
  $("degreeHours").textContent = `${formatNumber(totalDegreeHours)} ℃h`;
  $("loadKwh").textContent = `${formatNumber(totalLoad)} kWh`;
  $("cost").textContent = `${formatNumber(totalCost)} 원`;

  $("monthlyRows").innerHTML = monthly
    .map(
      (row) => `<tr>
        <td>${row.month}월</td>
        <td>${row.hours === null ? "예시" : formatNumber(row.hours)}</td>
        <td>${formatNumber(row.degreeHours)}</td>
        <td>${formatNumber(row.loadKwh)}</td>
        <td>${formatNumber(row.cost)}</td>
      </tr>`,
    )
    .join("");

  drawChart(monthly);
}

function drawChart(monthly) {
  const canvas = $("monthlyChart");
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const padding = { left: 64, right: 26, top: 28, bottom: 44 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;
  const maxCost = Math.max(...monthly.map((row) => row.cost), 1);

  ctx.strokeStyle = "#d8dee8";
  ctx.lineWidth = 1;
  ctx.font = "14px Arial";
  ctx.fillStyle = "#617085";
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
    const value = maxCost * (1 - i / 4);
    ctx.fillText(`${formatNumber(value / 10000)}만`, 12, y + 4);
  }

  const barGap = 20;
  const barW = (chartW - barGap * (monthly.length - 1)) / monthly.length;
  monthly.forEach((row, index) => {
    const x = padding.left + index * (barW + barGap);
    const barH = (row.cost / maxCost) * chartH;
    const y = padding.top + chartH - barH;
    ctx.fillStyle = "#0f766e";
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = "#18212f";
    ctx.textAlign = "center";
    ctx.fillText(`${row.month}월`, x + barW / 2, h - 18);
  });
  ctx.textAlign = "left";
}

function downloadCsv() {
  const header = "month,valid_hours,heating_degree_hours,heating_load_kwh,estimated_cost_krw";
  const rows = lastMonthly.map((row) =>
    [row.month, row.hours ?? "", row.degreeHours.toFixed(3), row.loadKwh.toFixed(3), Math.round(row.cost)].join(","),
  );
  const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "heating_cost_result.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function initRegions() {
  $("region").innerHTML = Object.keys(SAMPLE_MONTHLY_DEGREE_HOURS)
    .map((region) => `<option value="${region}">${region}</option>`)
    .join("");
}

function bindEvents() {
  document.querySelectorAll("input, select").forEach((el) => {
    if (el.type !== "file") el.addEventListener("input", render);
  });
  $("resetButton").addEventListener("click", () => {
    $("width").value = 7;
    $("length").value = 100;
    $("sideHeight").value = 2.5;
    $("ridgeHeight").value = 5;
    $("targetTemp").value = 12;
    $("cover").value = 4.1;
    $("curtain").value = 0.55;
    $("efficiency").value = 1;
    $("price").value = 53;
    weatherRows = [];
    $("dataStatus").textContent = "예시 자료 사용 중";
    render();
  });
  $("downloadCsv").addEventListener("click", downloadCsv);
  $("csvFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    weatherRows = normalizeWeatherRows(parseCsv(text));
    $("dataStatus").textContent = `${formatNumber(weatherRows.length)}개 시간자료 사용 중`;
    render();
  });
}

initRegions();
bindEvents();
render();
