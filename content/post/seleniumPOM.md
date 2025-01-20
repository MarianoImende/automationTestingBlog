---
date: "2024-05-10T11:25:04-01:23"
title: "🤖 Selenium POM"
featured_image: "/images/SeleniumPOM/selenium.png"
date: 2024-10-25
tags: ["wiremock", "contractfirst", "testing", "Pirámide de automatización"]
description: "Selenium Webdriver y Python: Automatizacíon de pruebas"
---

# Imlementación

## De que trata este post:

Se presenta un proyecto en base a un "modelo" que implementa POM **(Page Object Model)** con selenium, python y pytest.

[Page Objecto Model](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
[selenium](https://www.selenium.dev/)
[python](https://www.python.org/)
[pytest](http://pytest.org/)

## Por qué el proyecto es útil

Descargando e implementando este proyecto puede lograr disponer en muy corto tiempo la posibilidad de automatizar sus pruebas de frontend.

Este proyecto, le otorga un marco de trabajo simple y a la vez robusto que le ayudará a comenzar rápidamente sus automatizaciones de pruebas. El mismo, contiene los ejemplos de **Page, Test y BasePage**

## Cómo pueden comenzar los usuarios con el proyecto

Los siguientes pasos lo guiaran para lograr implementar el proyecto en Windows:

    > - 1. Instalar Python. (c:/Python)
    > - 2. Descargar y descomprimir el repor o Clonar el repositorio.
    > - 3. Crear entorno virtual (python -m venv venv y activarlo "venv/Script/activate") en el directorio local.
    > - 4. Instalar dependencias : pip install -r requirements.txt

 [descargue o clone el proyecto desde aquí](https://github.com/MarianoImende/SimpleSeleniumPOM.git)

Atenti!

Si deseas que [webdriver-manager](https://pypi.org/project/webdriver-manager/) gestione automáticamente las actualizaciones del driver de chrome y tu script va a ejecutarse en un entorno corporativo donde las conexiones a internet sales por medio de un **proxy**, debes editar el archivo **.\Lib\site-packages\webdriver_manager\core\http.py** según la imagen siguiente:

## Dónde pueden recibir ayuda los usuarios?

Escribiendo a: [imende.mariano@gmail.com] o [contacto](https://www.automationtesting.ar/contact/)
