"""
Genera el manual de usuario de Mesa de Servicio TI en formato Word (.docx).
Replica visualmente el formato de NW GCA REG 02 (Manual GCA).
NATIVOWEB S.A.S. - NW MDA REG 02
"""

import os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor, Emu
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

BASE = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS = os.path.join(BASE, "screenshots")
ASSETS = os.path.join(BASE, "assets")
OUTPUT = os.path.join(BASE, "NW_MDA_REG_02_Manual_Usuario_Mesa_Servicio_TI_1_0_0.docx")

LOGO_HEADER = os.path.join(ASSETS, "logo_header.png")
LOGO_COVER = os.path.join(ASSETS, "logo_cover.png")

# Colores del manual de referencia
TABLE_HEADER_BG = "4472C4"  # Azul del header de tabla del manual GCA
BLACK = RGBColor(0x00, 0x00, 0x00)
GRAY_DARK = RGBColor(0x33, 0x33, 0x33)
GRAY_MED = RGBColor(0x66, 0x66, 0x66)
GRAY_LIGHT = RGBColor(0x99, 0x99, 0x99)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

doc = Document()

# ── Estilos base ─────────────────────────────────────────
style_normal = doc.styles['Normal']
style_normal.font.name = 'Calibri'
style_normal.font.size = Pt(10)
style_normal.font.color.rgb = GRAY_DARK
style_normal.paragraph_format.space_after = Pt(6)
style_normal.paragraph_format.space_before = Pt(0)
style_normal.paragraph_format.line_spacing = 1.15

# Headings: negro, bold - como el manual de referencia
for level, size in [(1, 18), (2, 13), (3, 11)]:
    h = doc.styles[f'Heading {level}']
    h.font.name = 'Calibri'
    h.font.size = Pt(size)
    h.font.color.rgb = BLACK
    h.font.bold = True
    h.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    h.paragraph_format.space_after = Pt(4)

# Margenes carta
for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)
    section.header_distance = Cm(1.0)
    section.footer_distance = Cm(1.0)

# ── Header con logo + texto ──────────────────────────────
header = doc.sections[0].header
header.is_linked_to_previous = False
ht = header.add_table(1, 2, width=Inches(6.5))
ht.alignment = WD_TABLE_ALIGNMENT.CENTER
# Logo
c0 = ht.cell(0, 0)
c0.width = Inches(1.5)
p0 = c0.paragraphs[0]
p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
if os.path.exists(LOGO_HEADER):
    r0 = p0.add_run()
    r0.add_picture(LOGO_HEADER, height=Inches(0.4))
# Texto empresa
c1 = ht.cell(0, 1)
p1 = c1.paragraphs[0]
p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r1 = p1.add_run("NATIVOWEB S.A.S.  |  NIT 901986453-2")
r1.font.size = Pt(8)
r1.font.color.rgb = GRAY_MED
# Quitar bordes de tabla header
for cell in ht.rows[0].cells:
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
        '<w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '</w:tcBorders>')
    tcPr.append(tcBorders)

# ── Footer con codigo + pagina ───────────────────────────
footer = doc.sections[0].footer
footer.is_linked_to_previous = False
ft = footer.add_table(1, 2, width=Inches(6.5))
ft.alignment = WD_TABLE_ALIGNMENT.CENTER
# Codigo documental
fc0 = ft.cell(0, 0)
fp0 = fc0.paragraphs[0]
fp0.alignment = WD_ALIGN_PARAGRAPH.LEFT
fr0 = fp0.add_run("NW MDA REG 02  ·  Manual de usuario")
fr0.font.size = Pt(8)
fr0.font.color.rgb = GRAY_MED
# Pagina (campo automatico)
fc1 = ft.cell(0, 1)
fp1 = fc1.paragraphs[0]
fp1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
fr1a = fp1.add_run("Pagina ")
fr1a.font.size = Pt(8)
fr1a.font.color.rgb = GRAY_MED
# Campo PAGE
fldChar1 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="begin"/>')
fr1b = fp1.add_run()
fr1b._r.append(fldChar1)
instrText = parse_xml(f'<w:instrText {nsdecls("w")} xml:space="preserve"> PAGE </w:instrText>')
fr1c = fp1.add_run()
fr1c._r.append(instrText)
fldChar2 = parse_xml(f'<w:fldChar {nsdecls("w")} w:fldCharType="end"/>')
fr1d = fp1.add_run()
fr1d._r.append(fldChar2)
fr1d.font.size = Pt(8)
# Quitar bordes footer
for cell in ft.rows[0].cells:
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = parse_xml(f'<w:tcBorders {nsdecls("w")}>'
        '<w:top w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:left w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:bottom w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '<w:right w:val="none" w:sz="0" w:space="0" w:color="auto"/>'
        '</w:tcBorders>')
    tcPr.append(tcBorders)

