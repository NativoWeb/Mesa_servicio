"""
Genera la Descripción del programa de Mesa de Servicio TI en formato Word (.docx).
Replica visualmente el formato de NW GCA REG 01 (Descripción GCA).
NATIVOWEB S.A.S. — NW MDA REG 01
"""

import os
from docx import Document
from docx.shared import Inches, Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(BASE, "assets")
LOGO_NATIVO = r"D:\MARLY\DOCUMENTOS PROYECTOS\NATIVOWEB\LOGO NATIVO.png"
LOGO_HEADER = os.path.join(ASSETS, "logo_header.png")
LOGO_COVER = os.path.join(ASSETS, "logo_cover.png")
OUTPUT = os.path.join(BASE, "NW_MDA_REG_01_Descripcion_Programa_Mesa_Servicio_TI_1_0_0.docx")

# Si no existe logo_cover, usar LOGO NATIVO
if not os.path.exists(LOGO_COVER) and os.path.exists(LOGO_NATIVO):
    LOGO_COVER = LOGO_NATIVO
if not os.path.exists(LOGO_HEADER) and os.path.exists(LOGO_NATIVO):
    LOGO_HEADER = LOGO_NATIVO

# Colores
TABLE_HEADER_BG = "4472C4"
BLACK = RGBColor(0x00, 0x00, 0x00)
GRAY_DARK = RGBColor(0x33, 0x33, 0x33)
GRAY_MED = RGBColor(0x66, 0x66, 0x66)
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

for level, size in [(1, 18), (2, 13), (3, 11)]:
    h = doc.styles[f'Heading {level}']
    h.font.name = 'Calibri'
    h.font.size = Pt(size)
    h.font.color.rgb = BLACK
    h.font.bold = True
    h.paragraph_format.space_before = Pt(14 if level == 1 else 10)
    h.paragraph_format.space_after = Pt(4)

# Márgenes carta
for section in doc.sections:
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)
    section.header_distance = Cm(1.0)
    section.footer_distance = Cm(1.0)

# ── Header ───────────────────────────────────────────────
header = doc.sections[0].header
header.is_linked_to_previous = False
ht = header.add_table(1, 2, width=Inches(6.5))
ht.alignment = WD_TABLE_ALIGNMENT.CENTER
c0 = ht.cell(0, 0)
c0.width = Inches(1.5)
p0 = c0.paragraphs[0]
p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
if os.path.exists(LOGO_HEADER):
    r0 = p0.add_run()
    r0.add_picture(LOGO_HEADER, height=Inches(0.4))
c1 = ht.cell(0, 1)
p1 = c1.paragraphs[0]
p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
r1 = p1.add_run("NATIVOWEB S.A.S.  |  NIT 901986453-2")
r1.font.size = Pt(8)
r1.font.color.rgb = GRAY_MED
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

# ── Footer ───────────────────────────────────────────────
footer = doc.sections[0].footer
footer.is_linked_to_previous = False
ft = footer.add_table(1, 2, width=Inches(6.5))
ft.alignment = WD_TABLE_ALIGNMENT.CENTER
fc0 = ft.cell(0, 0)
fp0 = fc0.paragraphs[0]
fp0.alignment = WD_ALIGN_PARAGRAPH.LEFT
fr0 = fp0.add_run("NW MDA REG 01  ·  Descripción del programa")
fr0.font.size = Pt(8)
fr0.font.color.rgb = GRAY_MED
fc1 = ft.cell(0, 1)
fp1 = fc1.paragraphs[0]
fp1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
fr1a = fp1.add_run("Página ")
fr1a.font.size = Pt(8)
fr1a.font.color.rgb = GRAY_MED
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
def add_para(text, bold=False, size=10, color=GRAY_DARK, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=6):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.bold = bold
    return p

def set_cell_bg(cell, color_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}" w:val="clear"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def add_styled_table(headers, rows):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        set_cell_bg(cell, TABLE_HEADER_BG)
        p = cell.paragraphs[0]
        run = p.add_run(h)
        run.font.bold = True
        run.font.size = Pt(9)
        run.font.color.rgb = WHITE
    for r, row_data in enumerate(rows):
        for c, val in enumerate(row_data):
            cell = table.rows[r + 1].cells[c]
            p = cell.paragraphs[0]
            run = p.add_run(val)
            run.font.size = Pt(9)
            run.font.color.rgb = GRAY_DARK
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

