# Librerías de trabajo y flujo de instalación del proyecto:

## Flujo de instalación:

1. Crear un proyecto en React Native:
   
   Dentro de un directorio vacío, hacemos: 

   ```bash
   npx create-expo-app nombre_de_tu_app
   ```

2. Creación de la carpeta router
   Cuando el proyecto se esté creando, nos preguntará    por el nombre de una carpeta router, puedes poner    cualquier nombre, pero es recomendable ponerlo todo en   minúscula, simple e intuitivo.

   ```bash
   proyect name: tuProyecto
   ```
   
3. Refrescar dependencias (node_modules):
   Por defecto se nos creará una carpeta node modules a la que le añadiremos dependencias futuras, si quieremos refrescar las dependencias y actualizar las añadidas cada vez que entremos al proyecto hacemos:
   
   ```bash
   npm install
   ```

4. Limpiar el proyecto:
   Si queremos simplificar nuestro proyecto solo con los archivos esenciales para el desarrollo hacemos:
   
```bash
npm run reset-project
```

5. Ejecutar para pruebas:

   ```bash
   npx expo start
   ```

## Librerías de trabajo adicionales utilizadas durante el desarrollo:

```bash
Desarrollo - Kevin:
npx install lottie-react-native -> (Animaciones)

npx expo install expo expo-font expo-router -> (si falla el router)

npx audit fix --force -> (fuerza a arreglar conflictos con dependencias istaladas)

npm install -g npm@nueva_versión -> (actualiza la versión de node de forma global)

npm install -g expo-cli -> (Expo-CLI Para confictos de dependencias JSON, Útil después de Mergear a GitHub).

npx expo-doctor -> (Depende de Expo-CLI, se utiliza para hacer test instantáneos y resolver conflictos entre dependencias JSON).


Desarrollo - Pablo:

Desarrollo - Gabriel:

Desarrollo - Hector:

```
