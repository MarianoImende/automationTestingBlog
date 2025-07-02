---
date: 2025-01-06
description: "⚔️ K6 + Victoria Metrics + Grafana ⚔️"
featured_image: "/images/k6-kafka/k6-kafka.webp"
cascade:
   featured_image: "/images/k6-kafka/k6-kafka.webp"
tags: []
title: "K6 + Victoria Metrics + Grafana 🚀"
disable_share: true
omit_header_text: false #achica la imagen
type: page
---

## **🔹 Contexto **

Procedimiento probado en linux Ubuntu 24.04 y SUSE Linux Enterprise Server 15 SP6.

✅ **1. Instalacion de Victoria Metrics**

VictoriaMetrics es una solución de monitorización y base de datos de series temporales rápida, rentable y escalable.

Instalacion de la Versión de un solo nodo:
Single-node version: binario todo en uno fácil de ejecutar y mantener. Se escala verticalmente a la perfección y gestiona fácilmente millones de métricas.

descargar 
https://github.com/VictoriaMetrics/VictoriaMetrics/releases/latest

al momento del presente tutorial (07-2025), se utilizo la version "victoria-metrics-linux-amd64-v1.120.0.tar.gz"

luego ejecutar:
tar -zxvf victoria-metrics-linux-amd64-v1.120.0.tar.gz

luego ejecutar victoria metric de la siguiente manera:

./victoria-metrics-prod -retentionPeriod=1 -storageDataPath=./victoria-metrics-data

🔹 **storageDataPath** VictoriaMetrics almacena todos los datos en este directorio. La ruta predeterminada es victoria-metrics-data el directorio de trabajo actual.

🔹 **retentionPeriod** Retención de datos almacenados. Los datos antiguos se eliminan automáticamente. El periodo de retención predeterminado es de 1 mes (31 días). El periodo mínimo de retención es de 24 horas o 1 día.

![path](/images/k6-vms-grafana/path_victoriametrics.png)

Podes chequear que victoria metrics quedo funcionando asi:

http://IP:8428/

![path](/images/k6-vms-grafana/site_vms.png)

✅ **2. Instalar Grafana**

Descargar **Standalone Linux Binaries** desde https://grafana.com/grafana/download

grafana-12.0.2.linux-amd64.tar.gz (la versión puede variar)

El siguiente paso es ejecutar:

tar -xzf grafana-12.0.2.linux-amd64.tar.gz

![path](/images/k6-vms-grafana/path_grafana.png)

Listo!!! deberias poder entrar desde la url:  

http://localhost:3000/

![path](/images/k6-vms-grafana/site_grafana.png)

**user: admin**
**password: admin**


✅ **3. Crear la conexión desde grafana a VictoriaMetrics**

Se debe crear realizando los siguientes pasos:

![path](/images/k6-vms-grafana/ds_grafana.png)

![path](/images/k6-vms-grafana/new_ds_grafana.png)

En principio, solo setear los siguientes parametros, luego podes editar el resto en base a criterios propios

![path](/images/k6-vms-grafana/prop_ds_grafana.png)

✅ **4. Script de K6**

A modo de sugerencia, el script de K6 debe tener el **tag "name"** que nos ayudara a identificar cada peticion http 
en grafana:

```javascript
import http from 'k6/http';
import { sleep } from 'k6';

// Lista de endpoints de ejemplo
const endpoints = [
    '/api/foo',
    '/api/bar',
    '/api/baz',
];

// Config
export const options = {
    vus: 1,
    duration: '30s',
};

export default function () {
    // Elegir endpoint random
    const ep = endpoints[Math.floor(Math.random() * endpoints.length)];

    // Hacer request con tag `name`
    http.get(`https://httpbin.test.k6.io${ep}`, {
        tags: { name: ep }
    });

    sleep(1);
}
```

## **🔹 Pruebas de Carga en los Tópicos: ¿Por qué Importan?**  

Kafka puede manejar **millones de eventos por segundo**, pero si los consumidores no pueden procesar los mensajes a la misma velocidad que se producen, se generará **lag en los offsets**, afectando la latencia y la estabilidad del sistema.  

**📊 Factores a evaluar al estresar un tópico:**  

- 📌 **Capacidad de consumo**: ¿Cuántos mensajes puede procesar el consumer por segundo antes de saturarse?  
- 📌 **Manejo del lag**: ¿Cómo responde Kafka cuando los consumidores no pueden mantener el ritmo?  
- 📌 **Efecto de la concurrencia**: ¿Cuántos consumers en paralelo mejoran el rendimiento?  
- 📌 **Impacto del tamaño del mensaje**: ¿Cómo afecta la performance aumentar el payload?  

---

## **🔹 Simulación de Carga en un Tópico con xk6-kafka**  

Podemos usar **xk6-kafka** para **sobrecargar un tópico** y medir cómo los consumidores manejan la carga.

### ✅ **Instalar k6 y xk6-kafka**

Si no dispones del binario de k6 con la extension necesaria para realizar pruebas sobre kafka, 
[Aquí](https://www.automationtesting.ar/post/k6_binario/) te dejo el link para construirlo vos mismo.

o bien, podes usar la documentación [oficial](https://github.com/mostafa/xk6-kafka)


### ✅ **Ejemplo de generación de alta carga en un tópico**
```javascript

