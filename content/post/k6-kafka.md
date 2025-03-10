# 📌 Balanceando Pruebas de Performance en Kafka con xk6-kafka 🚀

[Apache Kafka](https://kafka.apache.org/) es una plataforma de mensajería distribuida ampliamente utilizada en arquitecturas de **event-driven**. Para garantizar su rendimiento, es clave realizar **pruebas de performance** enfocadas en sus principales métricas.

En este artículo, exploramos cómo utilizar **[xk6-kafka](https://github.com/mostafa/xk6-kafka)** para realizar pruebas de carga, latencia y throughput en Kafka.

---

## 🔹 1. **Instalación de xk6-kafka**
`xk6-kafka` es un módulo de extensión para **k6** que permite simular **producers y consumers** de Kafka para pruebas de carga.

### ✅ **Instalar k6 y xk6-kafka**

Si no dispones del binario de k6 con la extension necesaria para realizar pruebas sobre kafka, 
[Aquí](https://www.automationtesting.ar/post/k6_binario/) te dejo el link para construirlo vos mismo.

o bien, podes usar la documentacion [oficial](https://github.com/mostafa/xk6-kafka)

```sh
# Instalar k6
brew install k6  # MacOS
choco install k6 # Windows
sudo apt install k6 # Linux

# Construir xk6-kafka con k6
xk6 build --with github.com/mostafa/xk6-kafka@latest
