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

Para lograr este nuevo ejecutable para distribuciones de Linux es mejor generarlo desde un sistema Linux, normalmente trabajamos con una computadora con Windows (al menos es mi caso) entonces vamos a utilizar WSL para montar una distribucion de Linux en nuestro Wwindows.

## ¿Qué es el subsistema de Windows para Linux (WSL)?

El Subsistema de Windows para Linux (WSL) es una característica de Windows que le permite ejecutar un entorno Linux en su máquina Windows

## Prerrequisitos ✅

Debes tener:

- Windows 10 (versión 2004 o posterior, Build 19041 o superior) o Windows 11

## Paso 1: Instalar el Subsistema de Windows para Linux (WSL) 🐧

Abra PowerShell o el Símbolo del sistema de Windows en modo administrador haciendo clic derecho y seleccionando "Ejecutar como administrador", ingrese el comando:

```cmd
wsl --install SUSE Linux Enterprise 15 SP6
```
y luego reinicie su equipo 🔄

Este comando habilitará las funciones necesarias para ejecutar WSL e instalar la distribución SUSE Linux Enterprise 15 SP6 de Linux.

- Configura tu nombre de usuario y contraseña de Linux

Una vez que se haya completado el proceso de instalación de su distribución Linux con WSL, abra la distribución (SUSE Linux Enterprise 15 SP6) mediante el menú Inicio. Se le solicitará que cree un nombre de usuario y una contraseña para su distribución Linux.
Este nombre de usuario y contraseña son específicos para cada distribución de Linux que instale y no tienen relación con su nombre de usuario de Windows.
Tenga en cuenta que, al ingresar la contraseña , no aparecerá nada en la pantalla. Esto se denomina escritura a ciegas 🔒.
Esta cuenta será considerada como administrador de Linux, con capacidad de ejecutar sudocomandos administrativos (Super User Do).

```cmd
C:\WINDOWS\system32>wsl --install Debian
Instalando: Debian GNU/Linux
Se ha instalado Debian GNU/Linux.
Iniciando Debian GNU/Linux...
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: nombredeusuario
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
usr@equipoUno:~$
```
Algunos comando utiles:

wsl --install <Distribution Name>
wsl --distribution <Distribution Name> --user <User Name> :ejecutar una distribución
wsl --update
wsl --version
wsl --unregister <DistributionName>
wsl --shutdown
wsl --terminate <Distribution Name>
wsl --list --verbose
wsl --list --online

## Paso 2: Instalar Go 🐹

k6 está desarrollado en JavaScript y Go, por lo que es necesario instalar Go para construir un binario personalizado.

![Ve al sitio oficial de Go:](https://go.dev/dl/) 📥

- En el presente ejemplo, vamos a descargar la versiÓn:
```linux
go1.23.4.linux-amd64.tar.gz
```

- Mueve el archivo descargado al directorio /tmp en tu distribución Linux utilizando el explorador de archivos de Windows.

```linux
/tmp/go1.23.4.linux-amd64.tar.gz
```

- Abra la distribución (SUSE Linux Enterprise 15 SP6) mediante el menú Inicio y ejecuta los siguientes comandos:

Elimina posibles instalaciones previas de Go: (es un lugar donde el administrador de un sistema operativo instala software que puede ser utilizado por todos los usuarios):

```linux
sudo rm -rf /usr/local/go  1111
```

- Descomprime el archivo descargado e instala Go en /usr/local y dar permisos full:

```linux

sudo chmod -R 777 /tmp/go1.23.4.linux-amd64.tar.gz
sudo chmod 777 /tmp/go1.23.4.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf /tmp/go1.23.4.linux-amd64.tar.gz 1111



```


- Configuración de variables de entorno (temporal) 🌐

```linux
export PATH=$PATH:/usr/local/go/bin 11111111

export GOPATH=/tmp/xk6 (chequear!!!)  11111111
```

NOTA: GOPATH no debe ser la misma ruta que su instalación de Go. 

- Verifica que Go esté instalado correctamente:

```linux
go env GOPATH 111
go version 1111
```

## Paso 3: Instalar xk6 🔧

**¿Qué es xk6?**

xk6 es una herramienta de línea de comandos que permite generar compilaciones personalizadas de k6, con o sin extensiones.

Ejecuta el siguiente comando para instalar xk6::

```linux
go install go.k6.io/xk6/cmd/xk6@latest
```

Si surge un error similar a:

```linux
go: go.k6.io/xk6/cmd/xk6@latest: module go.k6.io/xk6/cmd/xk6: Get "https://proxy.golang.org/go.k6.io/xk6/cmd/xk6/@v/list": dial tcp: lookup proxy.golang.org on <IP>:53: read udp <IP>:59902->172.18.96.1:53: i/o timeout
```
Abra el símbolo del sistema como administrador y escriba estos comandos:
```cmd
netsh winsock reset 
netsh int ip reset all
netsh winhttp reset proxy
ipconfig /flushdns
```
Reinicie su máquina.
intente nuevamente el Paso 3.

## Paso 4: Crear un binario personalizado de k6 🖥️

Una vez que tengas xk6 instalado, puedes generar un binario personalizado de k6 con las extensiones que necesites.

Comando para generar el binario:
Ejecuta el siguiente comando, especificando las extensiones que deseas incluir:

```linux

xk6 build --verbose --with github.com/grafana/xk6-dashboard@latest --with github.com/grafana/xk6-output-influxdb --with github.com/oleiade/xk6-kv --with github.com/gpiechnik2/xk6-httpagg@latest --with github.com/avitalique/xk6-file@latest**

```
las extensiones específicas (xk6-dashboard, etc.) son opcionales y el lector puede adaptarlas según sus necesidades.

Ubicación del binario generado 📁

El nuevo binario de **k6** se creará en el directorio temporal:

```linux
tmp/
```

## Paso 5: Probar el binario personalizado 🧪

1 Copia el binario generado a un directorio incluido en tu PATH, por ejemplo:

```linux
cp /tmp/k6 /usr/local/bin/k6
```

2 Ejecuta un script de prueba para asegurarte de que el binario funcione correctamente:

```linux
k6 run test.js
```
Donde test.js es un script de prueba básico.

Espero que todo te funcione de maravillas, Exitos!!! 🤞

## Conclusión 🎉

Con estos pasos, has instalado WSL, configurado Go, instalado xk6 y generado un binario personalizado de k6 con extensiones. Ahora estás listo para ejecutar pruebas de carga avanzadas con las funcionalidades adicionales que estas extensiones proporcionan.

¡Buena suerte y éxito en tus pruebas! 🙏

## Recursos adicionales:

Documentación oficial de k6 : https://grafana.com/docs/k6/latest/

Extensiones de k6 : https://grafana.com/docs/k6/latest/extensions/explore/

Instalación de Go : https://go.dev/doc/install