# ── Helpers ──────────────────────────────────────────────
fig_counter = [0]

def add_para(text, bold=False, size=10, color=GRAY_DARK, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.bold = bold
    return p

def add_figure(filename, caption):
    fig_counter[0] += 1
    # Caption ABOVE image (like reference: descriptive text above screenshot)
    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    cap.paragraph_format.space_after = Pt(4)
    run_c = cap.add_run(caption)
    run_c.font.size = Pt(10)
    run_c.font.color.rgb = GRAY_DARK
    run_c.font.italic = True
    # Image
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_after = Pt(12)
    path = os.path.join(SCREENSHOTS, filename)
    if os.path.exists(path):
        run = p.add_run()
        run.add_picture(path, width=Inches(5.8))
    else:
        p.add_run(f"[Imagen no encontrada: {filename}]")

def add_procedure(steps):
    doc.add_heading("Procedimiento", level=3)
    for i, step in enumerate(steps, 1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(0.5)
        p.paragraph_format.space_after = Pt(3)
        run = p.add_run(f"{i}. {step}")
        run.font.size = Pt(10)
        run.font.color.rgb = GRAY_DARK

def add_verification(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(6)
    run_b = p.add_run("Verificacion del resultado. ")
    run_b.font.bold = True
    run_b.font.size = Pt(10)
    run_b.font.color.rgb = GRAY_DARK
    run_t = p.add_run(text)
    run_t.font.size = Pt(10)
    run_t.font.color.rgb = GRAY_DARK

def add_note(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    run = p.add_run(text)
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY_MED
    run.font.italic = True

def set_cell_bg(cell, color_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}" w:val="clear"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def add_styled_table(headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    # Style header row
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        set_cell_bg(cell, TABLE_HEADER_BG)
        p = cell.paragraphs[0]
        run = p.add_run(h)
        run.font.bold = True
        run.font.size = Pt(9)
        run.font.color.rgb = WHITE
    # Data rows
    for r, row_data in enumerate(rows):
        for c, val in enumerate(row_data):
            cell = table.rows[r + 1].cells[c]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(9)
            run.font.color.rgb = GRAY_DARK
    # Apply thin borders
    tbl = table._tbl
    tblPr = tbl.tblPr if tbl.tblPr is not None else parse_xml(f'<w:tblPr {nsdecls("w")}/>')
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        '<w:top w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:left w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:bottom w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:right w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>'
        '</w:tblBorders>'
    )
    tblPr.append(borders)
    return table

def page_break():
    doc.add_page_break()


# ══════════════════════════════════════════════════════════
# PORTADA
# ══════════════════════════════════════════════════════════

# Logo grande centrado
p_logo = doc.add_paragraph()
p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
p_logo.paragraph_format.space_before = Pt(40)
if os.path.exists(LOGO_COVER):
    r_logo = p_logo.add_run()
    r_logo.add_picture(LOGO_COVER, width=Inches(2.5))

doc.add_paragraph()

# Titulo principal
p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
run_title = p_title.add_run("Mesa de Servicio TI")
run_title.font.size = Pt(26)
run_title.font.bold = True
run_title.font.color.rgb = BLACK

# Subtitulo
p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.LEFT
run_sub = p_sub.add_run("Manual de usuario")
run_sub.font.size = Pt(14)
run_sub.font.color.rgb = GRAY_DARK

# Version
p_ver = doc.add_paragraph()
run_ver = p_ver.add_run("Version del software 1.0.0  |  Obra terminada en 2026")
run_ver.font.size = Pt(10)
run_ver.font.color.rgb = GRAY_DARK

# Descripcion
add_para(
    "Instrucciones de acceso, operacion y consulta de la version 1.0.0. Dirigido a administradores, "
    "lideres TIC, tecnicos de soporte, gestores de inventario, usuarios finales y cuentadantes.",
    size=10
)

doc.add_paragraph()

# Tabla de identificacion (estilo GCA: header azul)
add_styled_table(
    ["Identificacion", "Detalle"],
    [
        ["Empresa", "NATIVOWEB S.A.S."],
        ["NIT", "901986453-2"],
        ["Autores", "BRAYAN ALFONSO APARICIO DURAN\nMARLY TATIANA RANGEL MORENO"],
        ["Edicion documental", "Septiembre de 2026"],
        ["Codigo documental", "NW MDA REG 02"],
    ]
)

doc.add_paragraph()
add_para("Bucaramanga  ·  Colombia", size=10, color=GRAY_DARK)

page_break()

# ══════════════════════════════════════════════════════════
# USO DEL MANUAL Y ACCESO
# ══════════════════════════════════════════════════════════
doc.add_heading("Uso del manual y acceso al sistema", level=1)

add_para(
    "El Sistema de Mesa de Servicio TI centraliza la gestion de soporte tecnico, "
    "inventario de activos tecnologicos y mantenimientos institucionales. Este manual permite localizar "
    "la funcion, ejecutar el procedimiento y comprobar el resultado de cada actuacion."
)

doc.add_heading("Preparacion del acceso", level=2)
add_procedure([
    "Solicite al administrador la direccion de acceso y una cuenta personal. Utilice la organizacion que corresponda a su trabajo.",
    "Abra la direccion en un navegador actualizado con JavaScript habilitado. Compruebe que la direccion corresponda al servicio autorizado.",
    "Ingrese su correo y contrasena y seleccione Iniciar sesion. El sistema dirige la navegacion segun los roles asignados.",
    "Revise el perfil y las opciones disponibles antes de registrar informacion. Al finalizar, utilice Cerrar sesion.",
])

doc.add_heading("Credenciales y errores de acceso", level=2)
add_para(
    "Una cuenta personal permite asociar cada actuacion con su responsable. Evite compartir credenciales. "
    "Si no puede ingresar, compruebe el correo, el teclado y el estado de la cuenta. La recuperacion de "
    "contrasena esta disponible mediante el enlace Olvide mi contrasena en la pantalla de inicio de sesion."
)

add_figure("01-login.png", "Pantalla de inicio de sesion con campos de correo y contrasena.")

doc.add_heading("Datos de demostracion", level=2)
add_para(
    "Las capturas ilustran estados y pantallas del producto. La operacion real debe utilizar datos "
    "autorizados y los catalogos definidos para cada organizacion."
)

add_figure("21-forgot-password.png", "Formulario de recuperacion de contrasena mediante correo electronico.")

page_break()

# ══════════════════════════════════════════════════════════
# NAVEGACION Y PERFILES
# ══════════════════════════════════════════════════════════
doc.add_heading("Navegacion y perfiles", level=1)

add_para(
    "En escritorio, el menu lateral agrupa las funciones disponibles. La zona central presenta listados, "
    "formularios y detalles; la cabecera contiene controles de usuario y avisos. Las opciones visibles "
    "varian segun los permisos."
)

add_styled_table(
    ["Necesidad", "Ubicacion funcional"],
    [
        ["Supervisar la operacion global", "Dashboard del Lider TIC"],
        ["Crear o consultar solicitudes de soporte", "Tickets (Usuario Final)"],
        ["Atender tickets y gestionar turnos", "Panel del Tecnico, Mi turno"],
        ["Registrar y consultar activos", "Inventario, Registro de equipos"],
        ["Consultar equipos a cargo", "Dashboard del Cuentadante, Hoja de vida"],
        ["Enviar comunicaciones masivas", "Mensajeria (Lider TIC)"],
        ["Configurar o controlar la operacion", "Usuarios, SLA, Logs, Configuracion (Admin)"],
        ["Consultar resultados", "Reportes y Metricas"],
    ]
)

doc.add_heading("Controles comunes", level=2)
add_para(
    "Use el buscador para localizar un registro y combine los filtros disponibles. Revise la paginacion: "
    "un listado puede mostrar solo una parte de los resultados. Al cambiar de periodo o estado, vuelva a "
    "comprobar que los filtros correspondan a su consulta."
)
add_para(
    "Los botones Nuevo, Registrar, Guardar, Exportar o equivalentes ejecutan operaciones diferentes. Lea "
    "el encabezado del formulario y verifique el registro seleccionado antes de confirmar. Una pantalla "
    "vacia puede indicar falta de datos, un filtro restrictivo o ausencia de permiso."
)

doc.add_heading("Responsabilidad por la confirmacion", level=2)
add_para(
    "Antes de dar por terminado un procedimiento, revise el mensaje de resultado y localice el registro "
    "en su listado o detalle. La informacion ingresada en un formulario que aun no se ha confirmado no "
    "equivale a un registro guardado."
)

page_break()

# ══════════════════════════════════════════════════════════
# ADMINISTRADOR
# ══════════════════════════════════════════════════════════
doc.add_heading("Panel de administracion", level=1)

add_para(
    "El administrador tiene acceso total al sistema. Gestiona usuarios, roles, parametros SLA, "
    "configuracion del servidor, logs de auditoria, reportes y la administracion multitenant."
)

add_figure("02-admin-dashboard.png", "Dashboard global del administrador con KPIs, graficas de tickets y estado de activos.")

add_procedure([
    "Revise los indicadores principales: total de usuarios, tickets, activos y mantenimientos.",
    "Consulte la grafica de tickets creados versus resueltos en los ultimos siete dias.",
    "Revise el desglose de estados de tickets y activos en los paneles inferiores.",
    "Utilice las acciones rapidas para navegar a las secciones de configuracion.",
])
add_verification("Los indicadores reflejan el estado actual del sistema y las graficas corresponden al periodo consultado.")

page_break()

doc.add_heading("Gestion de usuarios", level=1)
add_para(
    "Permite crear, consultar y eliminar cuentas de usuario. Cada usuario se asocia a un rol, "
    "una sede y un departamento."
)
add_figure("03-admin-usuarios.png", "Listado de usuarios con formulario de creacion, busqueda y filtro por rol.")

add_procedure([
    "Abra Usuarios desde el menu lateral.",
    "Utilice el buscador o el filtro de rol para localizar un usuario.",
    "Seleccione Crear usuario para registrar una nueva cuenta. Complete nombre, correo, contrasena, rol, sede y departamento.",
    "Para eliminar un usuario, seleccione la accion correspondiente y confirme.",
])
add_verification("El usuario aparece en el listado con el rol y sede asignados.")
add_note("No comparta contrasenas de acceso. Cada cuenta debe tener un responsable unico.")

page_break()

doc.add_heading("Roles y permisos", level=1)
add_para("La matriz de roles muestra los seis perfiles del sistema con sus permisos asociados. Esta vista es de consulta; los roles se configuran durante el despliegue inicial.")
add_figure("04-admin-roles.png", "Matriz de roles RBAC con los permisos asociados a cada perfil.")

page_break()

doc.add_heading("Configuracion de tiempos SLA", level=1)
add_para("Define los tiempos de respuesta y resolucion por prioridad de ticket. Los cambios se aplican a los nuevos tickets creados despues de guardar.")
add_figure("05-admin-sla.png", "Tabla editable de tiempos SLA por prioridad con opcion de guardado.")

add_procedure([
    "Abra SLA desde el menu lateral.",
    "Seleccione Editar parametros SLA.",
    "Modifique los tiempos de respuesta y resolucion para cada prioridad.",
    "Seleccione Guardar cambios para persistir la configuracion.",
])
add_verification("Los nuevos tickets calculan su plazo SLA con los tiempos actualizados.")

page_break()

doc.add_heading("Logs de auditoria", level=1)
add_para("El registro de auditoria conserva las acciones realizadas por los usuarios del sistema. Permite filtrar por tipo de entidad, rango de fechas y busqueda por descripcion.")
add_figure("06-admin-logs.png", "Registro de auditoria con filtros de tipo, fecha y busqueda.")

add_procedure([
    "Abra Logs desde el menu lateral.",
    "Aplique filtros de tipo de entidad, fecha o busqueda para localizar una actuacion.",
    "Revise el detalle de la operacion: usuario, accion, entidad afectada y cambios realizados.",
])
add_verification("Las actuaciones revisadas tienen registro con usuario, fecha y detalle de cambios.")

page_break()

doc.add_heading("Reportes y metricas", level=1)
add_para("Genera reportes en tiempo real de tickets, activos y mantenimientos. Los datos pueden exportarse en formato PDF o Excel. La seccion inferior permite configurar reportes programados.")
add_figure("07-admin-reportes.png", "Modulo de reportes con desgloses por estado y configuracion de envio programado.")

add_procedure([
    "Abra Reportes y seleccione el tipo de reporte deseado: Tickets, Activos o Mantenimientos.",
    "Revise los totales y desgloses presentados.",
    "Configure reportes programados en la seccion inferior para envio automatico por correo.",
])
add_verification("Los datos del reporte corresponden al periodo y tipo seleccionado.")

page_break()

doc.add_heading("Configuracion del sistema", level=1)
add_para("Administra los parametros generales del sistema, la configuracion SMTP para envio de correos y la informacion de respaldo.")
add_figure("08-admin-configuracion.png", "Panel de configuracion con pestanas General, SMTP y Backup.")

add_procedure([
    "Abra Configuracion desde el menu.",
    "Seleccione la pestana correspondiente: General, SMTP o Backup.",
    "Modifique los valores necesarios y seleccione Guardar configuracion.",
])
add_verification("Los parametros guardados se aplican a las operaciones del sistema correspondientes.")

page_break()

# ══════════════════════════════════════════════════════════
# LIDER TIC
# ══════════════════════════════════════════════════════════
doc.add_heading("Panel del Lider TIC", level=1)
add_para(
    "El Lider TIC supervisa toda la operacion de la mesa de servicio. Tiene visibilidad global sobre "
    "tickets, tecnicos, inventario y comunicaciones."
)
add_figure("09-lider-dashboard.png", "Dashboard del Lider TIC con KPIs, distribucion por prioridad, carga por tecnico y cola de tickets sin asignar.")

add_procedure([
    "Revise los cinco indicadores: tickets abiertos, en progreso, resueltos, tasa de resolucion y criticos.",
    "Consulte la grafica de distribucion por prioridad y la tendencia semanal.",
    "Revise la carga operativa por tecnico en el panel inferior.",
    "Atienda la cola de tickets sin asignar utilizando el boton Asignar.",
])
add_verification("Los indicadores reflejan el estado actual y la cola de espera esta atendida.")

page_break()

doc.add_heading("Gestion de tickets", level=1)
add_para("Lista completa de tickets con filtros por estado, busqueda por titulo y paginacion.")
add_figure("10-lider-tickets.png", "Listado completo de tickets con pestanas de estado, buscador y paginacion.")

add_procedure([
    "Abra Todos los tickets desde el menu.",
    "Utilice las pestanas de estado o el buscador para filtrar.",
    "Seleccione un ticket para ver su detalle, asignacion y seguimiento.",
])
add_verification("El listado muestra los tickets correspondientes al filtro aplicado.")

page_break()

doc.add_heading("Asignacion de tickets", level=1)
add_para("Permite asignar tickets pendientes a tecnicos disponibles. La vista se divide en dos paneles: tickets sin asignar a la izquierda y tecnicos a la derecha.")
add_figure("11-lider-asignacion.png", "Panel de asignacion con tickets pendientes y tecnicos disponibles.")

add_procedure([
    "Abra Asignar / Reasignar desde el menu.",
    "Seleccione un ticket de la lista izquierda.",
    "Seleccione Asignar junto al tecnico deseado.",
    "El ticket se actualiza automaticamente a estado En Progreso.",
])
add_verification("El ticket tiene tecnico asignado y su estado refleja la asignacion.")
add_note("La asignacion automatica considera la sede y la carga del tecnico. Reasigne manualmente cuando la situacion lo requiera.")

page_break()

doc.add_heading("Mensajeria masiva", level=1)
add_para("Envia comunicaciones por correo electronico o SMS a grupos de usuarios segmentados por rol y sede.")
add_figure("12-lider-mensajeria.png", "Formulario de mensajeria masiva con seleccion de canal, segmentacion e historial.")

add_procedure([
    "Abra Mensajeria masiva.",
    "Seleccione el canal de envio: Correo, SMS o Ambos.",
    "Escriba el asunto y el cuerpo del mensaje.",
    "Configure la segmentacion de audiencia por rol y sede.",
    "Seleccione Enviar mensaje. El historial de envios aparece en la parte inferior.",
])
add_verification("El mensaje aparece en el historial con estado Enviado y la cantidad de destinatarios.")

page_break()

# ══════════════════════════════════════════════════════════
# TECNICO
# ══════════════════════════════════════════════════════════
doc.add_heading("Panel del Tecnico de Soporte", level=1)
add_para(
    "El tecnico atiende los tickets asignados. Su panel muestra indicadores personales y la tabla de "
    "tickets con filtros por estado y prioridad."
)
add_figure("13-tecnico-dashboard.png", "Panel del tecnico con KPIs personales, tabla de tickets y filtros.")

add_procedure([
    "Revise los cuatro indicadores: abiertos, en progreso, pendientes y cerrados hoy.",
    "Filtre los tickets por estado o prioridad usando las pestanas y selectores.",
    "Seleccione un ticket para abrir su detalle y realizar acciones.",
])
add_verification("Los indicadores corresponden a los tickets asignados al tecnico autenticado.")

doc.add_heading("Detalle del ticket", level=2)
add_para(
    "Al abrir un ticket, el tecnico puede cambiar su estado, registrar diagnosticos, escalar el caso o "
    "cerrarlo con documentacion de los pasos realizados. La seccion de seguimiento permite enviar "
    "comentarios al solicitante."
)
add_procedure([
    "Seleccione un ticket desde la tabla.",
    "Revise la descripcion, ubicacion y datos del solicitante.",
    "Cambie el estado mediante el selector y seleccione Actualizar.",
    "Para cerrar, seleccione Cerrar Ticket, documente los pasos y confirme la restauracion del servicio.",
    "Use el campo de seguimiento para enviar notas tecnicas.",
])
add_verification("El ticket tiene el estado actualizado y los comentarios registrados son visibles para el solicitante.")

page_break()

doc.add_heading("Calendario de turnos", level=1)
add_para("Consulta el horario semanal asignado, la sede y el edificio de cada dia. El turno activo se destaca en el calendario.")
add_figure("14-tecnico-turno.png", "Calendario semanal de turnos con indicador de turno activo y estadisticas.")

add_procedure([
    "Abra Mi turno desde el menu lateral.",
    "Revise el turno activo destacado en la parte superior.",
    "Consulte el calendario semanal con horarios, sedes y edificios.",
])
add_verification("El calendario refleja la programacion vigente y el turno activo corresponde al dia actual.")

page_break()

# ══════════════════════════════════════════════════════════
# USUARIO FINAL
# ══════════════════════════════════════════════════════════
doc.add_heading("Panel del Usuario Final", level=1)
add_para("El usuario final crea y da seguimiento a sus solicitudes de soporte tecnico.")
add_figure("15-usuario-dashboard.png", "Dashboard del usuario final con KPIs, tickets recientes y acceso a crear solicitud.")

add_procedure([
    "Revise los tres indicadores: tickets abiertos, en progreso y cerrados.",
    "Consulte la tabla de tickets recientes. Seleccione uno para ver su detalle.",
    "Seleccione Crear ticket o el boton flotante para registrar una nueva solicitud.",
])
add_verification("El dashboard muestra los tickets del usuario autenticado y sus estados actualizados.")

page_break()

doc.add_heading("Creacion de un ticket", level=1)
add_para(
    "El formulario de creacion permite clasificar la solicitud, describir el problema, indicar la "
    "ubicacion y adjuntar archivos de soporte."
)
add_figure("16-usuario-crear-ticket.png", "Formulario de creacion de ticket con clasificacion por tipo, detalle del problema y ubicacion.")

add_procedure([
    "Seleccione Crear ticket desde el menu o el boton flotante.",
    "Seleccione el tipo: Incidente, Solicitud o Requerimiento.",
    "Complete la categoria, prioridad, asunto y descripcion detallada.",
    "Indique la sede y ubicacion fisica del problema.",
    "Adjunte archivos de soporte si es necesario.",
    "Seleccione Enviar solicitud.",
])
add_verification("El ticket aparece en el listado con estado Abierto y los datos ingresados son correctos.")
add_note("Describa el problema con suficiente detalle para que el tecnico pueda diagnosticar sin necesidad de contacto adicional.")

page_break()

doc.add_heading("Detalle y seguimiento del ticket", level=1)
add_para("Permite consultar la descripcion, el estado actual, la linea de tiempo de eventos y la conversacion con el tecnico asignado.")
add_figure("17-usuario-detalle-ticket.png", "Vista de detalle del ticket con descripcion, timeline, conversacion y datos de ubicacion.")

add_procedure([
    "Abra un ticket desde el listado o el dashboard.",
    "Revise la descripcion, el estado y la prioridad asignada.",
    "Consulte la linea de tiempo para ver los eventos del ticket.",
    "Utilice el campo de conversacion para enviar mensajes al tecnico asignado.",
])
add_verification("El estado del ticket y los mensajes reflejan la atencion en curso.")

page_break()

# ══════════════════════════════════════════════════════════
# GESTOR DE INVENTARIO
# ══════════════════════════════════════════════════════════
doc.add_heading("Inventario de activos", level=1)
add_para(
    "El gestor de inventario administra el parque tecnologico institucional: registro de activos, "
    "mantenimientos preventivos y correctivos, y asignacion de responsables."
)
add_figure("18-inventario-dashboard.png", "Listado de activos TI con KPIs, filtros, seleccion multiple y acciones masivas.")

add_procedure([
    "Abra Lista de activos desde el menu.",
    "Utilice los filtros de categoria, sede y estado para localizar activos.",
    "Busque por nombre o serial en el campo de busqueda.",
    "Seleccione activos con los checkboxes para acciones masivas: cambiar estado o exportar a CSV.",
    "Seleccione Ver hoja de vida para consultar el detalle completo de un activo.",
])
add_verification("El listado muestra los activos correspondientes a los filtros aplicados y las acciones masivas se ejecutan correctamente.")

page_break()

doc.add_heading("Registro de un nuevo equipo", level=1)
add_para(
    "El formulario de registro organiza la captura en secciones colapsables: Identificacion, Adquisicion, "
    "Ubicacion, Responsabilidad, Informacion adicional y Adjuntos."
)
add_figure("19-inventario-nuevo-equipo.png", "Formulario de registro de nuevo equipo con secciones colapsables y campos obligatorios.")

add_procedure([
    "Seleccione Registrar nuevo equipo.",
    "En Identificacion, complete nombre, categoria, marca, modelo y serial.",
    "En Adquisicion, registre fecha de compra y garantia si se dispone de la informacion.",
    "En Ubicacion, indique sede, piso y ubicacion especifica.",
    "En Responsabilidad, seleccione el cuentadante y el estado inicial del activo.",
    "En Adjuntos, agregue actas de entrega, facturas u otros documentos de soporte.",
    "Seleccione Guardar equipo.",
])
add_verification("El activo aparece en el listado con codigo autogenerado y los datos ingresados son coherentes.")
add_note("Verifique que el serial no este duplicado antes de guardar. El sistema genera automaticamente el codigo del activo.")

page_break()

# ══════════════════════════════════════════════════════════
# CUENTADANTE
# ══════════════════════════════════════════════════════════
doc.add_heading("Panel del Cuentadante", level=1)
add_para(
    "El cuentadante consulta los equipos bajo su responsabilidad. Su vista incluye indicadores de "
    "equipos a cargo, alertas de estado y acceso a la hoja de vida de cada activo."
)
add_figure("20-cuentadante-dashboard.png", "Dashboard del cuentadante con indicadores de equipos, alertas y tabla de inventario asignado.")

add_procedure([
    "Revise los tres indicadores: equipos a cargo, averiados y mantenimientos del mes.",
    "Atienda las alertas de equipos con estado critico si aparecen.",
    "Seleccione Ver hoja de vida para consultar el detalle completo de un activo.",
])
add_verification("Los equipos listados corresponden a los activos bajo custodia del cuentadante autenticado.")

doc.add_heading("Hoja de vida del equipo", level=2)
add_para(
    "La hoja de vida presenta la informacion tecnica completa del activo: categoria, marca, modelo, "
    "serial, ubicacion, especificaciones del sistema, estado de garantia, cuentadante actual y el "
    "historial de mantenimientos."
)
add_procedure([
    "Seleccione Ver hoja de vida en cualquier equipo de la tabla.",
    "Revise la informacion tecnica, las especificaciones y el estado de garantia.",
    "Consulte el historial de mantenimientos en la linea de tiempo inferior.",
])
add_verification("La hoja de vida tiene identificacion y custodia coherentes, con soporte de las actuaciones registradas.")
add_note("Los movimientos fisicos y los registros del sistema deben conciliarse con el responsable de bienes.")

page_break()

# ══════════════════════════════════════════════════════════
# GLOSARIO
# ══════════════════════════════════════════════════════════
doc.add_heading("Glosario", level=1)

add_styled_table(
    ["Termino", "Definicion"],
    [
        ["Ticket", "Solicitud de soporte tecnico registrada por un usuario. Puede ser un incidente, una solicitud o un requerimiento."],
        ["SLA", "Acuerdo de Nivel de Servicio. Define los tiempos maximos de respuesta y resolucion por prioridad."],
        ["Activo", "Equipo tecnologico registrado en el inventario institucional (computador, impresora, servidor, etc.)."],
        ["Cuentadante", "Persona responsable de la custodia de uno o mas activos tecnologicos."],
        ["Escalamiento", "Derivacion de un ticket a un nivel superior de soporte cuando el tecnico asignado no puede resolver el caso."],
        ["Mantenimiento preventivo", "Revision programada de un activo para prevenir fallas."],
        ["Mantenimiento correctivo", "Intervencion para reparar una falla detectada en un activo."],
        ["RBAC", "Control de Acceso Basado en Roles. Mecanismo que restringe las funciones del sistema segun el rol del usuario."],
        ["Tenant", "Institucion cliente en el esquema multitenant. Cada tenant tiene su propia base de datos aislada."],
    ]
)

page_break()

# ══════════════════════════════════════════════════════════
# REFERENCIAS
# ══════════════════════════════════════════════════════════
doc.add_heading("Referencias", level=1)

refs = [
    "American Psychological Association. (2020). Publication manual of the American Psychological Association (7a ed.). American Psychological Association. https://doi.org/10.1037/0000165-000",
    "NativoWeb S.A.S. (2026). Mesa de Servicio TI: Documentacion del sistema (Version 1.0.0). Documento interno no publicado.",
    "Laravel. (2024). Laravel 12.x documentation. https://laravel.com/docs/12.x",
    "Vercel. (2025). Next.js 16 documentation. https://nextjs.org/docs",
]

for ref in refs:
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.first_line_indent = Cm(-1.27)
    p.paragraph_format.left_indent = Cm(1.27)
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(ref)
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY_DARK

# ── Guardar ──────────────────────────────────────────────
doc.save(OUTPUT)
print(f"Manual generado: {OUTPUT}")
print(f"Tamano: {os.path.getsize(OUTPUT) / 1024 / 1024:.1f} MB")
