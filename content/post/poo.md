---
date: "2024-04-14T11:25:05-04:00"
title: "Introducción a la Programación Orientada a Objetos (POO) TypeScript"
description: "Conocimiento clave para automation testing"
cascade:
 featured_image: "/images/posts.jpg"
tags: ["POO"]
disable_share: false
---

Un tema muy importante a la hora de comenzar el camino de la automatizacion de pruebas es la programación orientada a objetos.

La Programación Orientada a Objetos (POO) es un estilo de programación que organiza el código en torno a objetos. Estos objetos representan entidades del mundo real o del dominio del problema, y tienen características (llamadas propiedades) y comportamientos (llamados métodos). El objetivo de la POO es hacer que el código sea más fácil de entender, mantener y reutilizar. Es una forma natural de pensar en los problemas y cómo resolverlos. 

La Programación Orientada a Objetos (POO) surgió en la década de 1960, específicamente en 1967, con la creación del lenguaje de programación Simula. Simula fue desarrollado por los científicos noruegos Ole-Johan Dahl e Ivar Jacobson en el Centro Noruego de Computación. Simula fue originalmente diseñado para simulaciones, pero introdujo conceptos que hoy son fundamentales en POO, como clases, objetos, herencia, y polimorfismo. Estos conceptos luego fueron adoptados y refinados en otros lenguajes de programación más populares, como Smalltalk (1972), C++ (1983), Java (1995) y más.


## Clases y objetos:

**Clases:** Son plantillas o moldes que definen cómo serán los objetos (por ejemplo, una Persona).

**Objetos:** Son las instancias creadas a partir de esas clases (por ejemplo, Juan es una instancia de la clase Persona). Métodos y propiedades: 

• Las propiedades son los datos que pertenecen a la clase (como nombre o edad). 
• Los métodos son las acciones que pueden realizar las clases (como getNombre() o setEdad()).

## Encapsulamiento (Protección de los datos)

El encapsulamiento consiste en ocultar los detalles internos de una clase y exponer solo lo necesario mediante métodos públicos. Esto protege los datos y asegura que solo se modifiquen o accedan de manera controlada. Encapsulamiento: Oculta detalles internos para proteger los datos y controlarlos.


```TypeScript

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

Motivo de ser del encapsulamiento: El encapsulamiento permite controlar el acceso a los datos internos de una clase. Esto evita que datos importantes, como la edad o el nombre en este caso, sean alterados directamente sin validación. Ayuda a prevenir errores y a mantener la integridad de los datos.

**¿Qué significa void?**

En el código anterior en TypeScript, **void** es un tipo que indica que una función no devuelve ningún valor. Es decir, cuando se usa void, significa que la función hace algo (como modificar datos, mostrar mensajes, etc.) pero **no devuelve** un valor al ser llamada. En algunos lenguajes se lo puede llamar "procediemientos"

Ejemplo sencillo:
```TypeScript

	public setEdad(nuevaEdad: number): void {
		this.edad = nuevaEdad;
	}
	
```
**¿Qué es this?**

La palabra clave this se refiere al objeto actual en el que se está ejecutando el código. En una clase, this te permite acceder a las propiedades y métodos de ese mismo objeto.

Ejemplo sencillo:
```TypeScript

		public setEdad(nuevaEdad: number): void {
			   this.edad = nuevaEdad;
		}
		
