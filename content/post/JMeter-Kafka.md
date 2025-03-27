---
date: 2024-05-16T11:25:05-04:00
description: "⚔️ Producers vs. Consumers en Kafka: ¿Quién Gana la Batalla del Rendimiento? ⚔️"
featured_image: "/images/jmeter-kafka/jmeter-kafka.webp"
cascade:
   featured_image: "/images/jmeter-kafka/jmeter-kafka.webp"
tags: []
title: "Jmeter: Evaluando la Performance de los Consumers en Kafka: Estrés en los Tópicos  🚀"
disable_share: true
omit_header_text: false #achica la imagen
type: page

---

En las arquitecturas basadas en **Apache Kafka**, la estabilidad del sistema no depende solo de la capacidad de los **producers** para enviar mensajes, sino también de **cómo los consumers procesan la carga en diferentes escenarios**.  

🔹 **¿Qué sucede si un consumer no puede mantener el ritmo de los mensajes entrantes?**  

🔹 **¿Cómo afecta el lag de los consumidores al rendimiento del sistema?**  

🔹 **¿Cuál es el impacto de aumentar la concurrencia en los grupos de consumo?**  

Para responder estas preguntas, es clave realizar **pruebas de estrés en los tópicos** y analizar la capacidad de procesamiento de los consumidores bajo diferentes condiciones.

---

## **🔹 Pruebas de Carga en los Tópicos: ¿Por qué Importan?**  

Kafka puede manejar **millones de eventos por segundo**, pero si los consumidores no pueden procesar los mensajes a la misma velocidad que se producen, se generará **lag en los offsets**, afectando la latencia y la estabilidad del sistema.  

**📊 Factores a evaluar al estresar un tópico:**  

- 📌 **Capacidad de consumo**: ¿Cuántos mensajes puede procesar el consumer por segundo antes de saturarse?  
- 📌 **Manejo del lag**: ¿Cómo responde Kafka cuando los consumidores no pueden mantener el ritmo?  
- 📌 **Efecto de la concurrencia**: ¿Cuántos consumers en paralelo mejoran el rendimiento?  
- 📌 **Impacto del tamaño del mensaje**: ¿Cómo afecta la performance aumentar el payload?  

---

## **🔹 Simulación de Carga en un Tópico con Jmeter**  

✔️ 1-Pre Condición, contar con nociones básicas de jmeter, si no es tu caso, podes ver alguno de los siguientes tutoriales:

