---
date: "2024-03-14T11:25:05-04:00"
title: "💻 Wiremock como Servicio en Windows"
featured_image: "/images/NSSM/WMNSSM.png"
date: 2024-10-25
tags: ["wiremock", "windows", "testing", "servicios"]
description: "Guía para configurar Wiremock como un servicio en Windows utilizando NSSM."
---

# Wiremock como Servicio en Windows

En esta guía, veremos cómo configurar **Wiremock** como un servicio en Windows, utilizando la herramienta **NSSM (Non-Sucking Service Manager)**, que facilita la instalación y administración de servicios.
**Para el presente ejemplo, WireMock y NSSM deben estar instalados en la misma computadora con sistema operativo Windows y además, respetando los nombres de los directorios de este tutorial.**

## Instalación del Servicio

Para instalar Wiremock como un servicio, utilizaremos **NSSM**. Puedes descargar NSSM desde su sitio oficial: [nssm.cc/download](https://nssm.cc/download).

Una vez descargado, instala el servicio ejecutando el siguiente comando:

```bash
nssm install <nombre_del_servicio>
```
**Nota:** Reemplaza <nombre_del_servicio> con el nombre que desees asignarle al servicio.

**NSSM** permite administrar servicios de forma sencilla desde la línea de comandos.
Consulta más detalles aquí: [nssm.cc/commands](https://nssm.cc/commands).

## Ejemplo de Configuración de Wiremock
Para configurar Wiremock con NSSM (Wiremock debe estar instaldo y configurado previamente), utiliza los siguientes argumentos:
(Configure la versión correspondiente a su java)

![NSSM](/images/NSSM.png)
```
-jar C:\WireMock\wiremock-standalone-3.9.1.jar --port 90 --root C:\WireMock --max-http-client-connections 8000 --jetty-acceptor-threads 8 --verbose

```
El **Port** puede ser cualquiera disponible en su computadora.

## Explicación de los Argumentos

> - **root-dir:** Establece el directorio raíz en el cual residen los mappings y __files. Por defecto, es el directorio actual.
> - **max-http-client-connections:** Define el número máximo de conexiones HTTP simultáneas que el servidor Wiremock permitirá. Útil cuando se simulan muchas solicitudes concurrentes.
> - **jetty-acceptor-threads:** Especifica la cantidad de subprocesos que Jetty usa para aceptar solicitudes entrantes.

Más información sobre configuraciones de Wiremock [aquí](https://wiremock.org/docs/standalone/java-jar/).

## WireMock configuración

Este post no trata de explicar WireMock; existe otro post en este sitio que se dedica con mayor detalle al uso de WireMock. De todas formas, se explicarán las necesidades básicas a nivel de WireMock para poder demostrar el uso de NSSM levantando un servicio de Windows que lo contenga.

Recordando y teniendo presente la estructura de directorio de Wiremock:

![](/images/NSSM/wiremock1.png)

y el archivo json (sesion.json) con la estructura normalmente utilizada por WireMock:

![](/images/NSSM/wiremock2.png)

Contenido de sesion.json:
``` json
{
"mappings": [
  {
    "request": {
            "method": "GET",
            "url": "/test"
           },
          "response": {
            "status": 200,
            "body": "ESTOY AQUÍ"
          }
    }
  ]
}
```
[Descarga e instalacón de WireMock](https://wiremock.org/docs/download-and-installation/).


## Prueba de la Configuración

Puedes probar que el servicio esté funcionando correctamente con el siguiente comando curl:
desde su computadora windows:
```
curl -v -X GET http://<dirección IP>:<puerto>/test
```

**IMPORTANTE**: `<dirección IP>` corresponde a la computadora donde se encuentra instalado y en ejecución WireMock. WireMock debe estar escuchando en el puerto mencionado anteriormente. 

Además, para realizar una prueba y confirmar que el servicio de Windows creado con NSSM quedó funcionando correctamente, se debe disponer de un *stub* (en formato JSON o XML) configurado. En nuestro ejemplo con el comando `curl`, el *stub* responderá a la petición `GET /test`, devolviendo la siguiente respuesta:

Si todo funcionó bien, como resultado de la ejecución del comando `curl` se verá lo siguiente en la consola de *cmd*:

```cmd
curl -v -X GET http://<dirección IP>:<puerto>/test
Note: Unnecessary use of -X or --request, GET is already inferred.
* Host <dirección IP>:<puerto> was resolved.
* IPv6: (none)
* IPv4: <dirección IP>
*   Trying <dirección IP>...
* Connected to <dirección IP>:<puerto>
> GET /test HTTP/1.1
> Host: <dirección IP>:<puerto>
> User-Agent: curl/8.9.1
> Accept: */*
>
* Request completely sent off
< HTTP/1.1 200 OK
< Matched-Stub-Id: ce09bd0a-fb97-41a4-a444-605768146f02
< Transfer-Encoding: chunked
<
ESTOY AQUÍ * Connection #0 to host <dirección IP> left intact
```
[Consultas y sugerencias: ](https://www.automationtesting.ar/contact/).

