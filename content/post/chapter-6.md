---
date: 2017-04-14T11:25:05-04:00
description: "Introducción a la Programación Orientada a Objetos (POO) TypeScript"
featured_image: "/images/esmeralda.jpg"
tags: ["POO"]
title: "Introducción a la Programación Orientada a Objetos (POO) TypeScript"
disable_share: false
---
# Introducción a la Programación Orientada a Objetos (POO) TypeScript

La Programación Orientada a Objetos (POO) es un estilo de programación que organiza el código en torno a objetos. Estos objetos representan entidades del mundo real o del dominio del problema, y tienen características (llamadas propiedades) y comportamientos (llamados métodos). El objetivo de la POO es hacer que el código sea más fácil de entender, mantener y reutilizar. Es una forma natural de pensar en los problemas y cómo resolverlos. 

La Programación Orientada a Objetos (POO) surgió en la década de 1960, específicamente en 1967, con la creación del lenguaje de programación Simula. Simula fue desarrollado por los científicos noruegos Ole-Johan Dahl e Ivar Jacobson en el Centro Noruego de Computación. Simula fue originalmente diseñado para simulaciones, pero introdujo conceptos que hoy son fundamentales en POO, como clases, objetos, herencia, y polimorfismo. Estos conceptos luego fueron adoptados y refinados en otros lenguajes de programación más populares, como Smalltalk (1972), C++ (1983), Java (1995) y más.


## Clases y objetos:

**Clases:** Son plantillas o moldes que definen cómo serán los objetos (por ejemplo, una Persona).

**Objetos:** Son las instancias creadas a partir de esas clases (por ejemplo, Juan es una instancia de la clase Persona). Métodos y propiedades: 

• Las propiedades son los datos que pertenecen a la clase (como nombre o edad). 
• Los métodos son las acciones que pueden realizar las clases (como getNombre() o setEdad()).

## Encapsulamiento (Protección de los datos)

El encapsulamiento consiste en ocultar los detalles internos de una clase y exponer solo lo necesario mediante métodos públicos. Esto protege los datos y asegura que solo se modifiquen o accedan de manera controlada. Encapsulamiento: Oculta detalles internos para proteger los datos y controlarlos.


```tsx 
class Persona {
    private nombre: string; // solo accesible dentro de la clase
    private edad: number;
 
    constructor(nombre: string, edad: number) {
        this.nombre = nombre;
        this.edad = edad;
    }
 
    // Método público para obtener el nombre
    public getNombre(): string {
        return this.nombre;
    }
 
    // Método público para obtener la edad
    public getEdad(): number {
        return this.edad;
    }
 
    // Método público para cambiar la edad, controlando los valores
    public setEdad(nuevaEdad: number): void {
        if (nuevaEdad > 0) {
            this.edad = nuevaEdad;
        } else {
            console.log("La edad debe ser positiva.");
        }
    }
}
 
// Uso del encapsulamiento
const persona = new Persona("Juan", 25);
console.log(persona.getNombre()); // Juan
persona.setEdad(30);
console.log(persona.getEdad()); // 30

```
