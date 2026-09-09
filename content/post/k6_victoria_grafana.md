---
date: 2025-01-06
title: "K6 + Victoria Metrics + Grafana 🚀"
description: "⚔️ Integración de K6, Victoria Metrics y Grafana para monitoreo de performance ⚔️"
featured_image: "/images/k6-vms-grafana/portada.png"
cascade:
  featured_image: "/images/k6-vms-grafana/portada.png"
tags: ["k6", "grafana", "victoriametrics", "performance", "stress", "testing"]
disable_share: true
omit_header_text: false
type: post
---

🧩 En este tutorial dejo mi procedimiento comprobado para integrar K6, Victoria Metrics y Grafana, ideal para stress testing y monitoreo serio de cargas.
Un solo flujo, claro y sin sorpresas: de la instalación al dashboard listo para producción.
Dale poder a tus métricas.

## 🔹 **Contexto**

Procedimiento probado en **Ubuntu 24.04** y **SUSE Linux Enterprise Server 15 SP6**.

---

## ✅ **1. Instalar Victoria Metrics**

**VictoriaMetrics** es una base de datos de series temporales, rápida, escalable y económica.

- Descargá la versión *single-node*: [Releases](https://github.com/VictoriaMetrics/VictoriaMetrics/releases/latest)  
- Para este ejemplo (julio 2025) se usó: `victoria-metrics-linux-amd64-v1.120.0.tar.gz`

Deja corriendo y recupera la terminal:

```bash

tar -zxvf victoria-metrics-linux-amd64-v1.120.0.tar.gz
./victoria-metrics-prod -retentionPeriod=1 -storageDataPath=./victoria-metrics-data &

```
🔹 **storageDataPath** VictoriaMetrics almacena todos los datos en este directorio. La ruta predeterminada es victoria-metrics-data el directorio de trabajo actual.

🔹 **retentionPeriod** Retención de datos almacenados. Los datos antiguos se eliminan automáticamente. El periodo de retención predeterminado es de 1 mes (31 días). El periodo mínimo de retención es de 24 horas o 1 día.

![path](/images/k6-vms-grafana/path_victoriametrics.png)

Verificá que esté corriendo:

http://localhost:8428/

![path](/images/k6-vms-grafana/site_vms.png)

✅ **2. Instalar Grafana**

Descargar **Standalone Linux Binaries** desde [Grafana Downloads](https://grafana.com/grafana/download)

Ejemplo usado: grafana-12.0.2.linux-amd64.tar.gz

Deja corriendo y recupera la terminal:

```bash

tar -xzf grafana-12.0.2.linux-amd64.tar.gz

/grafana-v12.0.2$ ./bin/grafana server &

```

![path](/images/k6-vms-grafana/path_grafana.png)

Accedé a Grafana:

http://localhost:3000/

![path](/images/k6-vms-grafana/site_grafana.png)

**user: admin**

**password: admin**

✅ **3.  Conectar Grafana a Victoria Metrics**

- 📌 **Crear nuevo Data Source.**

- 📌 **Usar VictoriaMetrics como tipo.**

- 📌 **Configurar los parámetros básicos.**

- 📌 **Guardar y testear.**

Se debe crear realizando los siguientes pasos:

![path](/images/k6-vms-grafana/ds_grafana.png)

![path](/images/k6-vms-grafana/new_ds_grafana.png)

En principio, solo setear los siguientes parámetros, luego podes editar el resto en base a criterios propios

![path](/images/k6-vms-grafana/prop_ds_grafana.png)

✅ **4. Script de K6**

Sugerencia: usar el **tag "name"** para identificar cada request en Grafana:

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

// Lista de endpoints de ejemplo
const endpoints = [
    '/api/foo',
    '/api/bar',
    '/api/baz',
];

// Config
export const options = {
    vus: 10,
    duration: '120s',
};

export default function () {
    // Elegir endpoint random
    const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

    // Hacer request con tag `name`
    http.get(`https://server${ep}`, {
        tags: { name: ep }
    });

    sleep(1);
}
```

✅ **5. Bash para ejecución el script de k6**

```bash

#!/bin/bash

PROM_URL="http://localhost:8428/api/v1/write"
TREND_STATS="min,avg,med,p(90),p(95),p(99),max"

(
  export K6_PROMETHEUS_RW_TREND_STATS="$TREND_STATS"
  export K6_PROMETHEUS_RW_SERVER_URL="$PROM_URL"
  export K6_PROMETHEUS_RW_PUSH_INTERVAL=1s

  ./k6 run --no-connection-reuse -o experimental-prometheus-rw script.js
)
wait

```

**🔹Dashboard de grafana:**

Tenes que importar el siguiente json en tu grafana:

[grafana dashboard JSON](https://github.com/MarianoImende/k6/blob/main/dashboard_grafana/K6%20VictoriaMetrics.json)

**📊 Vista del Dashboard de grafana:**  

![path](/images/k6-vms-grafana/dashboard_grafana.png)

✅ **Recursos útiles**

**🔹 Script completo de K6:**

[Script](https://github.com/MarianoImende/k6.git)


✅ **Tips finales**

📌 Revisá puertos abiertos (8428 para VictoriaMetrics, 3000 para Grafana).

📌 Personalizá retención y paths según tu entorno productivo.

📌 Probá tus dashboards y ajustá filtros/tags para optimizar métricas.

---------------------------------------------------------------

🔥 Muchisimos exitos en tu implementación. 🚀


