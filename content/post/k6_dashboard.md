---
date: "2024-06-12T11:13:05-04:00"
title: "📈 Web dashboard en k6"
featured_image: "/images/k6/k6.png"
date: 2024-10-25
tags: ["stress", "performance", "testing"]
description: "Guía para utilizar Web dashboard en K6 para pruebas de Performance"
---

# 📈 Web dashboard en K6

**k6** proporciona un panel web integrado que puede habilitar para visualizar y monitorear los resultados de sus pruebas en **tiempo real**


![web-dashboard](/images/k6/web-dashboard.png)

# Cómo utilizar

El panel web es una función integrada de k6. se puede habilitarl configurando la variable de entorno **K6_WEB_DASHBOARD** en **true** cuando ejecute su script de prueba, por ejemplo:

**export K6_WEB_DASHBOARD=true**

De forma predeterminada, el panel web está disponible en el puerto localhost 5665

EL siguiente es un ejemplo completo en entorno Linux, es decir, el script (init.js) se encuentra en un servidor linux
en el cual se creo un archivo con extension **sh** (contienen código para distintos scripts que pueden utilizarse en el intérprete de comandos de Bash de Unix) para fasilitar la ejecución:

```linux
export K6_WEB_DASHBOARD=true            # Habilitar el Dashboard
export K6_WEB_DASHBOARD_PORT=5665       # Puerto de eschucha del Dashboard
export K6_WEB_DASHBOARD_HOST=0.0.0.0    # Host al que vincular el Dashboard
export K6_WEB_DASHBOARD_PERIOD=2s       # Periodo en segundos para actualizar el Dashboard
/opt/k6/k6 run --no-connection-reuse /opt/scriptK6/init.js
```linux

## 1. Checks de Código de Estado
Verifica que el código de estado de la respuesta sea el esperado.

```javascript
check(res, {
    'el código de estado es 200': (r) => r.status === 200,
});

```

## Checks de Tiempo de Respuesta
Comprueba que el tiempo de respuesta esté dentro de los límites aceptables.

```javascript
check(res, {
    'el tiempo de respuesta es menor a 200ms': (r) => r.timings.duration < 200,
});

```

## 3. Checks del Cuerpo de la Respuesta
Valida contenido específico en el cuerpo de la respuesta. Útil para comprobar que los datos esperados se devuelvan.

```javascript
check(res, {
    'el cuerpo contiene "success"': (r) => r.body.includes('success'),
});

// Para respuestas JSON:
const jsonResponse = JSON.parse(res.body);
check(jsonResponse, {
    'los datos existen': (j) => j.data !== undefined,
    'el id del usuario es 1': (j) => j.user.id === 1,
});

```

## 4. Checks de Cabeceras
Verifica que ciertas cabeceras estén presentes o tengan valores esperados.

```javascript
check(res, {
    'Content-Type es application/json': (r) => r.headers['Content-Type'] === 'application/json',
});

```

## 5. Checks Combinados
Puedes combinar múltiples checks para validar completamente una respuesta.

```javascript
check(res, {
    'el código de estado es 200': (r) => r.status === 200,
    'el cuerpo contiene "success"': (r) => r.body.includes('success'),
    'Content-Type es application/json': (r) => r.headers['Content-Type'] === 'application/json',
});

```

## 6. Checks con Lógica Personalizada
Implementa lógica personalizada para validaciones más complejas.

```javascript
function validarUsuario(usuario) {
    return usuario.age > 18 && usuario.active === true;
}

check(jsonResponse, {
    'el usuario es válido': () => validarUsuario(jsonResponse),
});

```

## 7. Checks de Manejo de Errores
Valida respuestas específicas de error o códigos de estado para asegurarte de que tu aplicación falle de manera controlada.

```javascript
if (res.status === 404) {
    check(jsonResponse, {
        'el mensaje de error es correcto': (obj) => obj.error === 'Not Found',
        'el código de error es 404': (obj) => obj.code === 404,
    });
}

```

## 8. Validación de JSON Anidado
Cuando trabajes con objetos JSON profundamente anidados, verifica la estructura y el contenido.

```javascript
check(jsonResponse, {
    'los detalles del usuario son correctos': (obj) => obj.user && obj.user.id === 1 && obj.user.details.age > 18,
    'los títulos de las publicaciones están presentes': (obj) => Array.isArray(obj.posts) && obj.posts.every(post => post.title !== undefined),
});

```

## 9. Combinar Condiciones
Puedes combinar checks usando operadores lógicos.

```javascript
check(res, {
    'el código de estado es 200 y Content-Type es JSON': (r) => r.status === 200 && r.headers['Content-Type'] === 'application/json',
});

```
## 10. Validación en Bucles
Verifica múltiples elementos en un arreglo.