```
Aquí, **this.edad** se refiere a la propiedad edad del **objeto actual** (por ejemplo, un Persona específico). El uso de **this** es crucial porque nos ayuda a diferenciar entre variables locales y propiedades de la clase. La función setEdad cambia la edad de la persona, pero no devuelve ningún valor.

**2. Herencia (Reutilización de código)**

La herencia permite que una clase hija herede propiedades y métodos de una clase padre, facilitando la reutilización de código. En este ejemplo, una clase Empleado hereda de una clase Persona. **Herencia**: Facilita la reutilización de código al permitir que una clase herede características de otra.

Ejemplo: Clases Persona y Empleado (Herencia)
```TypeScript

		// Clase base
		class Persona {
		    private nombre: string;
		    private edad: number;

		    constructor(nombre: string, edad: number) {
		        this.nombre = nombre;
		        this.edad = edad;
		    }

		    public getNombre(): string {
		        return this.nombre;
		    }

		    public getEdad(): number {
		        return this.edad;
		    }
		}

		// Clase derivada
		class Empleado extends Persona {
		    private salario: number;

		    constructor(nombre: string, edad: number, salario: number) {
		        super(nombre, edad); // Llamar al constructor de Persona
		        this.salario = salario;
		    }

		    public getSalario(): number {
		        return this.salario;
		    }

		    public trabajar(): void {
		        console.log(`${this.getNombre()} está trabajando.`);
		    }
		}

		// Uso de la herencia
		const empleado = new Empleado("Ana", 30, 50000);
		console.log(empleado.getNombre()); // Ana
		empleado.trabajar(); // Ana está trabajando.
		
```
Motivo de ser de la herencia: La herencia permite crear nuevas clases que reutilizan el código de clases existentes. Así, en lugar de duplicar el código para el manejo de nombre y edad, la clase Empleado hereda esas características de Persona. Esto facilita el mantenimiento y la extensión de funcionalidades.

**3. Polimorfismo (Capacidad de un objeto de tomar diferentes formas)**

Polimorfismo usando tanto interfaces como clases abstractas en TypeScript.

El polimorfismo permite que una función se comporte de manera diferente según el tipo de objeto que reciba. En este ejemplo, el método “hacer_volar” que funciona tanto para un helicóptero como para un Avión.

En este caso, tanto Helicóptero como Avión implementan la interfaz Volador, lo que “garantiza” (contrato) que ambos tienen el método volar(). El **aeropuerto** puede manejar ambos sin preocuparse por los detalles de cómo vuelan, solo llama a volar() y deja que cada objeto haga lo suyo.

**Ejemplo: Método hacer_volar (Método Polimórfico)**

```TypeScript

		// Interface para objetos que pueden volar
		interface Volador {
		    volar(): void;
		}

		// Clase Helicoptero implementando la interfaz Volador
		class Helicoptero implements Volador {
		    public volar(): void {
		        console.log("El helicóptero está volando usando sus hélices.");
		    }
		}

		// Clase Avion implementando la interfaz Volador
		class Avion implements Volador {
		    public volar(): void {
		        console.log("El avión está volando usando motores.");
		    }
		}

		// Clase Aeropuerto que hace volar cualquier objeto que implemente la interfaz Volador
		class Aeropuerto {
		    public hacer_volar(volador: Volador): void {
		        volador.volar();
		    }
		}

		// Uso del polimorfismo en la clase Aeropuerto
		const aeropuerto = new Aeropuerto();
		const helicoptero = new Helicoptero();
		const avion = new Avion();

		aeropuerto.hacer_volar(helicoptero); // El helicóptero está volando usando sus hélices.
		aeropuerto.hacer_volar(avion);       // El avión está volando usando motores.
		
