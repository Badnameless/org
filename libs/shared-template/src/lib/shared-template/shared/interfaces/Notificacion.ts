export interface Notificacion {
  notificaciones_id:      number;
  notificaciones_leido:   boolean;
  notificaciones_mensaje: string;
  user_id:                number;
  tipoNotificaciones_id:  number;
  created_at:             Date;
  updated_at:             Date;
  deleted_at:             Date;
  tipo_notificacion:      TipoNotificacion;
}

export interface TipoNotificacion {
  tipoNotificaciones_id:   number;
  tipoNotificaciones_code: number;
  tipoNotificaciones_name: TipoNotificacionesName;
  created_at:              Date;
  updated_at:              Date;
}

export enum TipoNotificacionesName {
  Personalizado = "Nuevo Mensaje",
  PlanAgotado = "Plan agotado",
  RechazoDGII = "Rechazo DGII",
}
