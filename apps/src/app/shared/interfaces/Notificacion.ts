export interface Notificacion {
  notificaciones_id:      number;
  notificaciones_leido:   boolean;
  notificaciones_mensaje: string;
  user_id:                number;
  tipoNotificaciones_id:  number;
  created_at:             Date;
  updated_at:             Date;
  deleted_at:             Date;
}
