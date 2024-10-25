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
