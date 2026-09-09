---
title: "📱 Setup Appium con Python + Pytest (Android)"
featured_image: "/images/appium/0.webp"
date: 2024-07-13
tags: ["appium", "android", "pytest", "automatizacion"]
description: "Guía completa para preparar una laptop nueva y dejarla lista para automatizar tests con Python + Pytest + Appium (Android)."
---

# 📱 Setup Appium con Python + Pytest (Android)

Guía completa para preparar una laptop nueva y dejarla lista para automatizar tests con **Python + Pytest + Appium (Android)**.

---

## 1. Preparar la máquina

- Instalar **Python 3.x** desde la página oficial
- Marcar **Add Python to PATH** durante la instalación

## 2. IDE / Editor

- Instalar **Visual Studio Code**

---

## 3. Java + Android SDK (para poder usar UiAutomator2)

- Instalar un **JDK**, preferentemente Temurin. (ruta de instalación opcional, por ejemplo: C:\jdk-21.0.10.7-hotspot)
  (https://adoptium.net/es/temurin/releases)
  
- Configurar variables de entorno de usuario. Presiona las teclas **Windows + R** en tu teclado:
  rundll32.exe sysdm.cpl,EditEnvironmentVariables

  - JAVA_HOME
  - PATH
    
![ANDROID_HOME](/images/appium/1.png)

---
 
![ANDROID_HOME](/images/appium/2.png)

---

## 4. Instalar SDK de Android y sus herramientas de línea de comandos

### Opción 1: Instalar Android Studio (Solo si necesitas emular dispositivos, caso contrario busca más abajo opción 2)

Android Studio (Solo si necesitas emular dispositivos).
El Gestor de Emuladores (AVD Manager): Si no tenes un teléfono Android real conectado por USB y necesitas crear dispositivos virtuales (emuladores) para correr tus pruebas, Android Studio te permite crearlos y configurarlos con tres clics.

- 1 https://developer.android.com/

- 2 Configurar las variable de entorno `ANDROID_HOME` apuntando al SDK

Si se instala Android Studio, normalmente el SDK queda en:
C:\Users\<usuario>\AppData\Local\Android\Sdk

![ANDROID_HOME](/images/appium/3.png)

 "Es probable que la carpeta AppData se encuentre oculta":

![ANDROID_HOME](/images/appium/4.png)


- Agregar `%ANDROID_HOME%\platform-tools` al `PATH`

![ANDROID_HOME](/images/appium/5.png)

- Verificar que funciona:

```bash
adb version
```
![ANDROID_HOME](/images/appium/6.png)

El estado correcto del dispositivo debe ser `device`.
Si aparece `unauthorized` u `offline`, Appium no podrá iniciar la sesión.

---

### Opción 2: Instalar Android SDK Platform Tools (Para utilizar teléfonos reales)

No es necesario instalar Android Studio completo.
Se debe descargar Android SDK Platform Tools desde la web oficial de Android Developers.

Buscar en el navegador: **Android SDK Platform Tools** o buscarlo en https://developer.android.com/tools/releases/platform-tools
(Descargar la versión para Windows y descomprimir el archivo .zip: platform-tools-latest-windows.zip")

Ruta recomendada:
```
C:\Android\platform-tools
```
Dentro de esa carpeta debe existir el archivo:
```
adb.exe
```
Ejemplo:
```
C:\Android\platform-tools\adb.exe
```
Configurar variables de entorno:
Appium necesita conocer dónde está instalado el SDK de Android.

Hay que crear estas variables de entorno:

```
ANDROID_HOME=C:\Android
ANDROID_SDK_ROOT=C:\Android
```
Y agregar a la variable Path:
```
C:\Android\platform-tools
```
Importante: ANDROID_HOME y ANDROID_SDK_ROOT no deben apuntar a platform-tools, sino a la carpeta raíz:

Correcto: ANDROID_HOME=C:\Android
Incorrecto: ANDROID_HOME=C:\Android\platform-tools

Validar instalación de ADB:
Abrir PowerShell y ejecutar:
```
adb version
```
Debe responder algo similar a:
```
Android Debug Bridge version ...
```
El estado correcto del dispositivo debe ser `device`.
Si aparece `unauthorized` u `offline`, Appium no podrá iniciar la sesión.

## 5. Node.js

- Instalar **Node.js LTS**
  
![ANDROID_HOME](/images/appium/7.png)

- Validar instalación

```bash
node --version
v24.4.1
```
---

## 6. Instalar Appium Server

```bash
npm install -g appium
```
![ANDROID_HOME](/images/appium/8.png)

- validar instalación:

```bash
appium -v
```
---

## 7. Instalar el driver de Android:

```bash
appium driver install uiautomator2
```
![ANDROID_HOME](/images/appium/9.png)

---

## 8. Ejecutar Appium

```bash
appium
```
![ANDROID_HOME](/images/appium/10.png)

---

## 9. Configurar celular Android

- Activar Opciones de desarrollador:
  Ajustes → Acerca del teléfono → tocar varias veces “Número de compilación”.

- Activar Depuración USB en Opciones de desarrollador.
  Conectar el celular por USB a la laptop y aceptar el mensaje de “Permitir depuración USB”.

- Verificar que ADB lo ve:

```bash
adb devices
```
![ANDROID_HOME](/images/appium/11.png)

(Opcional) Ajustar bloqueo de pantalla:
- Dejar un PIN numérico simple si querés usar unlock automático con Appium.
- Desactivar biometría (huella) si te molesta para los tests.

---

## 10. Entorno Python para los tests

```bash
mkdir appium-tests
cd appium-tests
python -m venv venv
venv\Scripts\activate
```

---

## 11. Dependencias

```bash
pip install --upgrade pip
pip install appium-python-client selenium pytest
pip freeze > requirements.txt
```
---

## 12. Appium Inspector

- Descargar Appium Inspector (release oficial: https://github.com/appium/appium-inspector/releases).
Por ejemplo: Appium-Inspector-2026.2.1-win-x64.exe

- Abrir el Inspector y configurar la conexión:

Server:
Remote host: 127.0.0.1
Remote port: 4723
Desired capabilities (JSON), algo tipo:

```json
{
  "platformName": "Android",
  "appium:automationName": "UiAutomator2",
  "appium:deviceName": "R5CW82BQSYD",
  "appium:platformVersion": "16",
  "appium:appPackage": "com.sec.android.app.launcher",
  "appium:appActivity": "com.sec.android.app.launcher.activities.LauncherActivity",
  "appium:noReset": true,
  "appium:newCommandTimeout": 900
}
```
appPackage y appActivity deben ajustarse según la aplicación que se quiera automatizar.
El ejemplo anterior abre el launcher de Android.

## Problemas frecuentes

Si al momento de iniciar sesión en Appium Inspector se presenta un error del tipo:

```
Error
WebDriverError: Error getting device platform version. Original error: Error executing adbExec.
Original error: 'Command ''C:\Users\pepe\AppData\Local\Android\Sdk\platform-
tools\adb.exe' -P 5037 -s R5CW82BQSYD shell getprop ro.build.version.release'
exited with code 1'; Command output: adb.exe: device unauthorized. This adb server's
$ADB_VENDOR_KEYS is not set Try 'adb kill-server' if that seems wrong. Otherwise check
for a confirmation dialog on your device. when running "http://127.1.1.1:4723/session"
 with method "POST"
```

Debemos “permitir depuración por USB” en el celular conectado por medio de un cable USB a nuestra computadora.

---

Si al momento de ejecutar un test nos encontramos con el siguiente error:

### Error: Neither ANDROID_HOME nor ANDROID_SDK_ROOT environment variable was exported

Este error indica que Appium no encuentra la raíz del SDK de Android.

Validar:

```powershell
echo $env:ANDROID_HOME
echo $env:ANDROID_SDK_ROOT
```

Si no devuelve una ruta válida, configurar:
```
ANDROID_HOME=C:\Android
ANDROID_SDK_ROOT=C:\Android
Path=C:\Android\platform-tools
```
Cerrar y volver a abrir PowerShell, VS Code y Appium.

---

### adb devices muestra unauthorized

Aceptar el mensaje de autorización USB en el celular.

---

Si no aparece:
```
adb kill-server
adb start-server
adb devices
```
También se puede revocar desde el celular:
```
Opciones de desarrollador → Revocar autorizaciones de depuración USB
```
---

### adb devices muestra offline
Desconectar y reconectar el cable USB, reiniciar ADB y revisar que el cable sea de datos, no solo de carga.

---


✅ Entorno listo para automatizar.

![ANDROID_HOME](/images/appium/12.png)
