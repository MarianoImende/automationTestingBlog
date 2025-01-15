---
date: "2024-07-13T11:10:04-04:00"
title: "📈 Web dashboard en k6"
featured_image: "/images/k6/k6.png"
date: 2024-07-13
tags: ["stress", "performance", "testing"]
description: "Guía para utilizar Web dashboard en K6 para pruebas de Performance"
---

# 📉 Web dashboard

**k6** proporciona un panel web integrado que puede habilitar para visualizar y monitorear los resultados de sus pruebas en **tiempo real**


![web-dashboard](/images/k6/web-dashboard.png)

# Cómo utilizar

El panel web es una función integrada de k6. se puede habilitar configurando la variable de entorno **K6_WEB_DASHBOARD** en **true** cuando ejecute su script de prueba, por ejemplo:

```linux
export K6_WEB_DASHBOARD=true**
```

De forma predeterminada, el panel web está disponible en el puerto localhost 5665

EL siguiente es un ejemplo completo en Linux, es decir, el script (init.js) se encuentra en un servidor linux
en el cual se creo un archivo con extensión **sh** (scripts de intérprete de comandos de Bash de Unix) para facilitar la ejecución:

```
export K6_WEB_DASHBOARD=true            # Habilitar el Dashboard
export K6_WEB_DASHBOARD_PORT=5665       # Puerto de eschucha del Dashboard
export K6_WEB_DASHBOARD_HOST=0.0.0.0    # Host al que vincular el Dashboard
export K6_WEB_DASHBOARD_PERIOD=2s       # Periodo en segundos para actualizar el Dashboard

/opt/k6/k6 run --no-connection-reuse /opt/scriptK6/init.js

```
 👉 **binario K6 listo para éste ejemplo:**  [github](https://github.com/MarianoImende/binario_k6_v1/tree/main/k6v1)

 👉 **compilelo usted mismo:**  [github](https://github.com/grafana/xk6-dashboard)
 
Para acceder al **Web Dashboard** por medio del navegador de tu workstation debes ingrsar a: http://IP:5665/
**IP:** Es la dirección IP del servidor Linux donde ejecutas tu script de K6.

💡 Como dato adicional, se utiliza el parámetro **--no-connection-reuse** para simular una conexión por cada petición http enviada:

- Usa --no-connection-reuse si quieres simular un escenario donde cada cliente abre una conexión nueva para cada transacción, como lo harían algunos clientes sin estado. Si los clientes que acceden a tu API no reutilizan conexiones
debes utilizar el parámetro **--no-connection-reuse**. Forzar nuevas conexiones aumenta artificialmente el tiempo de respuesta debido al handshake

- No uses esta opción si buscas emular el comportamiento más eficiente de clientes modernos o aplicaciones que aprovechan conexiones persistentes. Si los clientes que acceden a tu API reutilizan conexiones (como lo hacen los navegadores con HTTP/1.1 o HTTP/2) o connection: keep-alive en los encabezados HTTP: Este encabezado es solo una solicitud del cliente (tu script) para que el servidor mantenga la conexión abierta después de completar la solicitud.

El encabezado Connection: keep-alive es clave para comprender cómo se reutilizan las conexiones TCP en HTTP, y tiene un impacto directo en cómo se comportan los clientes y servidores en términos de manejo de conexiones.

# Sugerencia de script de prueba:

```javascript
import { sleep } from 'k6';
import { check } from 'k6';
import { Counter } from 'k6/metrics';
import http from 'k6/http';

// Define metricas personalizadas para cada check
let checkMetrics = {
  'status_200': new Counter('check_status_200'),
  'status_201': new Counter('check_status_201'),
    
  'status_400': new Counter('check_status_400'),
  'status_401': new Counter('check_status_401'),
  'status_403': new Counter('check_status_403'),
  'status_404': new Counter('check_status_404'),
  'status_408': new Counter('check_status_408'),
  'status_418': new Counter('check_status_418'),
        
  'status_500': new Counter('check_status_500'),
  'status_502': new Counter('check_status_502'),
  'status_503': new Counter('check_status_503'),
  'status_504': new Counter('check_status_504'),
  'status_507': new Counter('check_status_507'),
  'status_508': new Counter('check_status_508'), 
  
  'status_0': new Counter('check_status_0'),

  'response_time_2s': new Counter('check_response_time_2s'),
  'body_login_successful': new Counter('check_body_login_successful'),
  'content_type_json': new Counter('check_content_type_json'),
  };
  
export const options = {
 
insecureSkipTLSVerify: true, 
    scenarios: {
        ramp_up_and_constant_rate: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 1000,
            maxVUs: 10000,
            stages: [
                { duration: '5s', target: 5 },
                { duration: '5s', target: 10 },
                { duration: '5s', target: 15 },
                { duration: '5s', target: 20 },
                { duration: '5s', target: 25 },
                { duration: '5s', target: 30 },
                { duration: '30s', target: 35 },
                { duration: '3s', target: 30 },
                { duration: '3s', target: 25 },
                { duration: '3s', target: 15 },
		{ duration: '3s', target: 10 },
                { duration: '3s', target: 5 },
            ],
        },
    },
};

// Array de status code
const statusesToCheck = [200, 201, 0, 400, 401, 403, 404, 408, 418, 500, 502, 503, 504, 507, 508];
 
const body = {
  "solution": "AJT",
  "customerid": "123",
  "activitytype": "LOGIN",
  "biometriclogin1": false,
  "language": "Spanish",
  "loginMethod": "password",
  "usercountry": "PY"
}
 
const params = {
  headers: {
    'Content-Type': 'application/json',
    'X-id': '9999',
    'X-trace-id': '123e4567-e89b-42d3-a456-556642440000',
    'Authorization': 'Bearer eyJhbGc2213.3iJ9.eyJzdWIiOiJTVl9TUEZfQ0xJRU5U46o_X7YfW0GXAd64o54CuflBgOjnqlc'
    }
};

export default function () {  
 
   let response = http.post('https://miurl',JSON.stringify(body),params);

   sleep(1);

for (let i = 0; i < statusesToCheck.length; i++) {
  let status = statusesToCheck[i];
  // Check si el status del response coincide con valor del array:
  let result = check(response, {
      [`is status ${status}`]: (r) => r.status === status, // uso de "template literals"
  });
  // actualizo el contdor de http code
  checkMetrics[`status_${status}`].add(result ? 1 : 0); // uso de "template literals"
}
    
  // Check Si response time NO es <= 2s
  let resultResponseTime = check(response, { 'is response time <= 2s': (r) => r.timings.duration <= 2000 });
  checkMetrics['response_time_2s'].add(resultResponseTime ? 0 : 1);
 
  // Check Si el body NO contiene "Login successful"
  let resultBodyLogin = check(response, { 'body contains Login successful': (r) => r.body && r.body.includes('initiated') });
  checkMetrics['body_login_successful'].add(resultBodyLogin ? 0 : 1);
 
  // Check si Content-Type NO es application/json
  let resultContentType = check(response, { 'Content-Type is application/json': (r) => r.headers['Content-Type'] === 'application/json' });
  checkMetrics['content_type_json'].add(resultContentType ? 0 : 1);
 
}

```

Luego de definir las métricas personalizadas para cada check, podemos observar en el **web-dashboard** lo siguiente:

![web-dashboard](/images/k6/K6_Metric_custom.png)

Espero que todo te funcione de maravillas, Exitos!!! 🤞