def add_note(text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    run = p.add_run(text)
    run.font.size = Pt(9)
    run.font.color.rgb = GRAY_MED
    run.font.italic = True


# ══════════════════════════════════════════════════════════
# PORTADA
# ══════════════════════════════════════════════════════════

p_logo = doc.add_paragraph()
p_logo.alignment = WD_ALIGN_PARAGRAPH.LEFT
p_logo.paragraph_format.space_before = Pt(40)
if os.path.exists(LOGO_COVER):
    r_logo = p_logo.add_run()
    r_logo.add_picture(LOGO_COVER, width=Inches(2.5))

doc.add_paragraph()

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.LEFT
run_title = p_title.add_run("Mesa de Servicio TI")
run_title.font.size = Pt(26)
run_title.font.bold = True
run_title.font.color.rgb = BLACK

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.LEFT
run_sub = p_sub.add_run("Descripción técnica y funcional del programa")
run_sub.font.size = Pt(14)
run_sub.font.color.rgb = GRAY_DARK

p_ver = doc.add_paragraph()
run_ver = p_ver.add_run("Versión del software 1.0.0  |  Obra terminada en 2026")
run_ver.font.size = Pt(10)
run_ver.font.color.rgb = GRAY_DARK

add_para(
    "Documento de identificación del software y de sus procedimientos para el registro de soporte "
    "lógico ante la Dirección Nacional de Derecho de Autor. Describe la versión comercial 1.0.0 "
    "y sus doce módulos.",
    size=10
)

doc.add_paragraph()

add_styled_table(
    ["Identificación", "Detalle"],
    [
        ["Empresa", "NATIVOWEB S.A.S."],
        ["NIT", "901986453-2"],
        ["Autores", "BRAYAN ALFONSO APARICIO DURAN\nMARLY TATIANA RANGEL MORENO"],
        ["Edición documental", "Septiembre de 2026"],
        ["Código documental", "NW MDA REG 01"],
    ]
)

doc.add_paragraph()
add_para("Bucaramanga  ·  Colombia", size=10, color=GRAY_DARK)

page_break()

# ══════════════════════════════════════════════════════════
# IDENTIFICACIÓN Y OBJETO DE LA OBRA
# ══════════════════════════════════════════════════════════
doc.add_heading("Identificación y objeto de la obra", level=1)

add_para(
    "La Mesa de Servicio TI es una aplicación web de NATIVOWEB S.A.S. que centraliza la gestión de "
    "soporte técnico, el inventario de activos tecnológicos y los mantenimientos institucionales. La "
    "versión 1.0.0 fue terminada en 2026, se encuentra probada y se ha divulgado mediante una demostración "
    "pública para su comercialización."
)

add_para(
    "NATIVOWEB S.A.S. conserva la titularidad patrimonial de los componentes propios del producto y lo "
    "comercializa mediante licencias de uso. Cada cliente utiliza el programa conforme a su licencia; el acceso al "
    "servicio no transfiere la propiedad intelectual del software. Los derechos morales de los autores se conservan."
)

add_styled_table(
    ["Dato", "Identificación"],
    [
        ["Título de la obra", "Mesa de Servicio TI"],
        ["Versión identificada", "1.0.0"],
        ["Año de terminación", "2026"],
        ["Tipo de obra", "Soporte lógico o programa de computador"],
        ["Modalidad", "Aplicación web SaaS multitenant"],
        ["Estado de divulgación", "Demostración pública"],
        ["Empresa titular", "NATIVOWEB S.A.S.  ·  NIT 901986453-2"],
        ["Autores", "BRAYAN ALFONSO APARICIO DURAN\nMARLY TATIANA RANGEL MORENO"],
    ]
)

doc.add_heading("Finalidad y usuarios", level=2)
add_para(
    "El programa organiza la información alrededor de los tickets de soporte y los activos tecnológicos. "
    "Sus usuarios intervienen sobre esos registros según su responsabilidad operativa, técnica o "
    "administrativa. Los perfiles definen el alcance funcional de cada cuenta y las pantallas disponibles "
    "para cada rol."
)

doc.add_heading("Organización del documento", level=2)
add_para(
    "La descripción presenta la arquitectura, los perfiles, los doce módulos, los procedimientos que conectan "
    "esos módulos y la organización de los datos. Finalmente delimita las funciones de seguridad y los "
    "componentes propios frente a los de terceros."
)

page_break()

# ══════════════════════════════════════════════════════════
# ARQUITECTURA DE LA APLICACIÓN
# ══════════════════════════════════════════════════════════
doc.add_heading("Arquitectura de la aplicación", level=1)

add_para(
    "La aplicación organiza la interacción en una capa de presentación web, una capa de procesamiento de "
    "operaciones y una capa de persistencia. El frontend utiliza Next.js y TypeScript como aplicación de "
    "página única; el backend utiliza PHP con Laravel y expone una API RESTful protegida con tokens. La "
    "persistencia relacional se apoya en PostgreSQL."
)

add_styled_table(
    ["Componente", "Tecnologías documentadas", "Responsabilidad"],
    [
        ["Presentación", "Next.js 16 · React 19 · TypeScript · Tailwind CSS 4",
         "Formularios, navegación y vistas por perfil."],
        ["Componentes UI", "shadcn/ui · Recharts 3",
         "Biblioteca de interfaz y visualización de indicadores."],
        ["Aplicación", "PHP 8.2 · Laravel 12 · Sanctum",
         "Validación, autorización y coordinación de operaciones."],
        ["Persistencia", "PostgreSQL 16+",
         "Entidades, relaciones e historial operativo."],
        ["Autorización", "spatie/laravel-permission 6.x",
         "Roles, permisos y control de acceso basado en roles."],
        ["Multitenencia", "stancl/tenancy 3.x",
         "Aislamiento de datos por organización cliente."],
        ["Estado del cliente", "Zustand 5 · TanStack React Query 5",
         "Gestión de estado persistido y caché de consultas."],
        ["Servicios web", "Nginx · Linux",
         "Atención de solicitudes y ejecución del servicio."],
    ]
)

doc.add_heading("Secuencia de procesamiento", level=2)

steps = [
    "La interfaz captura los datos del usuario y envía una solicitud autenticada al servidor mediante "
    "un token Bearer.",
    "El servidor identifica al usuario y su contexto de organización; la operación aplica sus reglas de "
    "validación y autorización según el rol asignado.",
    "La capa de aplicación consulta o modifica las entidades relacionadas y registra los resultados y las "
    "trazas que correspondan.",
    "La respuesta actualiza la vista o informa el resultado del procesamiento. Las tareas auxiliares pueden "
    "completarse en segundo plano.",
]
for i, step in enumerate(steps, 1):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(f"{i}. {step}")
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY_DARK

add_note(
    "Las tecnologías de terceros cumplen funciones de soporte. Su identificación no transfiere a Nativoweb la autoría de esos componentes "
    "ni declara una certificación del fabricante."
)

page_break()

# ══════════════════════════════════════════════════════════
# PERFILES Y ÁMBITOS DE OPERACIÓN
# ══════════════════════════════════════════════════════════
doc.add_heading("Perfiles y ámbitos de operación", level=1)

add_para(
    "Los roles agrupan permisos para facilitar la administración. El acceso efectivo depende de las asignaciones de "
    "la cuenta y del contexto de organización. La existencia de un rol no debe interpretarse como autorización "
    "universal para toda operación."
)

add_styled_table(
    ["Perfil", "Ámbito principal"],
    [
        ["Administrador del sistema", "Administración de la plataforma, usuarios, roles, SLA, logs, reportes y configuración."],
        ["Líder TIC", "Supervisión de la operación, asignación de tickets, gestión de técnicos y comunicaciones masivas."],
        ["Técnico de soporte", "Atención de tickets asignados, diagnóstico, escalamiento, gestión de turnos y cierre de casos."],
        ["Gestor de inventario", "Registro de activos tecnológicos, mantenimientos preventivos y correctivos, y asignación de responsables."],
        ["Usuario final", "Creación y seguimiento de solicitudes de soporte técnico."],
        ["Cuentadante", "Consulta de equipos bajo custodia, hoja de vida y alertas de mantenimiento."],
    ]
)

doc.add_heading("Contexto de organización", level=2)
add_para(
    "El modelo de organización utiliza multitenencia con bases de datos separadas por cliente. Cada tenant "
    "dispone de su propia instancia de datos aislada mediante el prefijo tenant_ en PostgreSQL. La identificación "
    "del tenant se resuelve por dominio. Los usuarios se vinculan a una organización y los registros operativos "
    "se asocian mediante el contexto del tenant activo."
)

doc.add_heading("Ámbitos de información", level=2)
add_para(
    "El sistema maneja información institucional de soporte técnico e inventario. Los datos de tickets, "
    "activos, mantenimientos y usuarios se restringen al contexto de la organización que los registra. "
    "La información de auditoría conserva la trazabilidad de las actuaciones realizadas por cada cuenta."
)

page_break()

# ══════════════════════════════════════════════════════════
# DESCRIPCIÓN DE LOS MÓDULOS
# ══════════════════════════════════════════════════════════

# --- M01 ---
doc.add_heading("Descripción de los módulos", level=1)

doc.add_heading("M01 Usuarios, roles y permisos", level=2)
add_para(
    "Administrar las identidades y delimitar las operaciones disponibles para cada perfil.",
    bold=True, size=10
)
add_para(
    "La administración registra cuentas, correo, estado de acceso, rol, sede y departamento. El mecanismo "
    "de autenticación valida las credenciales mediante Laravel Sanctum y emite un token Bearer que "
    "identifica la sesión. Las pantallas y las acciones protegidas se habilitan de acuerdo con los permisos "
    "asignados a través de spatie/laravel-permission."
)
add_para(
    "Los perfiles base son administrador del sistema, líder TIC, técnico de soporte, gestor de inventario, "
    "usuario final y cuentadante. Cada cuenta se asocia a una sede y a un departamento que definen su "
    "contexto operativo."
)
add_para(
    "Produce cuentas y asignaciones de acceso, datos del último ingreso y trazas asociadas a la actividad. La "
    "administración debe revisar las autorizaciones cuando cambia la función o finaliza la vinculación de una "
    "persona."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M02 ---
doc.add_heading("M02 Tickets de soporte", level=2)
add_para(
    "Registrar, clasificar y dar seguimiento a las solicitudes de soporte técnico institucional.",
    bold=True, size=10
)
add_para(
    "El usuario final crea un ticket seleccionando el tipo (incidente, solicitud o requerimiento), la categoría, "
    "la prioridad, el asunto y la descripción detallada del problema. El formulario incluye la ubicación "
    "física (sede, piso, ubicación específica) y permite adjuntar archivos de soporte."
)
add_para(
    "La consulta combina búsqueda por título con filtros por estado, prioridad y categoría. El detalle "
    "del ticket presenta la descripción, la línea de tiempo de eventos, la conversación con el técnico "
    "asignado y los datos de ubicación. Los estados del ciclo de vida son: abierto, en progreso, "
    "pendiente, resuelto y cerrado."
)
add_para(
    "Produce tickets con su identificador, historial de eventos, comentarios y archivos adjuntos. El ticket "
    "relaciona al solicitante, al técnico asignado y al activo vinculado cuando corresponde. Los tickets "
    "utilizan eliminación lógica para conservar la trazabilidad."
)

# --- M03 ---
doc.add_heading("M03 Gestión de activos tecnológicos", level=2)
add_para(
    "Conformar el inventario de equipos tecnológicos y relacionar cada activo con su custodia y atención.",
    bold=True, size=10
)
add_para(
    "El registro utiliza un formulario con secciones colapsables: identificación (nombre, categoría, marca, "
    "modelo, serial), adquisición (fecha de compra, garantía), ubicación (sede, piso, ubicación específica), "
    "responsabilidad (cuentadante, estado inicial) e información adicional. El código del activo se genera "
    "automáticamente con el formato UTS-{CAT}-{XXXX}."
)
add_para(
    "La consulta permite búsqueda por nombre o serial, con filtros por categoría, sede y estado. La vista "
    "admite selección múltiple para acciones masivas como cambiar estado, cambiar sede o exportar a CSV. "
    "Los estados del activo son: operativo, en mantenimiento, averiado, dado de baja y en bodega."
)
add_para(
    "Produce el inventario, los identificadores y los medios de consulta. Las especificaciones técnicas se "
    "almacenan en formato JSONB para adaptarse a las características de cada categoría de equipo. Los "
    "activos utilizan eliminación lógica."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M04 ---
doc.add_heading("M04 Mantenimientos", level=2)
add_para(
    "Relacionar la programación de la atención con su ejecución y con los recursos utilizados.",
    bold=True, size=10
)
add_para(
    "El módulo registra mantenimientos preventivos, correctivos, de actualización y de limpieza. Cada "
    "registro vincula al activo, el tipo de intervención, la descripción, la fecha de ejecución, el técnico "
    "responsable, las observaciones y el resultado final."
)
add_para(
    "La interfaz permite consultar mantenimientos por activo y por criterios de tipo, estado y período. "
    "La hoja de vida del equipo presenta el historial de mantenimientos en una línea de tiempo que "
    "relaciona cada intervención con el técnico y la fecha de ejecución."
)
add_para(
    "Produce registros de mantenimiento y su relación con el activo y el responsable. La programación y la "
    "ejecución se conservan como hechos diferentes para permitir el seguimiento de mantenimientos "
    "pendientes y completados."
)

# --- M05 ---
doc.add_heading("M05 Panel de indicadores", level=2)
add_para(
    "Presentar una visión consolidada de la operación y facilitar la consulta por período.",
    bold=True, size=10
)
add_para(
    "Cada perfil dispone de un panel adaptado a su ámbito. El administrador visualiza el estado del "
    "servidor, usuarios activos, tickets y activos globales. El líder TIC consulta tickets abiertos, en "
    "progreso, resueltos, tasa de cumplimiento SLA, críticos sin resolver, distribución por prioridad, "
    "carga por técnico y cola de tickets sin asignar."
)
add_para(
    "El técnico revisa sus indicadores personales: abiertos, en progreso, pendientes y cerrados hoy, con "
    "barras de SLA que alertan visualmente sobre el consumo del plazo. El usuario final consulta sus "
    "tickets abiertos, en progreso y cerrados. El cuentadante visualiza equipos a cargo, alertas activas "
    "y mantenimientos del mes."
)
add_para(
    "Produce visualizaciones de gestión asociadas al período, los filtros y los datos de la organización "
    "consultada. Los componentes gráficos utilizan Recharts para representar series en formatos de barras, "
    "líneas y sectores."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M06 ---
doc.add_heading("M06 Asignación y escalamiento", level=2)
add_para(
    "Distribuir los tickets entre los técnicos disponibles y gestionar las derivaciones.",
    bold=True, size=10
)
add_para(
    "El líder TIC accede al panel de asignación con dos columnas: tickets pendientes de asignación "
    "a la izquierda y técnicos disponibles con su carga operativa a la derecha. La asignación actualiza "
    "automáticamente el estado del ticket a en progreso."
)
add_para(
    "El técnico puede escalar un ticket cuando el caso excede su capacidad de resolución. El escalamiento "
    "registra el motivo y devuelve el ticket a la cola del líder para su reasignación. La asignación automática "
    "considera la sede y la carga del técnico como criterios de distribución."
)
add_para(
    "Produce asignaciones, reasignaciones y registros de escalamiento. La trazabilidad del ticket conserva "
    "cada cambio de responsable con su fecha y motivo."
)

# --- M07 ---
doc.add_heading("M07 Turnos de soporte", level=2)
add_para(
    "Organizar la disponibilidad del personal técnico por horario, sede y edificio.",
    bold=True, size=10
)
add_para(
    "La programación de turnos registra técnico, día, horario de inicio y fin, sede y edificio asignado. "
    "El técnico consulta su turno activo y su calendario semanal con indicadores visuales del turno vigente."
)
add_para(
    "La vista de calendario presenta los turnos organizados por día de la semana con la información de "
    "sede y horario. Las estadísticas del turno incluyen horas programadas y porcentaje de cobertura."
)
add_para(
    "Produce la programación de turnos y su relación con los técnicos. El líder TIC utiliza esta información "
    "para planificar la asignación de tickets según la disponibilidad."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M08 ---
doc.add_heading("M08 Mensajería masiva", level=2)
add_para(
    "Enviar comunicaciones institucionales a grupos de usuarios segmentados.",
    bold=True, size=10
)
add_para(
    "El líder TIC redacta mensajes seleccionando el canal de envío (correo electrónico, SMS o ambos), "
    "el asunto y el cuerpo del mensaje. La segmentación permite filtrar destinatarios por rol y por sede "
    "para dirigir la comunicación al público objetivo."
)
add_para(
    "El historial de envíos conserva la fecha, el canal, la cantidad de destinatarios y el estado de cada "
    "mensaje. La interfaz presenta los mensajes enviados en orden cronológico con sus métricas de alcance."
)
add_para(
    "Produce registros de mensajes masivos con su audiencia, canal y estado de entrega. El módulo no "
    "expone datos personales de los destinatarios individuales en el historial."
)

# --- M09 ---
doc.add_heading("M09 Acuerdos de nivel de servicio", level=2)
add_para(
    "Definir y controlar los tiempos de respuesta y resolución por prioridad.",
    bold=True, size=10
)
add_para(
    "El administrador configura los tiempos SLA mediante una tabla editable con cuatro niveles de "
    "prioridad: crítica, alta, media y baja. Cada nivel define el tiempo máximo de respuesta y el tiempo "
    "máximo de resolución. Los cambios se aplican a los nuevos tickets creados después de guardar."
)
add_para(
    "Los paneles de indicadores incorporan alertas visuales de cumplimiento SLA. Las barras de progreso "
    "utilizan código de color: verde cuando el consumo es inferior al cuarenta por ciento, amarillo entre "
    "el cuarenta y el setenta por ciento, y rojo cuando supera el setenta por ciento del plazo."
)
add_para(
    "Produce configuraciones de SLA y métricas de cumplimiento. El porcentaje de cumplimiento permite "
    "evaluar la calidad del servicio y detectar desviaciones que requieran atención."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M10 ---
doc.add_heading("M10 Reportes y exportaciones", level=2)
add_para(
    "Generar documentos de gestión a partir de consultas y filtros configurables.",
    bold=True, size=10
)
add_para(
    "El módulo ofrece cinco tipos de reportes: tickets por técnico, activos por sede, cumplimiento SLA, "
    "mantenimientos y actividad de usuarios. Cada reporte permite aplicar filtros por período, estado y "
    "categoría antes de generar la vista previa."
)
add_para(
    "Los reportes pueden descargarse en formato PDF, CSV o Excel. La sección inferior permite configurar "
    "reportes programados con frecuencia de envío y lista de destinatarios para la distribución automática "
    "por correo electrónico."
)
add_para(
    "Produce archivos y registros de reportes. El usuario que los entrega a terceros debe comprobar que el "
    "período, los filtros y el nivel de detalle correspondan al propósito y a sus autorizaciones."
)

# --- M11 ---
doc.add_heading("M11 Auditoría y trazabilidad", level=2)
add_para(
    "Conservar el registro de las acciones realizadas por los usuarios del sistema.",
    bold=True, size=10
)
add_para(
    "El registro de auditoría almacena marca de tiempo, usuario, acción, detalle de la operación, dirección "
    "IP y estado del resultado (éxito o bloqueado). La interfaz permite filtrar por tipo de entidad, rango de "
    "fechas y búsqueda por descripción."
)
add_para(
    "Los tickets y los activos conservan líneas de tiempo de eventos que documentan cada cambio de estado, "
    "asignación, comentario y actuación realizada. Los comentarios y archivos adjuntos utilizan relaciones "
    "polimórficas para vincularse con diferentes entidades."
)
add_para(
    "Produce registros de auditoría con usuario, fecha, operación y detalle de cambios. La trazabilidad "
    "permite reconstruir la secuencia de actuaciones sobre cualquier entidad del sistema."
)

page_break()
doc.add_heading("Descripción de los módulos", level=1)

# --- M12 ---
doc.add_heading("M12 Configuración del sistema", level=2)
add_para(
    "Administrar los parámetros generales, la integración con servicios externos y las copias de respaldo.",
    bold=True, size=10
)
add_para(
    "El panel de configuración organiza los parámetros en tres secciones: general (nombre de la institución, "
    "zona horaria, idioma), SMTP (servidor de correo, puerto, credenciales, plantillas de notificación) y "
    "backup (programación de copias de seguridad y restauración)."
)
add_para(
    "La configuración CORS permite las solicitudes del frontend desde el dominio autorizado con soporte "
    "de credenciales. Los tokens de autenticación Sanctum no tienen expiración configurada; la "
    "administración puede revocarlos desde la gestión de usuarios."
)
add_para(
    "Produce parámetros de configuración persistidos y su historial de cambios. La modificación de "
    "parámetros críticos como SMTP o backup requiere permisos de administrador del sistema."
)

page_break()

# ══════════════════════════════════════════════════════════
# PROCEDIMIENTO DE CREACIÓN Y ATENCIÓN DE TICKETS
# ══════════════════════════════════════════════════════════
doc.add_heading("Procedimiento de creación y atención de tickets", level=1)

add_para(
    "El ticket conecta la solicitud del usuario con las actuaciones técnicas y evita que un diagnóstico, "
    "un escalamiento o un cierre queden sin referencia al caso correspondiente."
)

steps = [
    "El usuario final consulta sus tickets existentes y verifica si ya existe un registro para el mismo problema.",
    "Registra la clasificación (tipo, categoría, prioridad), la descripción detallada, la ubicación física y "
    "los archivos de soporte; envía la solicitud.",
    "El líder TIC recibe el ticket en la cola de asignación y lo distribuye al técnico disponible según sede "
    "y carga operativa.",
    "El técnico revisa la descripción, cambia el estado a en progreso y documenta el diagnóstico. Si el caso "
    "excede su capacidad, lo escala con el motivo correspondiente.",
    "La atención se registra con los pasos realizados, el tiempo invertido y el resultado. El cierre documenta "
    "la restauración del servicio y las observaciones finales.",
    "El seguimiento permite al usuario consultar la línea de tiempo del ticket y comunicarse con el técnico "
    "mediante la conversación integrada.",
]
for i, step in enumerate(steps, 1):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(f"{i}. {step}")
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY_DARK

doc.add_heading("Información que conecta las etapas", level=2)

add_styled_table(
    ["Registro", "Relaciones principales"],
    [
        ["Ticket", "Solicitante, técnico asignado, estado, prioridad, SLA y ubicación."],
        ["Evento de ticket", "Ticket, fecha, tipo de evento, descripción y usuario responsable."],
        ["Comentario", "Ticket o activo (polimórfico), autor, fecha y contenido."],
        ["Archivo adjunto", "Ticket o activo (polimórfico), nombre, tipo y ruta del archivo."],
        ["Activo vinculado", "Ticket, equipo relacionado, ubicación y estado."],
    ]
)

add_note(
    "La secuencia describe la articulación funcional del programa. Las decisiones de priorización y las autorizaciones "
    "de una entidad se ejercen por sus responsables, mediante los permisos y procedimientos aplicables."
)

page_break()

# ══════════════════════════════════════════════════════════
# PROCEDIMIENTO DE GESTIÓN DE INVENTARIO
# ══════════════════════════════════════════════════════════
doc.add_heading("Procedimiento de gestión de inventario y mantenimientos", level=1)

doc.add_heading("Inventario", level=2)

steps = [
    "Registrar el equipo con su identificación, categoría, marca, modelo, serial y especificaciones técnicas.",
    "Asignar la ubicación (sede, piso, ubicación específica) y el cuentadante responsable de la custodia.",
    "Verificar que el serial no esté duplicado; el sistema genera automáticamente el código del activo.",
    "Consultar la hoja de vida del equipo para revisar información técnica, especificaciones, garantía y "
    "mantenimientos registrados.",
    "Utilizar las acciones masivas para cambiar estado, cambiar sede o exportar el inventario a CSV.",
]
for i, step in enumerate(steps, 1):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.5)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(f"{i}. {step}")
    run.font.size = Pt(10)
    run.font.color.rgb = GRAY_DARK

doc.add_heading("Mantenimientos", level=2)
add_para(
    "El registro de mantenimiento vincula al activo con el tipo de intervención (preventivo, correctivo, "
    "actualización o limpieza), la descripción, la fecha de ejecución, el técnico responsable y el resultado "
    "final. Los mantenimientos completados actualizan la fecha de próximo mantenimiento del activo y "
    "alimentan el historial de la hoja de vida."
)

doc.add_heading("Custodia y responsabilidad", level=2)
add_para(
    "El cuentadante consulta los equipos bajo su custodia con indicadores de estado y alertas de "
    "mantenimiento próximo. La hoja de vida presenta la información técnica completa, las especificaciones "
    "del sistema, el estado de garantía y la línea de tiempo de vida útil que incluye cambios de cuentadante, "
    "mantenimientos, cambios de ubicación e ingreso."
)

add_note(
    "Los movimientos físicos y los registros del sistema deben conciliarse con el responsable de bienes. "
    "Un cambio en el campo informático no reemplaza el acto administrativo que lo sustenta."
)

page_break()

# ══════════════════════════════════════════════════════════
# MODELO DE INFORMACIÓN Y TRAZABILIDAD
# ══════════════════════════════════════════════════════════
doc.add_heading("Modelo de información y trazabilidad", level=1)

add_para(
    "El modelo relacional utiliza entidades de organización, usuarios y operación. El ticket funciona como punto "
    "de relación de la atención; los activos como punto de relación del inventario. Las actuaciones conservan "
    "referencias para permitir consultas de detalle y análisis consolidados."
)

add_styled_table(
    ["Conjunto", "Contenido principal", "Relación funcional"],
    [
        ["Organización", "Tenants, dominios y configuración", "Contexto de acceso y operación."],
        ["Personas y acceso", "Usuarios, roles y permisos", "Responsables y sesiones."],
        ["Soporte técnico", "Tickets, eventos, comentarios y adjuntos", "Núcleo de la atención."],
        ["Inventario", "Activos, categorías, estados y especificaciones", "Parque tecnológico."],
        ["Mantenimientos", "Intervenciones, tipos, técnicos y resultados", "Conservación de activos."],
        ["Comunicaciones", "Mensajes masivos, canales y destinatarios", "Difusión institucional."],
        ["Programación", "Turnos, horarios, sedes y edificios", "Disponibilidad del personal."],
        ["Gestión", "SLA, reportes, configuración y exportaciones", "Consulta administrativa."],
        ["Auditoría", "Acción, objeto, usuario, IP y resultado", "Revisión de actuaciones registradas."],
    ]
)

doc.add_heading("Identificadores y archivos", level=2)
add_para(
    "Los tickets utilizan identificadores numéricos secuenciales. Los activos se identifican mediante un "
    "código autogenerado con el formato UTS-{CAT}-{XXXX} que combina la categoría con un consecutivo. "
    "Los comentarios y archivos adjuntos utilizan relaciones polimórficas para asociarse con tickets, activos "
    "o mantenimientos según corresponda."
)
add_para(
    "La estructura del proyecto reúne los modelos, controladores y componentes de interfaz que implementan "
    "estas relaciones. La documentación funcional identifica los conjuntos de información y su articulación en la "
    "versión 1.0.0."
)

page_break()

# ══════════════════════════════════════════════════════════
# CONTROLES DE ACCESO
# ══════════════════════════════════════════════════════════
doc.add_heading("Controles de acceso y revisión de integridad", level=1)

doc.add_heading("Autenticación y sesión", level=2)
add_para(
    "El controlador de autenticación valida correo y contraseña y emite un token Bearer mediante Laravel "
    "Sanctum. El token no tiene expiración configurada y se almacena de forma persistida en el cliente "
    "mediante Zustand. El cierre de sesión revoca el token y redirige a la pantalla de inicio de sesión."
)
add_para(
    "La recuperación de contraseña está disponible mediante el formulario de correo electrónico en la "
    "pantalla de inicio de sesión. El interceptor de respuestas detecta códigos 401 y limpia el almacenamiento "
    "del cliente para forzar una nueva autenticación."
)

doc.add_heading("Autorización y contexto", level=2)
add_para(
    "Los permisos por rol utilizan spatie/laravel-permission con seis perfiles base. Las rutas de la API se "
    "protegen con el middleware auth:sanctum; la única ruta pública es el inicio de sesión. La protección "
    "del cliente verifica el estado de autenticación después de la hidratación del almacenamiento persistido."
)
add_para(
    "El filtrado por organización se aplica cuando existe un contexto de tenant; la seguridad del aislamiento "
    "depende también de la resolución de ese contexto y de la autorización en todas las rutas relevantes. "
    "Las rutas del frontend se organizan por prefijo de rol para separar las vistas de cada perfil."
)

doc.add_heading("Auditoría", level=2)
add_para(
    "El sistema conserva registros de auditoría con marca de tiempo, usuario, acción, detalle, dirección IP "
    "y estado del resultado. Los tickets y activos mantienen líneas de tiempo de eventos que documentan "
    "cada transición de estado y actuación registrada."
)
add_para(
    "La consulta de auditoría permite revisar las actuaciones y sus referencias de usuario, objeto y "
    "operación. Los filtros por tipo de entidad, fecha y búsqueda facilitan la localización de registros "
    "específicos."
)

doc.add_heading("Información personal", level=2)
add_para(
    "La aplicación incorpora separación de accesos por rol y por contexto de organización. Los datos de "
    "usuarios y sus actuaciones se restringen al ámbito autorizado para cada perfil. La organización "
    "usuaria define las finalidades, autorizaciones, reglas de acceso, conservación y respuesta que orientan "
    "su operación."
)

page_break()

# ══════════════════════════════════════════════════════════
# COMPONENTES PROPIOS Y ALCANCE DE PROTECCIÓN
# ══════════════════════════════════════════════════════════
doc.add_heading("Componentes propios y alcance de protección", level=1)

add_para(
    "El objeto identificado es la expresión del programa en sus componentes propios: código de aplicación, "
    "organización funcional, estructuras originales de datos y documentación asociada. La descripción permite "
    "reconocer el producto y los procedimientos que ejecuta en su versión 1.0.0."
)

doc.add_heading("Aportes de los autores", level=2)

add_styled_table(
    ["Autor", "Intervención declarada"],
    [
        ["BRAYAN ALFONSO APARICIO DURAN",
         "Ingeniero de sistemas y desarrollador full stack. Participación en el "
         "desarrollo del programa bajo prestación de servicios para Nativoweb."],
        ["MARLY TATIANA RANGEL MORENO",
         "Tecnóloga en sistemas y desarrolladora full stack. Participación en el "
         "desarrollo del programa bajo prestación de servicios para Nativoweb."],
    ]
)

add_para(
    "Las contribuciones se integran en el producto identificado. Los instrumentos de cesión individual documentan "
    "la transferencia a NATIVOWEB S.A.S. de los derechos patrimoniales que corresponden a cada autor sobre esta "
    "versión, con conservación de sus derechos morales."
)

doc.add_heading("Componentes de terceros", level=2)
add_para(
    "Laravel, Next.js, React, PostgreSQL, Tailwind CSS, shadcn/ui, Recharts y las demás bibliotecas conservan "
    "sus titulares y licencias. La titularidad de Nativoweb se refiere a sus aportes propios y a los derechos "
    "válidamente adquiridos. La distribución y explotación del producto debe respetar las condiciones de las "
    "dependencias incorporadas."
)

doc.add_heading("Identificación de la versión", level=2)
add_para(
    "El título, la versión 1.0.0 y el año 2026 deben permanecer consistentes en los documentos del expediente. Las "
    "modificaciones posteriores se gestionan mediante versionamiento y no se incorporan de manera "
    "indeterminada a esta descripción."
)

# ── Guardar ──────────────────────────────────────────────
doc.save(OUTPUT)
print(f"Documento generado: {OUTPUT}")
print(f"Tamaño: {os.path.getsize(OUTPUT) / 1024 / 1024:.1f} MB")
