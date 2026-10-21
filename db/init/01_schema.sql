-- Se ejecuta automáticamente la PRIMERA vez que se crea el contenedor de MySQL
-- (sobre la base de datos definida en DB_NAME).

CREATE TABLE IF NOT EXISTS Usuarios (
  Id      INT AUTO_INCREMENT PRIMARY KEY,
  Nombre  VARCHAR(100) NOT NULL,
  Correo  VARCHAR(150) NOT NULL UNIQUE,
  Pass    VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Registros (
  Id             INT AUTO_INCREMENT PRIMARY KEY,
  Foto1          VARCHAR(255) NULL,
  Foto2          VARCHAR(255) NULL,
  Firma          VARCHAR(255) NULL,
  FechaRegistro  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
