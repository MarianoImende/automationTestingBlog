
# 📱 Setup Appium con Python + Pytest (Android)

Guía completa para preparar una laptop nueva y dejarla lista para automatizar tests con **Python + Pytest + Appium (Android)**.

---

## 1. Preparar la máquina

- Instalar **Python 3.x** desde la página oficial
- Marcar **Add Python to PATH** durante la instalación

## 2. IDE / Editor

- Instalar **Visual Studio Code**

## 3. Java + Android SDK (para poder usar UiAutomator2)

- Instalar un **JDK** (OpenJDK/Temurin 11 o 17). (ruta de instalación opcional, por ejemplo: C:\jdk-21.0.10.7-hotspot)
  (https://adoptium.net/es/temurin/releases)
- Configurar variables de entorno de usuario:
  rundll32.exe sysdm.cpl,EditEnvironmentVariables

  - `JAVA_HOME`
  - Agregar `%JAVA_HOME%\bin` a `PATH`
  - 
![ANDROID_HOME](/images/appium/1.png)

![ANDROID_HOME](/images/appium/2.png)
  
## 4. Instalar Android Studio

- https://developer.android.com/
- Configurar `ANDROID_HOME` apuntando al SDK

![ANDROID_HOME](/images/appium/3.png)

 es probable que la carpeta AppData se encuentre oculta:

![ANDROID_HOME](/images/appium/4.png)
  
- Agregar `%ANDROID_HOME%\platform-tools` al `PATH`

![ANDROID_HOME](/images/appium/5.png)

Verificar que funciona:

```bash
adb version
```
![ANDROID_HOME](/images/appium/6.png)
 
## 5. Node.js

- Instalar **Node.js LTS**
  
![ANDROID_HOME](/images/appium/7.png)

Validar instalación

```bash
node --version
v24.4.1
```

## 6. Instalar Appium Server

```bash
npm install -g appium
```
![ANDROID_HOME](/images/appium/8.png)

validar instalacion:

```bash
appium -v
```
## 7. Instalar el driver de Android:

```bash
appium driver install uiautomator2
```
![ANDROID_HOME](/images/appium/9.png)

## 8. Ejecutar Appium

```bash
appium
```
![ANDROID_HOME](/images/appium/10.png)


## 9. Configurar celular Android

- Activar Opciones de desarrollador:
  Ajustes → Acerca del teléfono → tocar varias veces “Número de compilación”.

- Activar Depuración USB en Opciones de desarrollador.
  Conectar el celular por USB a la laptop y aceptar el mensaje de “Permitir depuración USB”.

-Verificar que ADB lo ve:

```bash
adb devices
```
![ANDROID_HOME](/images/appium/11.png)

(Opcional) Ajustar bloqueo de pantalla:
- Dejar un PIN numérico simple si querés usar unlock automático con Appium.
- Desactivar biometría (huella) si te molesta para los tests.

## 10. Entorno Python para los tests

```bash
mkdir appium-tests
cd appium-tests
python -m venv venv
venv\Scripts\activate
```

## 11. Dependencias

```bash
pip install --upgrade pip
pip install appium-python-client selenium pytest
pip freeze > requirements.txt
```

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
  "automationName": "UiAutomator2",
  "deviceName": "R5CW82BQSYD",
  "platformVersion": "16",
  "appPackage": "com.sec.android.app.launcher",
  "appActivity": "com.sec.android.app.launcher.activities.LauncherActivity",
  "noReset": true,
  "newCommandTimeout": 90000
}
```
Si al momento de iniciar sesión se presenta un error del tipo:

```
Error
WebDriverError: Error getting device platform version. Original error: Error executing adbExec. Original error: 'Command ''C:\Users\pepe\AppData\Local\Android\Sdk\platform-
tools\adb.exe' -P 5037 -s R5CW82BQSYD shell getprop ro.build.version.release' exited with code 1'; Command output: adb.exe: device unauthorized. This adb server's $ADB_VENDOR_KEYS is not set Try 'adb kill-server' if that seems wrong. Otherwise check for a confirmation dialog on your device. when running "http://127.1.1.1:4723/session" with method "POST"
```
Debemos “permitir depuración por USB” en el celular conectado por medio de un cable USB a nuestra computadora.
---

✅ Entorno listo para automatizar.

![ANDROID_HOME](/images/appium/12.png)
