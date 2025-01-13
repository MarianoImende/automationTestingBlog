---
date: "2024-06-12T11:13:05-04:00"
title: "📈 Web dashboard en k6"
featured_image: "/images/k6/k6.png"
date: 2024-10-25
tags: ["stress", "performance", "testing"]
description: "Guía para utilizar Web dashboard en K6 para pruebas de Performance"
---

# 📉 Web dashboard

**k6** proporciona un panel web integrado que puede habilitar para visualizar y monitorear los resultados de sus pruebas en **tiempo real**


![web-dashboard](/images/k6/web-dashboard.png)

# Cómo utilizar

El panel web es una función integrada de k6. se puede habilitarl configurando la variable de entorno **K6_WEB_DASHBOARD** en **true** cuando ejecute su script de prueba, por ejemplo:

**export K6_WEB_DASHBOARD=true**

De forma predeterminada, el panel web está disponible en el puerto localhost 5665

EL siguiente es un ejemplo completo en entorno Linux, es decir, el script (init.js) se encuentra en un servidor linux
en el cual se creo un archivo con extension **sh** (scripts de intérprete de comandos de Bash de Unix) para fasilitar la ejecución:

```

export K6_WEB_DASHBOARD=true            # Habilitar el Dashboard
export K6_WEB_DASHBOARD_PORT=5665       # Puerto de eschucha del Dashboard
export K6_WEB_DASHBOARD_HOST=0.0.0.0    # Host al que vincular el Dashboard
export K6_WEB_DASHBOARD_PERIOD=2s       # Periodo en segundos para actualizar el Dashboard

/opt/k6/k6 run --no-connection-reuse /opt/scriptK6/init.js

```
💡 Como dato adicional, se utiliza el parámetro **--no-connection-reuse** para simular una conexion por cada peticion http encviada:

- Usa --no-connection-reuse si quieres simular un escenario donde cada cliente abre una conexión nueva para cada transacción, como lo harían algunos clientes sin estado. Si los clientes que acceden a tu API no reutilizan conexiones
debes utilizar el parametro **--no-connection-reuse**. Forzar nuevas conexiones aumenta artificialmente el tiempo de respuesta debido al handshake

- No uses esta opción si buscas emular el comportamiento más eficiente de clientes modernos o aplicaciones que aprovechan conexiones persistentes. Si los clientes que acceden a tu API reutilizan conexiones (como lo hacen los navegadores con HTTP/1.1 o HTTP/2) o connection: keep-alive en los encabezados HTTP: Este encabezado es solo una solicitud del cliente (tu script) para que el servidor mantenga la conexión abierta después de completar la solicitud.

El encabezado Connection: keep-alive es clave para comprender cómo se reutilizan las conexiones TCP en HTTP, y tiene un impacto directo en cómo se comportan los clientes y servidores en términos de manejo de conexiones.
