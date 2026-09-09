---
date: 2025-01-06
description: "⚔️ Producers vs. Consumers en Kafka: ¿Quién Gana la Batalla del Rendimiento? ⚔️"
featured_image: "/images/jmeter-kafka/jmeter-kafka-portada.png"
cascade:
   featured_image: "/images/jmeter-kafka/jmeter-kafka-portada.png"
tags: ["jmeter", "kafka", "performance", "stress", "testing"]
title: "Jmeter: Evaluando la Performance de los Consumers en Kafka: Estrés en los Tópicos  🚀"
disable_share: true
omit_header_text: false
type: post
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

## **🔹 Simulación de Carga en un Tópico con Jmeter utilizando 'JSR223 Sampler'**  

✔️ 1-Configuración de Java: asegúrese de instalar la última versión de Java compatible con JMeter, es mejor instalar un JDK

✔️ 2-Pre Condición, contar con nociones básicas de jmeter, si no es tu caso, podes ver alguno de los siguientes tutoriales:

[jmeter desde cero](https://www.youtube.com/results?search_query=jmeter+desde+cero)

✔️ 3-Descargar y depositar en **"C:\apache-jmeter-5.6.3\lib\ext\"** el kafka-clients para java (.jar) de [mvnrepository](https://mvnrepository.com/search?q=kafka-clients). requiere reinicio de jmeter.

✔️ 4-Contar con un entorno de Kafka.

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

String brokerIp = "Acá va la Ip/Nombre el broker de kafka"
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

Además, podemos aplicar niveles de seguridad, por ejemplo:

```groovy
...
// Configurar Kafka Producer con SASL_SSL
Properties props = new Properties()
props.put("bootstrap.servers", "Nombre/IP:Port")
props.put("security.protocol", "SASL_SSL")
props.put("sasl.mechanism", "SCRAM-SHA-512")
props.put(SaslConfigs.SASL_JAAS_CONFIG, "org.apache.kafka.common.security.scram.ScramLoginModule required username='MyUser' password='MyPassword';")
...
// Configurar SSL con archivo PEM
props.put("ssl.truststore.type", "PEM")
props.put("ssl.truststore.location", "E:\\kafka_cert.pem")
props.put("ssl.endpoint.identification.algorithm", "")
Luego queda ejecutar el script para validar los resultados.
...

```

Además de poder tener un script de jmeter utilizando **JSR223 Sampler** para realizar pruebas de performance de forma directa hacia un tópico de **Kafka**, también se puede hacer por medio de un **plugin**

## **🔹 Simulación de Carga en un Tópico con Jmeter utilizando 'di-kafkameter'** 

✔️ Paso 1: Instalar el administrador de complementos de Jmeter 
[Descarga](https://jmeter-plugins.org/get/) el plugins-manager.jar y colócalo en el directorio **lib/ext**, luego reinicie JMeter.

✔️ Paso 2: Habilitá **Kafka Producer Sampler** en el Administrador de complementos

Options -> Plugin Manager:

![Plugin Manager](/images/jmeter-kafka/PluginsManager.png)

![Plugin Manager](/images/jmeter-kafka/plugins-install.jpeg)

✔️ Paso 3: Crear el script de jmeter:

Crear la siguiente estructura en jmeter y sguír las configuraciones que se ven en las imagenes:

![Plugin Manager](/images/jmeter-kafka/Kafka-Producer-config.png)

![Plugin Manager](/images/jmeter-kafka/Kafka-Producer-sample.png)

Además, podemos aplicar niveles de seguridad, por ejemplo:

![Plugin Manager](/images/jmeter-kafka/Kafka-Producer-config-seg.png)


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