```


**Reutilización de código:** Este ejemplo muestra cómo podemos reutilizar el mismo método hacer_volar para diferentes tipos de objetos sin tener que escribir un método diferente para cada uno.

**Extensibilidad:** Si mañana queremos agregar un Dron, solo tendríamos que crear una clase Dron que implemente la interfaz Volador. No hay que modificar el código del Aeropuerto.

La **interfaz** “define un contrato” sin imponer cómo deben implementarse los detalles. Esto es útil cuando queremos que muchas clases diferentes compartan un comportamiento, pero no queremos forzarlas a heredar de una clase común.

**Interfaces** son útiles cuando quieres que diferentes clases (que no están necesariamente relacionadas) compartan un comportamiento, pero implementen ese comportamiento de manera diferente.

Usamos **interfaz** en el ejemplo de Aeropuerto, Helicóptero y Avión porque **no hay una relación jerárquica** (Es un…), pero ambos comparten el comportamiento de volar. Si solo queremos definir el comportamiento común, pero cada clase debe implementar su propia versión sin imponer cómo se implementan.

**Otro ejemplo de polimorfismo:**
```TypeScript

		abstract class Animal {

		    // Propiedad concreta (se hereda a todas las subclases)
		    public nombre: string;

		    constructor(nombre: string) {
		        this.nombre = nombre;
		    }

		    // Método concreto (todas las subclases heredan este comportamiento)
		    public moverse(): void {
		        console.log(`${this.nombre} se está moviendo.`);
		    }

		    // Método abstracto (cada subclase debe proporcionar su propia implementación)
		    public abstract hacerSonido(): void;
		}

		class Perro extends Animal {
		    public hacerSonido(): void {
		        console.log("El perro ladra.");
		    }
		}

		class Gato extends Animal {
		    public hacerSonido(): void {
		        console.log("El gato maúlla.");
		    }
		}

		const perro = new Perro("Rex");
		perro.moverse(); // Rex se está moviendo.
		perro.hacerSonido(); // El perro ladra.

		const gato = new Gato("Felix");
		gato.moverse(); // Felix se está moviendo.
		gato.hacerSonido(); // El gato maúlla.
		
