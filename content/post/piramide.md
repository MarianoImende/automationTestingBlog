---
date: "2023-05-14T11:25:05-04:00"
title: "🔺 Pirámide de automatización"
cascade:
featured_image: "/images/piramide.png"
tags: ["Pirámide"]
disable_share: false
omit_header_text: false
type: post
---

# 🔺 La Pirámide de Pruebas según Mike Cohn

Mike Cohn ha discutido y promovido este modelo en sus libros y presentaciones sobre desarrollo ágil y gestión de proyectos, destacando su importancia para la calidad del software y la eficiencia en las prácticas de prueba.

![Pirámide](/images/piramide.png)

## Base de la pirámide - Pruebas Unitarias

Las pruebas unitarias constituyen la base de la pirámide. Son pruebas automatizadas que verifican el funcionamiento correcto de unidades individuales de código, como funciones, métodos o componentes pequeños.

**Características:**

- Alta cobertura de código.
- Bajo costo de mantenimiento.
- Rápidas y eficientes en términos de ejecución.

## Pruebas de Integración

Sobre las pruebas unitarias se encuentran las pruebas de integración. Estas pruebas verifican la interacción correcta entre diferentes unidades de código, asegurando que los módulos integrados funcionen correctamente como un conjunto.

**Características:**

- Menos enfoque en la lógica interna del código y más en la comunicación entre componentes.
- Mayor costo de mantenimiento y ejecución que las pruebas unitarias, pero menos que las pruebas de usuario.

## Cima de la pirámide - Pruebas de Usuario

En la cima de la pirámide se encuentran las pruebas de usuario, que son pruebas que simulan interacciones reales del usuario con la aplicación.

**Características:**

- Pruebas manuales y/o automatizadas de la interfaz de usuario.
- Menor cobertura de código en comparación con las pruebas unitarias e integración.
- Mayor costo de mantenimiento y ejecución debido a su naturaleza más compleja y menos predecible.

## Importancia de la Pirámide de Pruebas

**Estrategia de cobertura:**

La pirámide proporciona una guía para distribuir eficientemente los esfuerzos de prueba en diferentes niveles. Enfocarse en pruebas unitarias y de integración en la base ayuda a garantizar una mayor estabilidad y calidad del software desde las fases tempranas del desarrollo.

**Automatización y eficiencia:**

Promueve la automatización de las pruebas en los niveles más bajos de la pirámide, donde las pruebas son más rápidas, más confiables y menos costosas de mantener.

**Reducción de riesgos:**

Al priorizar las pruebas en la base de la pirámide, se reduce el riesgo de errores críticos y costosos que podrían aparecer en etapas avanzadas del desarrollo o en producción.

## Consideraciones sobre Pruebas en el Nivel de Pruebas de Usuario (Cima de la Pirámide)

Es importante equilibrar la automatización de pruebas en diferentes niveles con el mantenimiento efectivo y la cobertura de escenarios críticos. Esto ayuda a garantizar la calidad del software y a mitigar riesgos sin comprometer la eficiencia del equipo de desarrollo y QA.

### Frecuencia de Cambios en el Frontend

Es cierto que el frontend puede experimentar cambios más frecuentes debido a actualizaciones en la interfaz de usuario, nuevos diseños o mejoras en la experiencia del usuario. Esto puede hacer que las pruebas a nivel de interfaz de usuario sean más propensas a requerir mantenimiento constante.

### Dificultad de Mantener Pruebas Visuales Específicas

Automatizar pruebas unitarias en componentes visuales específicos (como selectores, calendarios, inputs) puede ser desafiante y a menudo no justificar el esfuerzo necesario debido a la complejidad y la posibilidad de cambios frecuentes en el diseño.

### Importancia de las Pruebas End-to-End

Las pruebas end-to-end, que simulan escenarios de usuario completos desde el frontend hasta el backend (o mocks), son cruciales para validar el funcionamiento integrado del sistema. Esto incluye probar la lógica de negocio, la integración de servicios y la experiencia del usuario en condiciones cercanas a la producción.

### Limitación a Flujos Críticos y Regresión

Es recomendable enfocarse en automatizar los flujos críticos del producto y establecer pruebas end-to-end como parte de la estrategia de regresión. Esto ayuda a asegurar que los cambios no introduzcan errores en áreas críticas y que la funcionalidad principal del producto continúe operando correctamente.

### Complemento de Pruebas Manuales

Aunque las pruebas end-to-end son esenciales, no deben reemplazar completamente las pruebas manuales. Las pruebas manuales siguen siendo importantes para verificar aspectos visuales, la experiencia del usuario y otros detalles que pueden no ser fácilmente automatizables.

## Estrategias Recomendadas

**Selección de Escenarios Críticos:**

Identifica y automatiza los escenarios de usuario más críticos y frecuentemente utilizados, así como aquellos que son más propensos a errores.

**Uso de Mocks y Datos Eficientes:**

Utiliza mocks para simular servicios backend y datos eficientes que cubran una variedad de casos y condiciones para pruebas end-to-end.

**Monitoreo y Ajuste Continuo:**

Monitorea la estabilidad y efectividad de las pruebas automatizadas, ajustando los scripts según sea necesario para mantener su relevancia frente a cambios en el frontend y backend.
