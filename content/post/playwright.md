# Base UI Automation con Playwright + Python

Este proyecto es una **base simple y didáctica** usando Page Object Model para automatizar:

- https://walletchallenge-front.onrender.com/

La idea es que el código sea fácil de leer para personas que recién empiezan.

El objetivo del ejercicio es automatizar, el login, (usuario y password "challenge"), cuentas y saldos utilizando el patron de diseño Page Object Model.

## Instalación del entorno (Windows / WSL(Ubuntu) / VSCode)

- Solo si estas en Ubuntu:

```bash
sudo apt update
sudo apt install python3-venv
```

- Crear entorno virtual

Windows:
```bash
python -m venv venv
```

Ubuntu: 
```bash
python3 -m venv venv
```

Esto crea la carpeta venv/ dentro del proyecto.

- Activar entorno virtual

Ubuntu:
```bash
      source venv/bin/activate
```

Windows:

```bash
      venv/bin/activate
```
Si salió bien, vas a ver el prefijo (venv) en la consola:

(venv) ruta del proyecto/proyecto$

- Actualizar pip (recomendado) (Windows y Ubuntu)
```bash
      pip install --upgrade pip
```
- Instalar dependencias necesarias (Windows y Ubuntu)

```bash
      pip install playwright
      pip install pytest-playwright
      pip install pytest
      pip install pytest-html
```
Alternativa:
```bash
pip install -r requirements.txt
```

- Instalar navegadores(Windows y Ubuntu):
```bash
      playwright install
```
Este paso descarga los navegadores que usa Playwright (Chromium, Firefox, WebKit).
Si no lo ejecutás, la automatización no va a funcionar.

- instala libs del sistema solo en ubuntu:
```bash
      playwright install-deps
```

## Notas importantes
Todos los comandos deben ejecutarse desde la terminal de VSCode.
Siempre verificar que el entorno virtual esté activado ((venv) visible).


## Estructura base "recomendada" de un proyecto

```text
venv/
pages/
  base_page.py
  login_page.py
  home_page.py
tests/
  test_login.py
  test_home.py  
requirements.txt
README.md
```

## Diseño general

### 1) `BasePage`
Responsabilidad: centralizar acciones comunes de UI.

Funciones incluidas:

- `abrir_url(url)`
- `click(selector)`
- `escribir(selector, texto)`
- `esperar_visible(selector)`
- `obtener_texto(selector)`
- `seleccionar_opcion(selector, valor)`
- `scroll_hasta_elemento(selector)`
- `capturar_pantalla(nombre_archivo)`
- `etc`
- 
Criterio de errores:

- En acciones principales se usa `try/except`.
- Cuando falla una acción, se intenta capturar screenshot.
- Se imprime un mensaje claro.
- Se relanza la excepción para **no ocultar fallas**.

### 2) `LoginPage`
Responsabilidad: modelar el comportamiento de la pantalla de login.

Funciones incluidas:

- `abrir()`
- `validar_pagina_login()`
- `completar_usuario(usuario)`
- `completar_password(password)`
- `click_iniciar_sesion()`
- `iniciar_sesion(usuario, password)`

Selectores:

- Prioridad a `data-testid`:
  - `login-form`
  - `username-input`
  - `password-input`
  - `login-button`

### 3) `HomePage`
Responsabilidad: modelar acciones y validaciones de Home.

Funciones incluidas:

- `validar_home()`
- `seleccionar_tarjeta(valor)`
- `consultar_cuentas()`
- `validar_cuentas_visibles()`
- `ver_saldo_primera_cuenta()`
- `validar_saldo_visible()`
- `click_salir()`

Selectores:

- Prioridad a `data-testid` (locator) cuando existe.

## Diseño general

Recomendación de ejecución de los test:

```bash
python -m pytest tests/test_login.py
```
