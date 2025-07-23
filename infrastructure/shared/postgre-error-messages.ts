export function postgreDefaultErrorMessage(code?: string, defaultMessage?: string): string {
  if (!code) return 'Ocurrió un error inesperado. Intenta nuevamente.';

  const startsWith = (prefix: string) => code.startsWith(prefix);

  if (startsWith('08')) return 'No se pudo conectar a la base de datos. Verifica tu conexión a internet.';
  if (startsWith('28')) return 'Permisos insuficientes para realizar esta acción.';
  if (startsWith('3D')) return 'Error en la configuración de la base de datos. Contacta con soporte técnico.';
  if (startsWith('53')) return 'El servicio de base de datos está saturado. Intenta más tarde.';
  if (code === '57P01') return 'El servicio de base de datos fue detenido temporalmente.';
  if (code === '08006') return 'La conexión con el servidor se perdió. Intenta nuevamente.';

  return defaultMessage ?? 'Ocurrió un problema técnico inesperado. Contacta con soporte si el problema persiste.';
}