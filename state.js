// In-memory prototype state. Resets on every server restart — that's
// the intended behavior for a demo running on Railway.

function createInitialState() {
  const now = Date.now();
  const min = (m) => new Date(now - m * 60_000).toISOString();
  const hr  = (h) => min(h * 60);
  const day = (d) => min(d * 1440);

  const users = [
    // ----- Empleados Tropigas (admin role) -----
    { id: 'EMP-2104', name: 'M. Ríos',  initials: 'MR', role: 'admin', email: 'm.rios@tropigas.pr',  department: 'Administración', sucursal: 'Bayamón · Oficina Central', ext: 'x4521', supervisor: 'L. Vega', asset: 'LT-BYM-0114' },
    { id: 'EMP-1981', name: 'A. Cruz',  initials: 'AC', role: 'admin', email: 'a.cruz@tropigas.pr',  department: 'Operaciones',    sucursal: 'Caguas',                    ext: 'x3204', supervisor: 'R. Mejía', asset: 'LT-CAG-0091' },
    { id: 'EMP-1755', name: 'D. Soto',  initials: 'DS', role: 'admin', email: 'd.soto@tropigas.pr',  department: 'Finanzas',       sucursal: 'Ponce',                     ext: 'x5102', supervisor: 'C. Aponte', asset: 'LT-PCE-0044' },
    { id: 'EMP-2098', name: 'P. Rivas', initials: 'PR', role: 'admin', email: 'p.rivas@tropigas.pr', department: 'RRHH',           sucursal: 'Mayagüez',                  ext: 'x6018', supervisor: 'M. Báez', asset: 'LT-MAG-0019' },
    { id: 'EMP-1881', name: 'R. Lozada', initials: 'RL', role: 'admin', email: 'r.lozada@tropigas.pr', department: 'Ventas',       sucursal: 'Bayamón · Oficina Central', ext: 'x4533', supervisor: 'L. Vega', asset: 'LT-BYM-0124' },
    { id: 'EMP-2042', name: 'E. Núñez',  initials: 'EN', role: 'admin', email: 'e.nunez@tropigas.pr', department: 'Logística',     sucursal: 'Caguas',                    ext: 'x3211', supervisor: 'R. Mejía', asset: 'LT-CAG-0098' },

    // ----- UCG IT team (it role) -----
    { id: 'UCG-IT-007', name: 'J. Marrero', initials: 'JM', role: 'it', email: 'j.marrero@ucg.pr', team: 'IT Support · Tier 2', sucursal: 'UCG · San Juan', ext: 'x2104', supervisor: 'A. Vega · Director IT' },
    { id: 'UCG-IT-014', name: 'R. Quiles',  initials: 'RQ', role: 'it', email: 'r.quiles@ucg.pr',  team: 'IT Support · Tier 2', sucursal: 'UCG · San Juan', ext: 'x2108', supervisor: 'A. Vega · Director IT' },
    { id: 'UCG-IT-021', name: 'L. Rivera',  initials: 'LR', role: 'it', email: 'l.rivera@ucg.pr',  team: 'IT Support · Tier 1', sucursal: 'UCG · San Juan', ext: 'x2112', supervisor: 'A. Vega · Director IT' },
    { id: 'UCG-IT-009', name: 'C. Méndez',  initials: 'CM', role: 'it', email: 'c.mendez@ucg.pr',  team: 'IT Support · Tier 1', sucursal: 'UCG · San Juan', ext: 'x2115', supervisor: 'A. Vega · Director IT' },
    { id: 'UCG-IT-018', name: 'A. Torres',  initials: 'AT', role: 'it', email: 'a.torres@ucg.pr',  team: 'IT Support · Tier 1', sucursal: 'UCG · San Juan', ext: 'x2118', supervisor: 'A. Vega · Director IT' },
    { id: 'UCG-IT-027', name: 'D. Vázquez', initials: 'DV', role: 'it', email: 'd.vazquez@ucg.pr', team: 'IT Support · Tier 2', sucursal: 'UCG · San Juan', ext: 'x2121', supervisor: 'A. Vega · Director IT' },
  ];

  function slaFor(importance) {
    return importance === 'Alta' ? 4 : importance === 'Media' ? 8 : 24;
  }

  const tickets = [
    {
      id: 'SM-00043',
      summary: 'Cola de Salesforce atascada · 12 trabajos pendientes',
      description: 'Salesforce no está procesando los reportes del cierre mensual. La cola muestra 12 trabajos pendientes y no avanzan.',
      empleadoId: 'EMP-2104',
      categoria: 'Sistema',
      importance: 'Alta',
      status: 'En progreso',
      assigneeId: 'UCG-IT-007',
      slaHours: slaFor('Alta'),
      assetId: 'LT-BYM-0114',
      tags: ['salesforce', 'cola-impresion', 'recurrente'],
      createdAt: min(45), updatedAt: min(12),
      comments: [
        { author: 'M. Ríos',    authorId: 'EMP-2104',   role: 'empleado', type: 'message', body: 'Salesforce no procesa los reportes del cierre. Tengo presentación a las 3pm.', createdAt: min(45) },
        { author: 'J. Marrero', authorId: 'UCG-IT-007', role: 'it',       type: 'message', body: 'Hola M. — voy a revisar la cola del print server. Te aviso en 15 min.', createdAt: min(40) },
        { author: 'J. Marrero', authorId: 'UCG-IT-007', role: 'it',       type: 'note',    body: 'KB-029 aplicable. Cola en print-srv-bym tiene 47 trabajos atascados. Reiniciando spooler.', createdAt: min(28) },
        { author: 'sistema',    authorId: null,         role: 'system',   type: 'system',  body: 'SLA 50% consumido (2h restantes)', createdAt: min(25) },
      ],
    },
    { id: 'SM-00042', summary: 'No imprime desde Outlook',          empleadoId: 'EMP-1981', categoria: 'Hardware', importance: 'Media', status: 'Recibido',    assigneeId: null,           slaHours: slaFor('Media'), createdAt: min(95),  updatedAt: min(95),  comments: [] },
    { id: 'SM-00041', summary: 'Salesforce no carga reportes',       empleadoId: 'EMP-2104', categoria: 'Sistema',  importance: 'Media', status: 'En progreso', assigneeId: 'UCG-IT-014',   slaHours: slaFor('Media'), createdAt: hr(2.5),  updatedAt: hr(1),    comments: [] },
    { id: 'SM-00040', summary: 'Excel se traba con archivos grandes', empleadoId: 'EMP-1755', categoria: 'Software', importance: 'Baja',  status: 'En progreso', assigneeId: 'UCG-IT-009',   slaHours: slaFor('Baja'),  createdAt: hr(4),    updatedAt: hr(2),    comments: [] },
    { id: 'SM-00039', summary: 'Reset de contraseña SSO',            empleadoId: 'EMP-2098', categoria: 'Acceso',   importance: 'Baja',  status: 'Resuelto',    assigneeId: 'UCG-IT-021',   slaHours: slaFor('Baja'),  createdAt: hr(5),    updatedAt: hr(4.2), comments: [] },
    { id: 'SM-00038', summary: 'VPN se desconecta cada 10 min',      empleadoId: 'EMP-2104', categoria: 'Red',      importance: 'Media', status: 'En progreso', assigneeId: 'UCG-IT-007',   slaHours: slaFor('Media'), createdAt: hr(6),    updatedAt: hr(2),    comments: [] },
    { id: 'SM-00037', summary: 'Outlook no envía adjuntos pesados',  empleadoId: 'EMP-1881', categoria: 'Sistema',  importance: 'Alta',  status: 'Recibido',    assigneeId: null,           slaHours: slaFor('Alta'),  createdAt: min(180), updatedAt: min(180), comments: [] },
    { id: 'SM-00036', summary: 'Teclado no responde · Logitech K380', empleadoId: 'EMP-1755', categoria: 'Hardware', importance: 'Baja',  status: 'Resuelto',    assigneeId: 'UCG-IT-018',   slaHours: slaFor('Baja'),  createdAt: day(1),   updatedAt: hr(20),   comments: [] },
    { id: 'SM-00035', summary: 'Acceso a carpeta compartida bloqueado', empleadoId: 'EMP-2042', categoria: 'Acceso', importance: 'Media', status: 'En progreso', assigneeId: 'UCG-IT-014',   slaHours: slaFor('Media'), createdAt: day(1.2), updatedAt: hr(18),   comments: [] },
    { id: 'SM-00034', summary: 'Pantalla parpadea intermitentemente', empleadoId: 'EMP-1981', categoria: 'Hardware', importance: 'Media', status: 'Resuelto',    assigneeId: 'UCG-IT-021',   slaHours: slaFor('Media'), createdAt: day(1.4), updatedAt: day(1),   comments: [] },
    { id: 'SM-00033', summary: 'Lentitud al abrir Power BI',          empleadoId: 'EMP-2098', categoria: 'Sistema',  importance: 'Baja',  status: 'Cerrado',     assigneeId: 'UCG-IT-009',   slaHours: slaFor('Baja'),  createdAt: day(2),   updatedAt: day(1.5), comments: [] },
    { id: 'SM-00032', summary: 'No se puede instalar Adobe Acrobat',  empleadoId: 'EMP-1881', categoria: 'Software', importance: 'Baja',  status: 'Cerrado',     assigneeId: 'UCG-IT-018',   slaHours: slaFor('Baja'),  createdAt: day(2.3), updatedAt: day(1.8), comments: [] },
    { id: 'SM-00029', summary: 'Reset de contraseña EMAS',           empleadoId: 'EMP-2104', categoria: 'Acceso',   importance: 'Baja',  status: 'Resuelto',    assigneeId: 'UCG-IT-007',   slaHours: slaFor('Baja'),  createdAt: day(3),   updatedAt: day(2.5), comments: [] },
    { id: 'SM-00021', summary: 'Monitor 2 no enciende',              empleadoId: 'EMP-2104', categoria: 'Hardware', importance: 'Baja',  status: 'Resuelto',    assigneeId: 'UCG-IT-018',   slaHours: slaFor('Baja'),  createdAt: day(5),   updatedAt: day(4),   comments: [] },
  ];

  const kb = [
    { id: 'KB-029', title: 'Cola Salesforce atascada', categoria: 'Sistema',  uses: 12, sintomas: 'Reportes no se generan; cola con 10+ trabajos pendientes que no avanzan.', causa: 'Print spooler congelado en print-srv-bym tras pico de tráfico mensual.', solucion: ['Conectar a print-srv-bym vía RDP', 'net stop spooler && net start spooler', 'Verificar cola en sf-admin'], prevencion: 'Monitor automático: alerta si cola > 20 trabajos.', relatedTickets: ['SM-00043', 'SM-00041'] },
    { id: 'KB-014', title: 'Reiniciar print server',   categoria: 'Hardware', uses: 8,  sintomas: 'No imprime desde ningún equipo de la sucursal.', causa: 'Spooler de Windows colgado.', solucion: ['Servicios → Print Spooler → Reiniciar'], prevencion: 'Limpieza de cola semanal.', relatedTickets: ['SM-00042'] },
    { id: 'KB-007', title: 'Reset de contraseña SSO',  categoria: 'Acceso',   uses: 24, sintomas: 'Empleado no puede ingresar a Salesforce/EMAS/Outlook.', causa: 'Password expirado o cuenta bloqueada por intentos fallidos.', solucion: ['Verificar identidad', 'Active Directory → Reset password', 'Generar password temporal'], prevencion: 'Política: cambio cada 90 días con aviso a 7d.', relatedTickets: ['SM-00039', 'SM-00029'] },
    { id: 'KB-022', title: 'VPN se desconecta intermitente', categoria: 'Red', uses: 6, sintomas: 'Pérdida de conexión cada 5-15 min en VPN.', causa: 'MTU mal configurado en cliente.', solucion: ['Set MTU 1380 en cliente', 'Reconectar'], prevencion: 'Plantilla de instalación con MTU preconfigurado.', relatedTickets: ['SM-00038'] },
    { id: 'KB-018', title: 'Excel se traba con archivos grandes', categoria: 'Software', uses: 5, sintomas: 'Excel congela al abrir archivos > 50 MB.', causa: 'Falta de RAM o complementos antiguos.', solucion: ['Cerrar otras apps', 'Modo seguro: excel /safe', 'Deshabilitar add-ins'], prevencion: 'Recomendar Power BI para datasets grandes.', relatedTickets: ['SM-00040'] },
    { id: 'KB-031', title: 'Adobe Acrobat instalación falla', categoria: 'Software', uses: 3, sintomas: 'Instalador termina con error 1603.', causa: 'Versión previa no removida limpiamente.', solucion: ['Adobe Cleaner Tool', 'Reinstalar'], prevencion: 'Standardizar en Foxit Reader.', relatedTickets: ['SM-00032'] },
  ];

  return {
    users,
    tickets,
    kb,
    counters: { lastTicketId: 43 },
  };
}

module.exports = { createInitialState };