import { check, fail } from "k6";
import { Counter } from 'k6/metrics';
import { Writer, SchemaRegistry, SCHEMA_TYPE_STRING } from "k6/x/kafka";

const success = new Counter('kafka_success');
const timeout = new Counter('kafka_timeout_errors');
const unexpectedErrors = new Counter('kafka_Unexpected_errors');
const connectionRefusedErrors = new Counter('kafka_connection_refused_errors');
const ioPipeErrors = new Counter('kafka_io_pipe_errors');
const response_time_2s = new Counter('kafka_response_time_2s');
const topic_or_partition  = new Counter('kafka_topic_or_partition_not_exist');

const schemaRegistry = new SchemaRegistry();

export let options = {
    insecureSkipTLSVerify: true, 
    scenarios: {
        ramp_up_and_constant_rate: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 3,
            maxVUs: 10,
            stages: [
                { duration: '2m', target: 1 },
            ],
        },
    },
};

export default function () {

const writer = new Writer({
    brokers: ["localhost:9092"],
    topic: "miTopico",
});

    const message = { syskey: "test-key", foo: "bar" };

    const key = schemaRegistry.serialize({ data: message.syskey, schemaType: SCHEMA_TYPE_STRING });
    const value = schemaRegistry.serialize({ data: JSON.stringify(message), schemaType: SCHEMA_TYPE_STRING });

    try {
        
        const start = Date.now(); //inicia cronometro
        
        const error = writer.produce({
            messages: [{ key, value }],
        });
        
        // writer.produce() retorna "undefined" cuando todo salio bien! caso contrario, devuelve mensaje de error

        // Opcional:
        //const success = check(error, { "mensaje enviado sin error": (err) => err === undefined,});        

        if (error !== undefined && error.message) {
        
          clasificarError(error.message);
            
        } else {
            success.add(1);
            const end = Date.now(); //termina cronometro
            const produceDuration = (end - start);
            if (produceDuration >= 1500){
              response_time_2s.add(1)
            }          
        }
               
    //K6 lanza una excepcion (GoError)
    } catch (e) {
    
        clasificarError(e.message);
        
        fail(`Fallo la ejecucion: ${e.message}`);
        
    } finally {
        writer.close();
    }
}

function clasificarError(msg) {
    msg = msg.toLowerCase();

    switch (true) {
        case msg.includes("read/write on closed pipe"):
            ioPipeErrors.add(1);
            break;
        case msg.includes("connection refused"):
            connectionRefusedErrors.add(1);
            break;
        case msg.includes("timeout"):
            timeout.add(1);
            break;
        case msg.includes("a topic or partition that does not exist on this broker"):
            topic_or_partition.add(1);
            break;
        default:
            unexpectedErrors.add(1);
            break;
    }
}

```

Además, podemos aplicar niveles de seguridad, por ejemplo: 

```groovy
import { check } from "k6";
import {TLS_1_2, SASL_SCRAM_SHA512 ,Writer,SchemaRegistry ,SCHEMA_TYPE_STRING} from "k6/x/kafka";
...
const writer = new Writer({
    brokers: ["localhost:9092"],
    topic: "miTopico",
    sasl: {
        username: "NombreUsuario",
        password: "PasswordDelUsuario",
        algorithm: SASL_SCRAM_SHA512,
    },
    tls: {
        clientCertPem: '/home/user/script/kafka_cert.pem', // Path del certificado
        enableTls: true,
        insecureSkipTlsVerify: true,
        minVersion: TLS_1_2
        },
});
...

