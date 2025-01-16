---
date: "2025-01-13T11:10:04-04:00"
title: "📈 Binario en k6"
featured_image: "/images/k6/k6.png"
date: 2024-07-13
tags: ["stress", "performance", "testing"]
description: "Guía para generar un binario/ejecutable con extensiones de k6"
---

# Que es una Extension?

Las extenciones son funcioanlidades que se agregan a la version estandar de k6, Las extensiones son desarrolladas tanto por los desarrolladores de k6 como por la comunidad.

Algunas de las extenciones son:

- k6-chai (Chai es una biblioteca de aserciones para frameworks de JavaScript )
- k6 web dashboard (Agrega un dashboard html embebido)
- k6-output-influxdb (Con la extensión InfluxDB , puede almacenar métricas k6 en InfluxDB v2.0 y analizar sus resultados de con Grafana u otras herramientas .

![Explorar las extensiones de k6](https://grafana.com/docs/k6/latest/extensions/explore/)

Para lograr este nuevo ejecutable para distribuciones de Linux es mejor generarlo desde un sistema Linux, normalmente trabajamos con una computadora con Windows (al menos es mi caso) entonces vamos a utilizar WSL para montar una distribucion de Linux en nuestro Wwindows.

# ¿Qué es el subsistema de Windows para Linux (WSL)?

El Subsistema de Windows para Linux (WSL) es una característica de Windows que le permite ejecutar un entorno Linux en su máquina Windows

Prerrequisitos
Debes tener instalada la versión 2004 o posterior de Windows 10 (Build 19041 o posterior) o Windows 11 

# Instalar comando WSL

Abra PowerShell o el Símbolo del sistema de Windows en modo administrador haciendo clic derecho y seleccionando "Ejecutar como administrador", ingrese el comando:

```cmd
wsl --install SUSE Linux Enterprise 15 SP6
```
y luego reinicie su equipo.

Este comando habilitará las funciones necesarias para ejecutar WSL e instalar la distribución SUSE Linux Enterprise 15 SP6 de Linux.

# Configura tu nombre de usuario y contraseña de Linux

Una vez que se haya completado el proceso de instalación de su distribución Linux con WSL, abra la distribución (SUSE Linux Enterprise 15 SP6) mediante el menú Inicio. Se le solicitará que cree un nombre de usuario y una contraseña para su distribución Linux.
Este nombre de usuario y contraseña son específicos para cada distribución de Linux que instale y no tienen relación con su nombre de usuario de Windows.
Tenga en cuenta que, al ingresar la contraseña , no aparecerá nada en la pantalla. Esto se denomina escritura a ciegas.
Esta cuenta será considerada como administrador de Linux, con capacidad de ejecutar sudocomandos administrativos (Super User Do).

# Instalacion de Go

k6 esta desarrollado en JavaScript y Go, para generar nuestro nuevo ejecutable es necesario instalar Go:

![DESCARGAR GO]((https://go.dev/))

- En el presente ejemplo, vamos a descargar la version:
```linux
go1.23.4.linux-amd64.tar.gz**
```

- Luego, aprovechando del explorador de archivos de Windows, navegamos hasta nuestro SUSE Linux Enterprise 15 SP6 y vamos a dejar el archivo descargado en:

```linux
/tmp/go1.23.4.linux-amd64.tar.gz
```

- Abra la distribución (SUSE Linux Enterprise 15 SP6) mediante el menú Inicio.

Por medio de comandos, eliminar posibles instalaciones anteriores en "/usr/local/" (es un lugar donde el administrador de un sistema operativo instala software que puede ser utilizado por todos los usuarios):

```linux
sudo rm -rf /usr/local/go**
```

- Desde el directorio donde esta el archivo descargado (go1.23.4.linux-amd64.tar.gz), 
descomprimir y dejar en : /usr/local, se crea automaticamente la carpeta go.

```linux
/tmp tar -C /usr/local -xzf go1.23.4.linux-amd64.tar.gz**
```

- Setear variables de entorno necesarias:

```linux
export PATH=$PATH:/usr/local/go/bin
export GOPATH=/tmp/xk6** (chequear!!!)
```

NOTA: GOPATH no debe ser la misma ruta que su instalación de Go. 

- Chequear el valor de las cariables seteadas en el paso anterior:

```linux
go env GOPATH
go version
```

# INSTALAR xk6!

¿Qué es xk6?
xk6 - Generador personalizado de k6 . Esta herramienta de línea de comandos y el paquete Go asociado facilitan la creación de compilaciones personalizadas de k6. Es muy utilizada por los desarrolladores de extensiones de k6, así como por cualquiera que desee crear binarios personalizados de k6 (con o sin extensiones)

ejecutar:

```linux
go install go.k6.io/xk6/cmd/xk6@latest**
```

# Crear el binario de k6 final:

Ahora si, tenemos que ejecutar la siguiente sentencias para generar nuetra verion de k6 personalizadas con las extenciones detalladas en los parametros:

```linux
xk6 build --verbose --with github.com/grafana/xk6-dashboard@latest --with github.com/grafana/xk6-output-influxdb --with github.com/oleiade/xk6-kv --with github.com/gpiechnik2/xk6-httpagg@latest --with github.com/avitalique/xk6-file@latest**

```

Espero que todo te funcione de maravillas, Exitos!!! 🤞




