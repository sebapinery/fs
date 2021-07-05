
# File System

### Ejercicio Backend Shipnow.

#### Descripcion

Desarrolla una consola simple para manejar archivos y carpetas ingresando comandos por teclado, similar a
Bash, por ejemplo.

La consola no puede utilizar librerías externas.
Todos los recursos deben ser mantenidos en memoria y no persistidos a disco. Los archivos no necesita tener
extensión pero deben tener metadata (la información de la metadata queda a tu criterio).

## Iniciar

```bash
node index
```

## Usuarios por defecto

```bash
Superadmin: 
username: admin
password: admin

Regular:
username: normal
password: 1234

read_only: (Usuario actual al iniciar la terminal o hacer logout de cualquier usuario)
username: ghest
password: 1234
```
## Comandos de manejo de archivos

Archivos y carpetas

Crear un archivo con un contenido
```bash
create_file "file_1" "Contenido"
```

Ver el contenido de un archivo
```bash
show "file_1"
```
Ver la metadata de un archivo
```bash
metadata "file_1"
```
Crear una carpeta
```bash
create_folder "folder_1"
```
Entrar a una carpeta
```bash
cd "folder_1"
```
Volver una carpeta para atrás:
```bash
cd ..
```
Eliminar archivo o carpeta. En caso de que el nombre se encuentre repetido en un archivo o carpeta indique como tercer parametro el tipo de elemento que quiere eliminar. 

```bash
destroy "file_1"

destroy "folder_1"

En caso de nombre duplicado ingrese:
destroy "index" file // destroy "index" folder

```
Ver contenido de la carpeta actual
```bash
ls
```
Obtener la ruta de la carpeta actual
```bash
whereami
```
## Comandos de manejo de usuarios

Crear un usuario nuevo como superusuario
```bash
create_user "username" "password" -role="ready_only"
```

Actualizar contraseña del usuario actual
```bash
update_password "new_password"
```

Remover usuarios como superusuario
```bash
destroy_user "username"
```

Loguearte como usuario
```bash
login "username" "password"
```
Obtener nombre del usuario actual
```bash
whoami
```

## Comandos de persistencia de datos

Cargar datos desde archivo JSON. Como tercer parametro indique si va a hacer backup de "data" o "users"

```bash
-persist "Nombre del Archivo" "tipo"
```

Hacer backup de datos
```bash
backup
```
