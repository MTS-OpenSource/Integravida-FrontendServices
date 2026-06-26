# Integravida Frontend Services

> **Plataforma de servicios frontend moderna para Integravida - Desarrollado por MTS OpenSource**

[![TypeScript](https://img.shields.io/badge/TypeScript-63.7%25-blue?style=flat-square)](https://www.typescriptlang.org/)
[![HTML](https://img.shields.io/badge/HTML-21.3%25-orange?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-15%25-green?style=flat-square)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Angular](https://img.shields.io/badge/Framework-Angular-red?style=flat-square)](https://angular.dev/)
[![License](https://img.shields.io/badge/License-Open%20Source-brightgreen?style=flat-square)](LICENSE)

## 📋 Descripción

**Integravida Frontend Services** es una aplicación moderna desarrollada con Angular, diseñada para proporcionar una interfaz de usuario robusta y escalable. Este repositorio contiene los servicios y componentes frontend necesarios para la plataforma Integravida.

**Stack tecnológico:**
- **TypeScript (63.7%)** - Lenguaje principal para lógica de negocio
- **HTML (21.3%)** - Estructura y marcado semántico
- **CSS (15%)** - Estilos y diseño responsivo

## 🚀 Primeros pasos

### Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Angular CLI](https://angular.dev/tools/cli) v21.2.10 o superior
- npm o yarn como gestor de paquetes

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MTS-OpenSource/Integravida-FrontendServices.git
cd Integravida-FrontendServices

# Instalar dependencias
npm install
```

## 💻 Desarrollo

### Servidor de desarrollo local

Para iniciar el servidor de desarrollo:

```bash
# Iniciar Angular dev server
ng serve

# En otra terminal, inicia la API local (si aplica)
npm run api
```

Luego abre tu navegador en `http://localhost:4200/`. La aplicación se recargará automáticamente al modificar archivos de código fuente.

## 🏗️ Estructura del proyecto

```
src/
├── app/              # Componentes y servicios principales
├── assets/           # Recursos estáticos
├── styles/           # Estilos globales
└── environments/     # Configuración de entornos
```

## 🛠️ Comandos disponibles

### Generar componentes y artefactos

Angular CLI incluye herramientas poderosas para generar código:

```bash
# Generar un nuevo componente
ng generate component nombre-componente

# Generar un servicio
ng generate service nombre-servicio

# Generar un módulo
ng generate module nombre-modulo

# Ver todas las opciones disponibles
ng generate --help
```

### Compilación

Para compilar el proyecto y generar los artefactos de construcción:

```bash
ng build
```

Los archivos compilados se almacenan en el directorio `dist/`. La compilación de producción optimiza la aplicación para mejor rendimiento y velocidad.

```bash
# Compilación de producción optimizada
ng build --configuration production
```

## ✅ Pruebas

### Pruebas unitarias

Ejecutar pruebas unitarias con [Vitest](https://vitest.dev/):

```bash
ng test
```

### Pruebas end-to-end (E2E)

Para pruebas de extremo a extremo:

```bash
ng e2e
```

> **Nota:** Angular CLI no incluye framework de E2E por defecto. Elige el que mejor se adapte a tus necesidades (Cypress, Playwright, etc.).

## 📦 Construcción y Despliegue

### Despliegue a producción

```bash
# Compilar para producción
ng build --configuration production

# Los archivos listos para despliegue estarán en dist/
```

La aplicación está configurada para desplegar en [Google Firebase](https://integravida-appweb.web.app/).

## 📚 Recursos adicionales

- [Documentación oficial de Angular](https://angular.dev/)
- [Angular CLI - Overview and Command Reference](https://angular.dev/tools/cli)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia correspondiente.

## 📞 Contacto

**MTS OpenSource**
- GitHub: [@MTS-OpenSource](https://github.com/MTS-OpenSource)
- Sitio web: [Integravida](https://integravida-appweb.web.app/)

---

**Última actualización:** Junio 2026