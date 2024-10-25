---
date: "2024-03-14T11:25:05-04:00"
title: "Wiremock como Servicio en Windows"
date: 2024-10-25
tags: ["wiremock", "windows", "testing", "servicios"]
description: "Guía para configurar Wiremock como un servicio en Windows utilizando NSSM."
---

# Wiremock como Servicio en Windows

En esta guía, veremos cómo configurar **Wiremock** como un servicio en Windows, utilizando la herramienta **NSSM (Non-Sucking Service Manager)**, que facilita la instalación y administración de servicios.

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
Para configurar Wiremock con NSSM, utiliza los siguientes argumentos:
```
-jar C:\WireMock\wiremock-standalone-3.9.1.jar --port 90 --root C:\WireMock --max-http-client-connections 8000 --jetty-acceptor-threads 8 --verbose

```