```

En el ejemplo anterior, el polimorfismo se expresa dado que diferentes clases (**Perro** y **Gato**) implementan el método **hacerSonido()** de formas distintas. Esto permite que podamos tratar a los objetos Perro y Gato como si fueran del mismo tipo (es decir, como Animal), pero con comportamientos diferentes en función del tipo de objeto real.

Usamos clase abstracta en el ejemplo de Animal, Perro y Gato porque tienen una relación **jerárquica** natural y queremos compartir código y estructura. Existe una relación **"es un"** (Ej., **Perro** es un **Animal**).

Clases abstractas son útiles cuando tienes una jerarquía clara y algunas implementaciones compartidas entre las clases derivadas.

**¿Qué deben tener las clases abstractas?**

Las **clases abstractas** pueden tener:

**Métodos y propiedades concretos**: Ee heredan a las subclases tal cual. Estos son métodos y propiedades que **sí tienen una implementación** y que se heredan tal cual a las clases hijas. En el ejemplo, nombre y el método moverse() son **concretos**, lo que significa que **sí se heredan** a las clases hijas (Perro y Gato). Ambos heredan la capacidad de moverse de la misma manera, ya que **todos los animales comparten ese comportamiento común**.

Es **correcto** que las clases abstractas puedan (y a menudo lo hacen) tener métodos y propiedades **propias y concretas**, que se comparten entre todas las clases hijas.

**Métodos abstractos**: las subclases están obligadas a implementar de manera específica. Son métodos **sin implementación**, y obligan a las clases hijas a proporcionar su propia versión de ese método. El método hacerSonido() es **abstracto**, lo que significa que **no tiene implementación** en la clase abstracta Animal, pero **todas las subclases deben implementarlo**.

Cada subclase (Perro y Gato) proporciona su propia versión de hacerSonido(), ya que el sonido de un perro y un gato es diferente, pero **todos los animales tienen un sonido**.

**Importante**: No es **obligatorio** que las clases abstractas tengan **solo** métodos o propiedades "exclusivas" de la clase abstracta. El propósito de una clase abstracta es proporcionar una estructura común, que puede incluir tanto métodos concretos (que se heredan) como métodos abstractos (que obligan a las subclases a implementarlos).

**1. Polimorfismo con Interfaces (Volador, Helicoptero, Avion)**
Este ejemplo usa una interfaz para lograr polimorfismo. La interfaz Volador define un contrato que cualquier clase que la implemente debe seguir, es decir, debe tener un método volar().

**Ventajas del enfoque con interfaces:**

• **Flexibilidad:** Cualquier clase que implemente la interfaz Volador puede ser utilizada con el método hacer_volar(), independientemente de su jerarquía. No hay una relación directa entre Helicoptero y Avion más allá de que ambos "pueden volar".
	
• **Separación de responsabilidades:** No es necesario que Helicoptero y Avion compartan una clase padre, simplemente deben implementar la interfaz Volador.
	
• **Extensibilidad:** Si quieres agregar un nuevo tipo de objeto volador (como un Dron), solo necesitas implementar la interfaz, sin modificar el código existente.

**2. Polimorfismo con Clases Abstractas (Animal, Perro, Gato)**
Este ejemplo usa una clase abstracta para lograr polimorfismo. La clase abstracta Animal define un método abstracto hacerSonido(), que cada subclase (Perro, Gato) debe implementar de manera diferente. También tiene un método concreto moverse() que es compartido por todas las subclases.

Ventajas del enfoque con clases abstractas:

• **Reutilización de código:** Las clases abstractas permiten que las subclases hereden métodos y propiedades comunes. En este caso, moverse() es compartido entre Perro y Gato, evitando duplicación de código.

• **Relación jerárquica clara:** Hay una relación natural de herencia entre las clases (Perro es un Animal, Gato es un Animal). Esto facilita la organización del código cuando las clases tienen un comportamiento común, pero también necesitan especializar ciertos comportamientos.

• **Obligatoriedad:** Las subclases deben implementar los métodos abstractos definidos en la clase abstracta, lo que garantiza que cada subclase tenga su propia versión de hacerSonido().

**Comparación entre Interfaces y Clases Abstractas en Polimorfismo:**

|**Característica**|**Clases Interfaces**|**Clases Abstractas**| 
| ----------- | -------------- | -----------------------
|Jerarquía |No impone una jerarquía o herencia. |Define una jerarquía clara de clases. |
|Herencia múltiple |Una clase puede implementar múltiples interfaces. |Una clase solo puede heredar de una clase abstracta. |
|Uso|Se usa para definir un comportamiento común sin imponer implementación.  |Se usa cuando hay una estructura o comportamiento común y algunas partes necesitan ser implementadas por las subclases.|
|Reutilización de código|No permite reutilización de código entre clases.|Permite reutilizar código en las subclases (por ejemplo, `moverse()` en `Animal`). |
|Relación entre clases| Relación de **comportamiento compartido** (no necesariamente están relacionadas). |Relación de **herencia** (por ejemplo, `Perro` y `Gato` son `Animales`). |


**¿Cuándo usar uno u otro?**

• **Usa interfaces** cuando quieres que diferentes clases compartan un comportamiento común, pero no necesariamente estén relacionadas entre sí jerárquicamente. En este caso, Helicoptero y Avion solo comparten la capacidad de volar.

• **Usa clases abstractas** cuando tienes una jerarquía clara y quieres compartir tanto comportamientos comunes (con métodos concretos) como forzar la implementación de ciertos métodos por parte de las subclases (con métodos abstractos). En este caso, todos los Animales pueden moverse, pero cada uno hace un sonido diferente.

**Reflexión final:**

• **Interfaces** son perfectas cuando quieres que varias clases no relacionadas compartan ciertos comportamientos (como volar en el caso del aeropuerto).

• **Clases abstractas** son útiles cuando las clases tienen un comportamiento común que pueden heredar y especializar (como moverse en el caso de los animales, donde además cada uno tiene su propio sonido).
Ambos enfoques demuestran el polimorfismo: diferentes clases pueden implementar un comportamiento común de maneras distintas.

**Resumen**

• **Clases y objetos**: Las clases son plantillas para crear objetos, que son instancias de esas clases.

• **Encapsulamiento**: Protege los datos, permitiendo el acceso controlado.

• **Herencia**: Permite que una clase reutilice código de otra.

• **Polimorfismo:** Diferentes clases pueden compartir métodos con comportamientos distintos.
