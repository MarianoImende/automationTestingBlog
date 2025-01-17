---
date: "2025-01-13T11:10:04-04:00"
title: "🛠️ Construir binario de k6"
featured_image: "/images/k6/k6.png"
date: 2024-07-13
tags: ["stress", "performance", "testing"]
description: "Guía paso a paso para personalizar k6 con extensiones en WSL"
---

# Creando una guía detallada para instalar y personalizar k6 utilizando extensiones, WSL y Go en un sistema Windows.

Esta guía te mostrará cómo instalar y personalizar k6 con extensiones, utilizando el Subsistema de Windows para Linux (WSL) y Go. Al final, podrás generar un binario personalizado de k6 con las extensiones que necesites.

## Que es una Extension? 🛠️

Las extensiones son funcionalidades que se agregan a la version estandar de k6, Las extensiones son desarrolladas tanto por los desarrolladores de k6 como por la comunidad.

Ejemplos de extensiones populares::

- k6-chai (Chai es una biblioteca de aserciones para frameworks de JavaScript )
  
- k6 web dashboard (Agrega un dashboard html embebido)
  
- k6-output-influxdb (Con la extensión InfluxDB , puede almacenar métricas k6 en InfluxDB v2.0 y analizar sus resultados de con Grafana u otras herramientas .

[Explorar las extensiones de k6](https://grafana.com/docs/k6/latest/extensions/explore/) 📚

Para lograr este nuevo ejecutable para distribuciones de Linux es mejor generarlo desde un sistema Linux, normalmente trabajamos con una computadora con Windows (al menos es mi caso) entonces vamos a utilizar WSL para montar una distribucion de Linux en nuestro Windows.

## ¿Qué es el subsistema de Windows para Linux (WSL)?

El Subsistema de Windows para Linux (WSL) es una característica de Windows que le permite ejecutar un entorno Linux en su máquina Windows

## Prerrequisitos ✅

Debés tener:

- Windows 10 (versión 2004 o posterior, Build 19041 o superior) o Windows 11

## Paso 1: Instalar el Subsistema de Windows para Linux (WSL) 🐧

Abra PowerShell o el Símbolo del sistema de Windows en modo administrador haciendo clic derecho y seleccionando "Ejecutar como administrador", ingresar el comando:

```cmd

wsl --install Ubuntu

```
Este comando instalará Ubuntu (debes especificar usuario y password admin) en tu computadora con Windows:

```cmd
C:\WINDOWS\system32>wsl "--install Ubuntu"
Instalando: Ubuntu
Se ha instalado Ubuntu.
Iniciando Ubuntu...
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: "<nombre de usuario>"
New password:"<escritura a ciegas de la password>"
Retype new password:"<escritura a ciegas de la password>"
passwd: password updated successfully
Installation successful!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 24.04.1 LTS (GNU/Linux 5.15.167.4-microsoft-standard-WSL2 x86_64)
```
Tal vez, deba reiniciar tu equipo 🔄

Algunos comando utiles WSL y algunas anotaciones:

```bash
wsl --install <Distribution Name>                         :Instalar una distribución
wsl --distribution <Distribution Name> --user <User Name> :Ejecutar una distribución
wsl --update
wsl --version
wsl --unregister <DistributionName>                       :Dar de baja una distribucón
wsl --shutdown
wsl --terminate <Distribution Name>
wsl --list --verbose
wsl --list --online
```

## Paso 2: Instalar Go 🐹

k6 está desarrollado en JavaScript y Go, por lo que es necesario instalar Go para construir un binario personalizado.

[Ve al sitio oficial de Go:](https://go.dev/dl/) 📥

- En el presente ejemplo, vamos a descargar e instalar la versión:
  
```bash

go1.23.4.linux-amd64.tar.gz

```

- Mové el archivo descargado al directorio /tmp en tu distribución Linux, podes usar el explorador de archivos de Windows.

```bash

/tmp/go1.23.4.linux-amd64.tar.gz

```

Eliminá posibles instalaciones previas de Go: (" /usr/local/" es un lugar donde el administrador de un sistema operativo instala software que puede ser utilizado por todos los usuarios):

```bash

sudo rm -rf /usr/local/go

```
**sudo:** permite a los usuarios ejecutar programas con los privilegios de seguridad usuario root (Admin) 

- Descomprimir el archivo descargado e instala Go en **/usr/local**:

```bash

sudo tar -C /usr/local -xzf /tmp/go1.23.4.linux-amd64.tar.gz

```

- Configuración de variables de entorno (temporal) 🌐

```bash

export PATH=$PATH:/usr/local/go/bin

export GOPATH=/tmp/xk6

export PATH=$PATH:/tmp/xk6/bin

```

NOTA: GOPATH no debe ser la misma ruta que su instalación de Go. 

- Verificá que Go y las variables de entorno estén correctamente configurados:

```bash

go env GOPATH
go version
echo $PATH

```

## Paso 3: Instalar xk6 🔧

**¿Qué es xk6?**

xk6 es una herramienta de línea de comandos que permite generar compilaciones (ejecutables) personalizadas de k6, con o sin extensiones.

Ejecutá el siguiente comando para instalar **xk6**:

```bash

go install go.k6.io/xk6/cmd/xk6@latest

```
latest: Instalar la última versión disponible.

## Paso 4: Crear un binario personalizado (ejecutable) de k6 🖥️

Una vez que tengas xk6 instalado, podes generar un binario personalizado de k6 con las extensiones que necesites.

Ejecutá el siguiente comando, especificando las extensiones que deseas incluir:

```bash

xk6 build --with github.com/grafana/xk6-dashboard@latest --with github.com/grafana/xk6-output-influxdb --with github.com/oleiade/xk6-kv --with github.com/gpiechnik2/xk6-httpagg@latest --with github.com/avitalique/xk6-file@latest

```
las extensiones específicas (xk6-dashboard, etc.) son opcionales y el lector puede adaptarlas según sus necesidades.

**Ubicación del binario generado 📁:**

El nuevo binario de **k6** se creará en el directorio indicado al finalizar la creación (puede variar segun la distribución elegida):

```bash

xk6 has now produced a new k6 binary which may be different than the command on your system path!
Be sure to run './k6 run <SCRIPT_NAME>' from the '/home/<nombre de usuario>' directory.

```

## Paso 5: Probar el binario personalizado 🧪

Copiá el binario generado al servidor de funciona como generador de carga de k6, puedes incluido en tu PATH, por ejemplo:
Ejecutá un script de prueba para asegurarte de que el binario funcione correctamente:

```cmd

k6 run test.js

```

Donde test.js es un script de prueba básico incluyendo el uso de cada nueva funcionalidades implementando los ejemplo en github:

https://github.com/grafana/xk6-dashboard

https://github.com/grafana/xk6-output-influxdb

https://github.com/dgzlopes/xk6-kv

https://github.com/gpiechnik2/xk6-httpagg

https://github.com/avitalique/xk6-file


Espero que todo te funcione de maravillas, Exitos!!! 🤞

## Conclusión 🎉

Con estos pasos, has instalado WSL, configurado Go, instalado xk6 y generado un binario personalizado de k6 con extensiones. Ahora estás listo para ejecutar pruebas de carga avanzadas con las funcionalidades adicionales que estas extensiones proporcionan.

¡Buena suerte y éxito en tus pruebas! 🙏

## Recursos adicionales:

Documentación oficial de k6 : https://grafana.com/docs/k6/latest/

Extensiones de k6 : https://grafana.com/docs/k6/latest/extensions/explore/

Instalación de Go : https://go.dev/doc/install
