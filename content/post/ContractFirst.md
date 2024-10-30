---
date: 2017-04-14T11:25:05-04:00
description: "Contract First y testing"
featured_image: "/images/contractfirst/contract.png"
cascade:

   featured_image: "/images/contractfirst/contract.png"
tags: []
title: "Contract First y testing"
disable_share: true
omit_header_text: false #achica la imagen
type: page

---


## Implementación de la Metodología Contract First en Pruebas de Software.

Este post tiene la intención de mostrar cómo adoptar la metodología Contract First en el contexto de pruebas de software. Implementar esta metodología implica una serie de pasos que facilitan la integración de contratos en el proceso de pruebas, abarcando desde la educación y la capacitación hasta la automatización y la colaboración continua. Al usar herramientas como Postman y generadores de clientes API, los testers pueden crear y ejecutar pruebas de manera eficiente y consistente, asegurando que las APIs cumplan con las especificaciones definidas en los contratos.

### Concepto de "Contract First"

Contract First (o "Contrato Primero") es un enfoque en el desarrollo de servicios web y APIs donde el contrato, que define la interfaz y las interacciones del servicio, se diseña y establece antes de que se implemente la lógica del servicio. Este contrato usualmente se especifica utilizando lenguajes de definición de interfaces como WSDL (Web Services Description Language) para servicios SOAP, o OpenAPI/Swagger para APIs RESTful.

Si bien JSON es probablemente el formato más popular para intercambiar datos, JSON Schema es el vocabulario que permite la coherencia, validez e interoperabilidad de los datos JSON a escala.

### Ventajas del Enfoque Contract First

**Claridad y Consistencia:**

Definir el contrato primero asegura que todas las partes involucradas (desarrolladores, clientes, testers, etc.) tengan una comprensión clara y consistente de cómo deben interactuar con el servicio desde el principio.

**Interoperabilidad:**

Un contrato bien definido facilita la interoperabilidad entre diferentes sistemas y plataformas. Los clientes pueden generar automáticamente el código del cliente (stubs) y los servidores pueden generar el esqueleto del servicio (skeletons) basándose en el contrato.

**Desarrollo Paralelo:**

Los equipos pueden trabajar en paralelo. Mientras un equipo trabaja en la implementación del servicio, otro equipo puede trabajar en el desarrollo del cliente o en las pruebas, todos utilizando el contrato como referencia.

**Validación y Documentación:**

El contrato actúa como una fuente única de verdad y puede utilizarse para validar las interacciones y como documentación de la API. Herramientas como Swagger/OpenAPI pueden generar documentación interactiva automáticamente a partir del contrato.

![swagger](/images/swagger.png)

![swagger](/images/yaml.png)

![swagger](/images/swagger1.png)

### Integrar el Contrato en las Herramientas de Pruebas

**Uso de Postman:**

1. **Importar el Contrato:**
   - Importar el archivo OpenAPI/Swagger directamente en Postman para generar automáticamente las colecciones de pruebas.
   - En Postman, seleccionar `Import > File` y cargar el archivo OpenAPI (YAML o JSON).

2. **Generación de Pruebas:**
   - Postman generará automáticamente las solicitudes de API en base al contrato, lo que facilita la creación de pruebas.

### Colaboración y Comunicación

**Colaborar con Desarrolladores:**

- Trabajar estrechamente con los desarrolladores para asegurarte de que el contrato esté actualizado y refleje correctamente las expectativas del sistema. (Atributo de testeabilidad: La testeabilidad se refiere al grado en que un artefacto de software puede ser probado. Para que un artefacto sea testeable, debe ser posible controlar sus entradas y observar sus salidas.)
- Participa en las revisiones del contrato para garantizar que todas las partes interesadas (Desarrolladores, Testers, Otros) estén alineadas.

**Utilizar Repositorios Compartidos:**

- Resguardar los contratos en repositorios compartidos accesibles a todos los miembros del equipo.
- Configura un proceso para actualizar los contratos y generar automáticamente los stubs y colecciones de Postman a partir de estos contratos.

### Implementar Pruebas de Integración y Validación

**Pruebas de Integración:**

- Implementar pruebas de integración que verifiquen que las diferentes partes del sistema interactúan correctamente según lo definido en el contrato.
- Utiliza herramientas de mocking para simular partes del sistema que aún no están implementadas.

**Validación Continua:**

- Configurar validación continua de contratos en el pipeline de CI/CD para asegurar que cualquier cambio en el contrato se refleje en las implementaciones y pruebas.

### Utilidades:

- [JSON to Schema Converter](https://www.liquid-technologies.com/online-json-to-schema-converter)
- [Regex Generator](https://regex-generator.olafneumann.org)
- [JSON to JSON Schema Generator](https://codebeautify.org/json-to-json-schema-generator)