[jmeter desde cero](https://www.youtube.com/results?search_query=jmeter+desde+cero)

✔️ 2-Contar con un entorno de Kafka.

Continuamos:

### ✅ **Instalar jmeter**

Por razones practicas, vamos a utilizar Windows instalar jmeter, desarrollar el script y ejecutar la prueba.

Primero, descargamos la última versión de JMeter desde el [sitio web oficial de JMeter](https://jmeter.apache.org/download_jmeter.cgi). clic en el enlace “apache-jmeter-x.x.x.tgz” para descargar el archivo zip binario de JMeter.

Luego, descomprimir el archivo zip para obtener jmeter listo para ser utilizado:

``` BeanShell

C:\apache-jmeter-x.x.x\bin

```
ejecutar con doble clic jmeter por medio de:

``` BeanShell

C:\apache-jmeter-x.x.x\bin\jmeter.bat

```
Crear un Test Plan con:

☑ Thread Group
☑ JSR223 Sampler
☑ View Results Tree

![Script](/images/jmeter-kafka/TestPlan.png)

El script de JSR223 Sampler debe contener el siguiente código:

```groovy

import org.apache.kafka.clients.producer.*
import java.util.Properties
import java.net.Socket
import groovy.json.JsonOutput

String brokerIp = "Acá va la Ip el broker de kafka"
int brokerPort = 9092
String topic = "miTopico"

//Marcar el test como fallido por defecto (por si hay excepción)
SampleResult.setSuccessful(false)

try {
    new Socket(brokerIp, brokerPort).withCloseable {
        log.info("Conexión TCP abierta con Kafka en ${brokerIp}:${brokerPort}")
    }
} catch (Exception e) {
    log.error("No se pudo conectar al broker", e)
    SampleResult.setResponseMessage("No se pudo conectar al broker")
    SampleResult.setResponseCode("500") // código de error arbitrario
    return // salir si falla conexión
}

// Configurar Kafka Producer
Properties props = new Properties()
props.put("bootstrap.servers","${brokerIp}:${brokerPort}".toString())
props.put("security.protocol", "PLAINTEXT")
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer")

KafkaProducer<String, String> producer = new KafkaProducer<>(props)

// Construir mensaje JSON
    Map<String, Object> message = [
        syskey : "test123",
        message: "Hola desde JMeter vía Kafka!!!"
    ]
    
String key = message.syskey
String value = JsonOutput.toJson(message)

ProducerRecord<String, String> record = new ProducerRecord<>(topic, key, value)

try {
    producer.send(record).get()
    log.info("Mensaje enviado a Kafka -> Topic: ${topic} | Key: ${key} | Value: ${value}")
    SampleResult.setSuccessful(true) // marcar como exitoso
    SampleResult.setResponseMessage("Mensaje enviado correctamente a Kafka")
    SampleResult.setResponseCode("200")
} catch (Exception e) {
    log.error("Error al enviar mensaje a Kafka", e)
    SampleResult.setResponseMessage("Error al enviar mensaje a Kafka")
    SampleResult.setResponseCode("500")
} finally {
    producer.close()
    log.info("KafkaProducer cerrado correctamente")
}


```















Instalar Jmeter plugin manager:

Descargar JMeter Plugin Manager de [meter-plugins](https://jmeter-plugins.org/install/)

Copia el plugins-manager.jar descargado en la carpeta /lib/ext/ de su instalación de JMeter.(restart JMeter)

Luego de reiniciar, ir a Opciones ->

Habilitar Kafka Producer Sampler en Plugin Manager

IMAGEN



Nota:
Si estas detras de un proxy empresarial, probablemente tengas problemas de :
problema con el SSL/TLS Handshake cuando JMeter intenta descargar los plugins del repositorio

modificar el archivo \bin\user.properties:

Y agregar la siguiente línea al final:

jpgc.repo.address=http://jmeter-plugins.org/repo/

Ademas agregar:

\bin\system.properties
http.proxyHost=your_proxy_host
http.proxyPort=your_proxy_port
https.proxyHost=your_proxy_host
https.proxyPort=your_proxy_port

### ✅ **Ejemplo de generación de alta carga en un tópico**
```javascript

import { Writer,SchemaRegistry ,SCHEMA_TYPE_STRING} from "k6/x/kafka";

const brokers = ["localhost:9092"];
const topic = "topico";

const writer = new Writer({
    brokers: brokers,
    topic: topic,
});

const schemaRegistry = new SchemaRegistry();

export let options = {
    insecureSkipTLSVerify: true, 
    scenarios: {
        ramp_up_and_constant_rate: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 100,
            stages: [
                { duration: '5s', target: 2 },
                { duration: '5s', target: 6 },
                { duration: '5s', target: 10 },
                { duration: '60s', target: 20 },
                { duration: '5s', target: 10 },
                { duration: '5s', target: 5 }
            ],
        },
    },
};

export default function () {

    let numero = Math.floor(Math.random() * 500000) + 1;
    let milisegundos = Date.now(); // milisegundos
    let id = `${numero}${milisegundos}`;
    
    console.log(syskey.toString())

    const message = {
        id: id,
        accountId: "2",
        transactionDate: "25/02/2022",
        transactionTime: "14:30:00",
        transactionType: "PAGO",
        amount: "1.124,56"
    };

    let key = message.id
    const messageString = JSON.stringify(message); 

    //Enviar tipo string
    writer.produce({
        messages: [{
            key: schemaRegistry.serialize({data: key,schemaType: SCHEMA_TYPE_STRING}),
            value: schemaRegistry.serialize({data: messageString,schemaType: SCHEMA_TYPE_STRING})
            }]
    });
}

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