```javascript
const validPosts = jsonResponse.posts.filter(post => post.published);

check(validPosts, {
    'todas las publicaciones publicadas tienen títulos': () => validPosts.every(post => post.title !== undefined),
});

```

## 11. Checks con Funciones Personalizadas
Encapsula lógica compleja en funciones reutilizables.

```javascript
function esUsuarioValido(usuario) {
    return usuario && usuario.id > 0 && usuario.active === true && usuario.roles.includes('user');
}

check(jsonResponse, {
    'el usuario es válido': () => esUsuarioValido(jsonResponse.user),
});

```

## 12. Checks Condicionales
Realiza checks que dependan de resultados previos.

```javascript
let usuarioExiste = false;

if (res.status === 200) {
    const jsonResponse = JSON.parse(res.body);
    usuarioExiste = jsonResponse.user !== null;
}

check(res, {
    'el usuario existe': () => usuarioExiste,
});

```

## 13. Uso de Umbrales para Rendimiento y Validaciones
Puedes combinar verificaciones (checks) con umbrales de rendimiento para garantizar que las respuestas cumplan con los tiempos establecidos.

```javascript
import { check } from 'k6';

check(res, {
    'el tiempo de respuesta es aceptable': (r) => r.timings.duration < 200,
    'el código de estado es 200': (r) => r.status === 200,
});

// Establecer umbrales para aplicar requerimientos de rendimiento
export const thresholds = {
    'response_time': ['p(95)<200'], // El 95% de las respuestas deben ser menores a 200ms
};

```

## 14. Verificación de Patrones Específicos en la Respuesta
Para APIs que devuelven patrones específicos (por ejemplo, IDs con formato específico), puedes usar expresiones regulares.

```javascript
const jsonResponse = JSON.parse(res.body);

check(jsonResponse, {
    'el ID de usuario tiene un patrón válido': (obj) => /^user_\d+$/.test(obj.id),
});

```

## 15. Rendimiento y Validación Combinados
Puedes medir tiempos de respuesta mientras validas el contenido de las respuestas.

```javascript
check(res, {
    'el tiempo de respuesta es aceptable': (r) => r.timings.duration < 300,
    'el cuerpo de la respuesta es válido': (r) => {
        const jsonResponse = JSON.parse(r.body);
        return jsonResponse && jsonResponse.success === true;
    },
});

```

## 16. Validación Cruzada de Datos
Cuando trabajas con múltiples puntos de datos, puedes validar las relaciones entre ellos.

```javascript
const userResponse = http.get('https://api.example.com/users/1');
const postResponse = http.get('https://api.example.com/posts');

check(userResponse, {
    'el usuario existe': (r) => r.status === 200,
});

check(postResponse, {
    'todas las publicaciones pertenecen al usuario': (r) => {
        const posts = r.json();
        return posts.every(post => post.userId === userResponse.json().id);
    },
});

```

## 17. Resultados Agregados de Verificaciones
Puedes agregar resultados de múltiples verificaciones y proporcionar un resumen consolidado.

```javascript
let checkResults = {
    validStatus: false,
    validContent: false,
};

check(res, {
    'el estado es 200': (r) => {
        checkResults.validStatus = r.status === 200;
        return checkResults.validStatus;
    },
    'la respuesta contiene datos esperados': (r) => {
        const jsonResponse = JSON.parse(r.body);
        checkResults.validContent = jsonResponse.data !== undefined;
        return checkResults.validContent;
    },
});

// Registrar resultados de las verificaciones
console.log(`Resultados: Estado válido? ${checkResults.validStatus}, Contenido válido? ${checkResults.validContent}`);

```

## 18. Validación con Librerías Externas
Si necesitas validaciones más avanzadas, puedes usar librerías externas como Ajv para validación de esquemas JSON.

```javascript
import Ajv from 'ajv';
import { check } from 'k6';

const ajv = new Ajv();
const schema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
    },
    required: ['id', 'name'],
};

const jsonResponse = JSON.parse(res.body);
const validate = ajv.compile(schema);
const valid = validate(jsonResponse);

check(res, {
    'la respuesta cumple con el esquema': () => valid,
});

```

## 19. Validaciones Dinámicas
Para asegurar que los valores sigan reglas específicas, como IDs secuenciales o rangos de tiempo válidos.

```javascript
const jsonResponse = JSON.parse(res.body);
const ids = jsonResponse.items.map(item => item.id);

check(res, {
    'los IDs son secuenciales': () => {
        return ids.every((id, index) => index === 0 || id === ids[index - 1] + 1);
    },
    'las marcas de tiempo son válidas': () => {
        return jsonResponse.items.every(item => {
            const date = new Date(item.timestamp);
            return date instanceof Date && !isNaN(date);
        });
    },
});

```

