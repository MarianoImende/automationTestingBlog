---
date: 2025-01-06
title: "K6 + Victoria Metrics + Grafana 🚀"
description: "⚔️ Integración de K6, Victoria Metrics y Grafana para monitoreo de performance ⚔️"
featured_image: "/images/k6-kafka/k6-kafka.webp"
cascade:
  featured_image: "/images/k6-kafka/k6-kafka.webp"
tags: []
disable_share: true
omit_header_text: false
type: page
---

## 🔹 **Contexto**

Procedimiento probado en **Ubuntu 24.04** y **SUSE Linux Enterprise Server 15 SP6**.

---

## ✅ **1. Instalar Victoria Metrics**

**VictoriaMetrics** es una base de datos de series temporales, rápida, escalable y económica.

- Descargá la versión *single-node*: [Releases](https://github.com/VictoriaMetrics/VictoriaMetrics/releases/latest)  
- Para este ejemplo (julio 2025) se usó: `victoria-metrics-linux-amd64-v1.120.0.tar.gz`

```bash

tar -zxvf victoria-metrics-linux-amd64-v1.120.0.tar.gz
./victoria-metrics-prod -retentionPeriod=1 -storageDataPath=./victoria-metrics-data

```
🔹 **storageDataPath** VictoriaMetrics almacena todos los datos en este directorio. La ruta predeterminada es victoria-metrics-data el directorio de trabajo actual.

🔹 **retentionPeriod** Retención de datos almacenados. Los datos antiguos se eliminan automáticamente. El periodo de retención predeterminado es de 1 mes (31 días). El periodo mínimo de retención es de 24 horas o 1 día.

![path](/images/k6-vms-grafana/path_victoriametrics.png)

Verificá que esté corriendo:

http://IP:8428/

![path](/images/k6-vms-grafana/site_vms.png)

✅ **2. Instalar Grafana**

Descargar **Standalone Linux Binaries** desde [Grafana Downloads](https://grafana.com/grafana/download)

Ejemplo usado: grafana-12.0.2.linux-amd64.tar.gz

```bash

tar -xzf grafana-12.0.2.linux-amd64.tar.gz

```

![path](/images/k6-vms-grafana/path_grafana.png)

Accedé a Grafana:

http://localhost:3000/

![path](/images/k6-vms-grafana/site_grafana.png)

**user: admin**

**password: admin**

✅ **3.  Conectar Grafana a Victoria Metrics**

**🔹Crear nuevo Data Source.

**🔹Usar VictoriaMetrics como tipo.

Configurar los parámetros básicos.

Guardar y testear.

Se debe crear realizando los siguientes pasos:

![path](/images/k6-vms-grafana/ds_grafana.png)

![path](/images/k6-vms-grafana/new_ds_grafana.png)

En principio, solo setear los siguientes parametros, luego podes editar el resto en base a criterios propios

![path](/images/k6-vms-grafana/prop_ds_grafana.png)

✅ **4. Script de K6**

A modo de sugerencia, el script de K6 debe tener el **tag "name"** que nos ayudara a identificar cada peticion http 
en grafana:

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
    vus: 4,
    duration: '60s',
};

export default function () {
    // Elegir endpoint random
    const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

    // Hacer request con tag `name`
    http.get(`https://httpbin.test.k6.io${ep}`, {
        tags: { name: ep }
    });

    sleep(1);
}
```

Además, podemos tener un bash para facilitar la ejecucion del script de k6 junto a toda la integracion realizada:

```bash
#!/bin/bash

PROM_URL="http://<IP_De_VictoriaMetrics>:8428/api/v1/write"
TREND_STATS="min,avg,med,p(90),p(95),p(99),max"

(
  export K6_PROMETHEUS_RW_TREND_STATS="$TREND_STATS"
  export K6_PROMETHEUS_RW_SERVER_URL="$PROM_URL"
  export K6_PROMETHEUS_RW_PUSH_INTERVAL=1s

  ./k6 run --no-connection-reuse -o experimental-prometheus-rw script.js
)
wait

```

Los siguientes recursos pueden ser de mucha utilidad para enriquecer todo los visto en este post:

**🔹Dashboard de grafana:**

https://github.com/MarianoImende/k6/blob/main/dashboard_grafana/K6%20VictoriaMetrics.json

**🔹full script de k6:**

https://github.com/MarianoImende/k6.git


**📊 Vista del Dashboard de grafana:**  

![path](/images/k6-vms-grafana/dashboard_grafana.png)


🔥 Muchisimos exitos en tu implementación. 🚀


