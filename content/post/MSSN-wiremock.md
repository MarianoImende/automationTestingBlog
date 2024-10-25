---
date: "2024-03-14T11:25:05-04:00"
title: "Wiremock como Servicio en Windows"
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



[Descarga e instalacón de WireMock](https://wiremock.org/docs/download-and-installation/).


## Prueba de la Configuración

Puedes probar que el servicio esté funcionando correctamente con el siguiente comando curl:
desde su computadora windows:
```
curl -v -X GET http://<dirección IP>:<puerto>/test
```
IMPORTANTE!
<dirección IP>:<puerto> son los correspondientes a la computadora donde se encuentra instalado y en ejecución WireMock.
WireMock debe estar escuchando en el port mencionado anteriormente y ademas, para realizar una prueba y saber si el servicio Windows que se creo con NSSM quedo funcionando correctamente, se debe disponer de un stub (json o xml) configurado, en nustro ejemplo del **curl** el stub respondera a la peticion **GET: /test** devolviendo el siguiente response:

```
curl -v -X GET http://<dirección IP>:<puerto>/test
``` 