## 20. Validación Basada en Tiempos
Puedes validar que las operaciones no devuelvan datos antiguos.

```javascript
const jsonResponse = JSON.parse(res.body);
const now = Date.now();

check(res, {
    'los datos son recientes': () => {
        return jsonResponse.items.every(item => {
            const itemDate = new Date(item.updatedAt).getTime();
            return now - itemDate < 24 * 60 * 60 * 1000; // Dentro de 24 horas
        });
    },
});

```

## 21. Chequeo Agregado de Métricas
Combina validaciones funcionales con métricas de rendimiento para un análisis más completo.

```javascript
let totalChecksPassed = 0;

check(res, {
    'el estado es 200': (r) => {
        const result = r.status === 200;
        totalChecksPassed += result ? 1 : 0;
        return result;
    },
    'la respuesta es válida': (r) => {
        const jsonResponse = JSON.parse(r.body);
        const result = jsonResponse.success === true;
        totalChecksPassed += result ? 1 : 0;
        return result;
    },
});

// Registrar total de verificaciones aprobadas
console.log(`Verificaciones aprobadas: ${totalChecksPassed}`);

```

## 22. Ejecución Condicional Basada en Respuesta
Ejecuta dinámicamente verificaciones según la respuesta de una llamada previa.

```javascript
const res = http.get('https://api.example.com/feature');

if (res.status === 200) {
    const jsonResponse = JSON.parse(res.body);
    check(jsonResponse, {
        'la característica está habilitada': (obj) => obj.enabled === true,
    });
} else {
    check(res, {
        'la característica está deshabilitada': (r) => r.status === 404,
    });
}

```

## 23. Integración con Herramientas de Monitoreo Externas
Envía resultados de métricas a herramientas como Grafana o Prometheus.

```javascript
import { Trend } from 'k6/metrics';

let responseTimeTrend = new Trend('response_time');

export default function () {
    let res = http.get('https://api.example.com/resource');
    responseTimeTrend.add(res.timings.duration);

    check(res, {
        'el estado es 200': (r) => r.status === 200,
    });
}

```

## 24. Validación de Paginación
Comprueba que la lógica de paginación funcione correctamente.

```javascript
const firstPage = http.get('https://api.example.com/items?page=1');
const secondPage = http.get('https://api.example.com/items?page=2');

check(firstPage, {
    'la primera página tiene elementos': (r) => r.json().items.length > 0,
});

check(secondPage, {
    'la segunda página tiene elementos': (r) => r.json().items.length > 0,
});

const firstItems = firstPage.json().items;
const secondItems = secondPage.json().items;

check(secondItems, {
    'los elementos de la segunda página son diferentes': () => {
        return !firstItems.some(item => secondItems.some(secondItem => secondItem.id === item.id));
    },
});

```

## 26. Validación de Respuestas en Paralelo
Para escenarios en los que necesitas validar múltiples respuestas de forma simultánea, puedes usar promesas.

```javascript
import { check, group } from 'k6';
import http from 'k6/http';

export default function () {
    const urls = [
        'https://api.example.com/users/1',
        'https://api.example.com/posts',
        'https://api.example.com/comments',
    ];

    // Hacer múltiples solicitudes en paralelo
    const responses = http.batch(urls.map(url => ['GET', url]));

    // Verificar cada respuesta
    responses.forEach((res, idx) => {
        check(res, {
            [`response ${idx + 1} is valid`]: (r) => r.status === 200,
        });
    });
}

```
## Dato importante:
**r**: El objeto pasado al callback de la función check:
En el callback de la función **check**, **r** es el mismo objeto de respuesta que **res**.
El propósito de **r** es simplemente proporcionar acceso a los datos de **res** dentro de la función callback, por lo que **r** es una referencia al mismo objeto que **res** en este caso.

Entonces, **¿por qué se usan nombres diferentes?**
El uso de nombres distintos es simplemente una **convención de estilo de código**. Se usa **res** fuera de la función check y **r** dentro de la función callback. Esto puede deberse a:

- 1 **Legibilidad:** Dentro del callback, un nombre corto como r es más práctico para evitar repetir res cada vez.
- 2 **Scope local:** El nombre r es local al callback y no afecta el uso de res en el nivel externo.

**¿Es necesario usar nombres diferentes?**
No, puedes usar el mismo nombre (res) si lo prefieres:

``` javascript
const res = http.get('https://api.example.com/resource');
check(res, {
    'el tiempo de respuesta es aceptable bajo carga': (res) => res.timings.duration < 500,
});
```