```

### 🔹 Monitoreando la Performance de los Consumers y Métricas emitidas

Podemos ver la siguiente tabla detallando las metricas de la extención:

| Metric                           | Type    | Description                                                             |
| -------------------------------- | ------- | ----------------------------------------------------------------------- |
| kafka_reader_dial_count          | Counter | Total number of times the reader tries to connect.                      |
| kafka_reader_fetches_count       | Counter | Total number of times the reader fetches batches of messages.           |
| kafka_reader_message_count       | Counter | Total number of messages consumed.                                      |
| kafka_reader_message_bytes       | Counter | Total bytes consumed.                                                   |
| kafka_reader_rebalance_count     | Counter | Total number of rebalances of a topic in a consumer group (deprecated). |
| kafka_reader_timeouts_count      | Counter | Total number of timeouts occurred when reading.                         |
| kafka_reader_error_count         | Counter | Total number of errors occurred when reading.                           |
| kafka_reader_dial_seconds        | Trend   | The time it takes to connect to the leader in a Kafka cluster.          |
| kafka_reader_read_seconds        | Trend   | The time it takes to read a batch of message.                           |
| kafka_reader_wait_seconds        | Trend   | Waiting time before read a batch of messages.                           |
| kafka_reader_fetch_size          | Counter | Total messages fetched.                                                 |
| kafka_reader_fetch_bytes         | Counter | Total bytes fetched.                                                    |
| kafka_reader_offset              | Gauge   | Number of messages read after the given offset in a batch.              |
| kafka_reader_lag                 | Gauge   | The lag between the last message offset and the current read offset.    |
| kafka_reader_fetch_bytes_min     | Gauge   | Minimum number of bytes fetched.                                        |
| kafka_reader_fetch_bytes_max     | Gauge   | Maximum number of bytes fetched.                                        |
| kafka_reader_fetch_wait_max      | Gauge   | The maximum time it takes to fetch a batch of messages.                 |
| kafka_reader_queue_length        | Gauge   | The queue length while reading batch of messages.                       |
| kafka_reader_queue_capacity      | Gauge   | The queue capacity while reading batch of messages.                     |
| kafka_writer_write_count         | Counter | Total number of times the writer writes batches of messages.            |
| kafka_writer_message_count       | Counter | Total number of messages produced.                                      |
| kafka_writer_message_bytes       | Counter | Total bytes produced.                                                   |
| kafka_writer_error_count         | Counter | Total number of errors occurred when writing.                           |
| kafka_writer_batch_seconds       | Trend   | The time it takes to write a batch of messages.                         |
| kafka_writer_batch_queue_seconds | Trend   | The time it takes to queue a batch of messages.                         |
| kafka_writer_write_seconds       | Trend   | The time it takes writing messages.                                     |
| kafka_writer_wait_seconds        | Trend   | Waiting time before writing messages.                                   |
| kafka_writer_retries_count       | Counter | Total number of attempts at writing messages.                           |
| kafka_writer_batch_size          | Counter | Total batch size.                                                       |
| kafka_writer_batch_bytes         | Counter | Total number of bytes in a batch of messages.                           |
| kafka_writer_attempts_max        | Gauge   | Maximum number of attempts at writing messages.                         |
| kafka_writer_batch_max           | Gauge   | Maximum batch size.                                                     |
| kafka_writer_batch_timeout       | Gauge   | Batch timeout.                                                          |
| kafka_writer_read_timeout        | Gauge   | Batch read timeout.                                                     |
| kafka_writer_write_timeout       | Gauge   | Batch write timeout.                                                    |
| kafka_writer_acks_required       | Gauge   | Required Acks.                                                          |
| kafka_writer_async               | Rate    | Async writer.                                                           |


Para evaluar la capacidad de los consumidores, es importante monitorear:

✅ Tiempo de procesamiento por mensaje 📊

✅ Uso de CPU y memoria en los consumidores 🖥️

✅ Lag en los offsets (cuántos mensajes están en cola esperando ser procesados) ⏳

Una herramienta como Prometheus + Grafana o el propio kafka-consumer-groups.sh puede ayudar a visualizar estos datos en tiempo real.

🎯 Conclusión
Si bien las pruebas de performance en Kafka abarcan muchos aspectos, el estrés en los tópicos es una estrategia clave para entender la capacidad real de los consumidores.

✅ Un consumer lento o subescalado puede convertirse en el cuello de botella del sistema.

✅ Evaluar el lag de los consumers permite detectar problemas de escalabilidad antes de que afecten la producción.

✅ Simular alta carga sobre los tópicos es una práctica esencial para garantizar un Kafka estable y eficiente.

🔥 Pruebas constantes = Kafka optimizado y resiliente. 🚀

🔥 ¿Tus consumidores están preparados para manejar una sobrecarga de mensajes? Solo lo sabrás si los estresas. 🚀



