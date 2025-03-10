# 📌 Estrés en Tópicos Kafka: Clave para Evaluar la Performance de los Consumidores 🚀  

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

## **🔹 Simulación de Carga en un Tópico con xk6-kafka**  

Podemos usar **xk6-kafka** para **sobrecargar un tópico** y medir cómo los consumidores manejan la carga.

### ✅ **Instalar k6 y xk6-kafka**

Si no dispones del binario de k6 con la extension necesaria para realizar pruebas sobre kafka, 
[Aquí](https://www.automationtesting.ar/post/k6_binario/) te dejo el link para construirlo vos mismo.

o bien, podes usar la documentación [oficial](https://github.com/mostafa/xk6-kafka)


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


