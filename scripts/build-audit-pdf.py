#!/usr/bin/env python3
"""Genera docs/auditoria-arquitectura.pdf. Requiere reportlab 5.x."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/auditoria-arquitectura.pdf'
pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/TTF/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuBold', '/usr/share/fonts/TTF/DejaVuSans-Bold.ttf'))
W,H=A4
INK=HexColor('#392a50'); MUTED=HexColor('#695c79'); PINK=HexColor('#efb5d2'); LILAC=HexColor('#d9caf3'); PURPLE=HexColor('#8c6ab2'); ROSE=HexColor('#c477a6'); WHITE=HexColor('#fffdfd')
c=canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
c.setTitle('Vivu · Auditoría arquitectónica'); c.setAuthor('Vivu')
def txt(x,y,text,size=9,color=INK,font='DejaVu'):
 c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,text)
def para(x,top,width,text,size=9,leading=14,color=INK):
 style=ParagraphStyle('p',fontName='DejaVu',fontSize=size,leading=leading,textColor=color,alignment=TA_LEFT,allowWidows=0,allowOrphans=0)
 p=Paragraph(text,style);_,h=p.wrap(width,1000);p.drawOn(c,x,top-h);return h
def panel(x,y,w,h,fill='#fffafd'):
 c.saveState(); c.setFillColor(Color(.55,.40,.65,alpha=.10));c.roundRect(x+4,y-5,w,h,15,fill=1,stroke=0)
 c.setFillColor(HexColor(fill));c.setFillAlpha(.88);c.setStrokeColor(Color(1,1,1,alpha=.90));c.roundRect(x,y,w,h,15,fill=1,stroke=1);c.restoreState()
def circle(x,y,r,color,alpha=.5):
 c.saveState();c.setFillColor(HexColor(color));c.setFillAlpha(alpha);c.circle(x,y,r,fill=1,stroke=0);c.restoreState()
def bg(n,section):
 c.setFillColor(HexColor('#faf5fc'));c.rect(0,0,W,H,fill=1,stroke=0)
 circle(30,H-120,90,'#efd7ef',.55);circle(W-20,H-225,105,'#e4d7fb',.52);circle(W-15,105,110,'#f7d7e9',.44)
 c.setFillColor(HexColor('#926b9d'));c.setFont('DejaVuBold',8);c.drawString(37,H-38,'VIVU  /  AUDITORÍA ARQUITECTÓNICA')
 c.setStrokeColor(HexColor('#e8dbea'));c.line(37,37,W-37,37)
 txt(38,21,'13 NOV 2026  ·  CORTE 4b330ad',7,MUTED);txt(W-77,21,f'{n:02d} / 06',7,MUTED,'DejaVuBold')
 c.bookmarkPage('p'+str(n)); c.addOutlineEntry(section,'p'+str(n),0)
 # Enlaces internos discretos
 for i in range(1,7):
  x=W-125+i*15;c.setFillColor(PURPLE if i==n else HexColor('#d9cbe2'));c.circle(x,H-35,3,stroke=0,fill=1);c.linkRect('', 'p'+str(i),(x-7,H-42,x+7,H-28),relative=0,thickness=0)
def title(k,heading,subtitle):
 txt(40,H-75,k.upper(),8,ROSE,'DejaVuBold');txt(40,H-107,heading,23,INK,'DejaVuBold');para(41,H-120,W-82,subtitle,9.5,15,MUTED)
def card(x,y,w,h,k,heading,body):
 panel(x,y,w,h);txt(x+16,y+h-22,k,8,ROSE,'DejaVuBold');txt(x+16,y+h-43,heading,11,INK,'DejaVuBold');para(x+16,y+h-53,w-32,body,8.5,13,MUTED)
def link(x,y,w,h,url): c.linkURL(url,(x,y,x+w,y+h),relative=0,thickness=0)
def footer_source():
 para(40,69,W-80,'<font color="#7d698b">Base: ISO/IEC 25010:2023 y <i>Software Architecture in Practice</i>, 4.ª edición. Los puntos superiores permiten navegar entre páginas.</font>',7,10,MUTED)
# 1
bg(1,'Panorama');txt(42,H-102,'UNA MIRADA AL SISTEMA',9,ROSE,'DejaVuBold')
txt(40,H-154,'Cuidar la base,',29,INK,'DejaVuBold');txt(40,H-193,'acompañar mejor.',29,INK,'DejaVuBold')
para(43,H-214,470,'Una lectura amable de la arquitectura de Vivu: qué existe hoy, dónde están los riesgos y cómo avanzar con confianza.',12,19,MUTED)
panel(40,345,515,151);txt(60,468,'LA IDEA PRINCIPAL',8,ROSE,'DejaVuBold');para(60,449,475,'Vivu reúne funcionalidades y pruebas valiosas. Sin embargo, varios datos viven en memoria y algunas reglas se repiten entre capas. Antes de usar datos reales, es clave proteger credenciales y asegurar persistencia.',11,18)
card(40,209,245,112,'LO QUE YA HAY','Una base funcional','Misiones, perfil, recursos, encuestas y recomendaciones cuentan con implementaciones y pruebas.')
card(300,209,255,112,'LO QUE NECESITA CUIDADO','Integración y continuidad','El código inspeccionado no demuestra que todas las piezas compartan datos o se comuniquen entre sí.')
para(44,174,500,'<b>Alcance:</b> revisión estática del repositorio. No es certificación ISO, ni prueba de carga, intrusión o producción.',8,13,MUTED);footer_source();c.showPage()
# 2
bg(2,'Mapa del sistema');title('01 · Arquitectura','Un mapa para orientarnos','Los componentes existen; las conexiones de negocio deben demostrarse con pruebas de extremo a extremo.')
panel(40,515,515,160)
for x,label in [(57,'PERSONA'),(174,'WEB'),(291,'GATEWAY'),(408,'SERVICIOS')]:
 c.setFillColor(HexColor('#f0e6f8'));c.roundRect(x,580,94,48,13,fill=1,stroke=0);txt(x+11,599,label,8,INK,'DejaVuBold')
for x in [151,268,385]: txt(x+4,599,'· · ·',10,ROSE,'DejaVuBold')
para(60,565,475,'Puntos = frontera que requiere verificación. La web usa clientes locales; el gateway mantiene reglas y estado propios. Los servicios independientes también contienen implementaciones propias.',8.5,13,MUTED)
card(40,354,245,135,'CONFIGURADO','Infraestructura','Compose inicia PostgreSQL y RabbitMQ y entrega URLs. Esto no confirma persistencia ni mensajería de negocio.')
card(300,354,255,135,'EN EL CÓDIGO','Responsabilidades','Identity, student, gamification, resource, survey y recommendation tienen lógica; support y analytics solo exponen salud.')
panel(40,184,515,145);txt(58,303,'UNA DISTINCIÓN IMPORTANTE',8,ROSE,'DejaVuBold');para(58,282,475,'<b>Que un componente responda no significa que todo esté conectado.</b> Las rutas de preparación revisadas devuelven una respuesta fija, sin comprobar base de datos o broker.',10,16)
para(58,215,475,'Evidencia: App.tsx, AppModule, repositorios de servicios y docker-compose.yml. Consulta el documento técnico para las rutas exactas.',8,12,MUTED)
footer_source();c.showPage()
# 3
bg(3,'Hallazgos');title('02 · Riesgos','Lo más importante primero','Siete hallazgos organizados por el momento en que conviene atenderlos; no son incidencias confirmadas.')
panel(40,547,515,120);txt(58,642,'DISTRIBUCIÓN DE HALLAZGOS',8,ROSE,'DejaVuBold')
for x,label,count,col in [(62,'P0 · antes de datos reales',2,'#d88ab7'),(232,'P1 · antes de ampliar piloto',4,'#a889d2'),(414,'P2 · evolución',1,'#cbb5e5')]:
 txt(x,613,str(count),21,HexColor(col),'DejaVuBold');txt(x,590,label,7.2,MUTED);c.setFillColor(HexColor('#f0e9f5'));c.roundRect(x,573,120,6,3,fill=1,stroke=0);c.setFillColor(HexColor(col));c.roundRect(x,573,120*count/4,6,3,fill=1,stroke=0)
items=[('A1  ·  P0','Estado en memoria','Un reinicio puede perder datos, sesiones e idempotencia.'),('A2  ·  P0','Secretos de desarrollo','Hay credenciales de ejemplo y nombres de variables inconsistentes.'),('A3  ·  P1','Reglas duplicadas','Web, gateway y servicios pueden evolucionar de forma distinta.'),('A4  ·  P1','Salud superficial','Una respuesta ready no confirma que las dependencias funcionen.'),('A5  ·  P1','Privacidad','Falta demostrar persistencia y propagación del retiro de consentimiento.'),('A6  ·  P1','Funciones pendientes','Support y analytics tienen salud, sin negocio observado.'),('A7  ·  P2','Eventos por verificar','Un catálogo y un broker configurado no prueban publicación ni consumo.')]
y=528
for key,heading,body in items:
 panel(40,y-48,515,43);txt(54,y-22,key,7.6,ROSE,'DejaVuBold');txt(132,y-22,heading,9,INK,'DejaVuBold');para(132,y-25,406,body,7.8,10,MUTED);y-=51
footer_source();c.showPage()
# 4
bg(4,'Calidad');title('03 · Atributos','Calidad que se puede comprobar','Los escenarios propuestos ayudan a convertir preocupaciones en pruebas concretas. Aún no son mediciones.')
card(40,494,245,160,'FIABILIDAD','Que el progreso permanezca','Una misión confirmada debería seguir visible después de reiniciar, sin generar duplicados. Acordar objetivos de recuperación.')
card(300,494,255,160,'SEGURIDAD','Que los datos estén protegidos','Un acceso no autorizado y las credenciales de ejemplo deben rechazarse en entornos no locales. Probar permisos y secretos.')
card(40,310,245,160,'INTEROPERABILIDAD','Que las piezas se entiendan','Versionar contratos y comprobar que consumidores y proveedores siguen siendo compatibles al cambiar una interfaz.')
card(300,310,255,160,'INTERACCIÓN','Que sea fácil de usar','Probar tareas clave con teclado y tecnologías asistivas, además de sesiones con personas usuarias.')
panel(40,163,515,120);txt(58,258,'OTROS ATRIBUTOS A SEGUIR',8,ROSE,'DejaVuBold');para(58,240,477,'<b>Desempeño:</b> medir latencia y errores con carga acordada. <b>Mantenibilidad:</b> reducir duplicación. <b>Flexibilidad:</b> verificar instalaciones limpias. <b>Seguridad operacional:</b> permitir rechazo y revisión de recomendaciones inadecuadas. <b>Adecuación:</b> probar funciones completas.',8.6,14,MUTED)
footer_source();c.showPage()
# 5
bg(5,'Insights adicionales');title('04 · Nuevos insights','Cuatro decisiones que importan','Interpretaciones derivadas del código revisado. Cada una plantea una pregunta para el equipo.')
card(40,488,245,158,'INSIGHT 01','¿Quién es dueño de la regla?','La misma capacidad aparece en varias capas. Elegir un propietario evita resultados distintos y reduce el costo de corregir errores.')
card(300,488,255,158,'INSIGHT 02','Offline con acuerdos claros','El estado local facilita continuidad, pero hace falta definir qué se sincroniza, cómo se resuelven conflictos y qué ocurre ante retiro de consentimiento.')
card(40,307,245,158,'INSIGHT 03','Seguridad desde el arranque','Un prototipo con valores por defecto necesita una separación verificable entre desarrollo y entornos compartidos, no solo una advertencia.')
card(300,307,255,158,'INSIGHT 04','Observabilidad útil','Health puede indicar que un proceso vive. Readiness, métricas y trazas deben reflejar las dependencias reales de cada operación.')
panel(40,160,515,120);txt(58,255,'EL EQUILIBRIO',8,ROSE,'DejaVuBold');para(58,235,475,'Concentrar reglas y persistencia mejora coherencia, pero añade llamadas de red y nuevas posibilidades de fallo. Diseñar límites de tiempo, recuperación y uso offline junto a cada integración.',9,15,MUTED)
footer_source();c.showPage()
# 6
bg(6,'Plan y fuentes');title('05 · Ruta de mejora','Pequeños pasos, impacto real','Una secuencia sugerida para convertir la auditoría en decisiones y pruebas visibles.')
for y,num,tag,heading,body in [(558,'01','ANTES DE DATOS REALES','Proteger y conservar','Retirar secretos de ejemplo; definir retención, persistencia, recuperación y retiro del consentimiento.'),(431,'02','ANTES DE AMPLIAR EL PILOTO','Conectar y comprobar','Asignar propietarios, integrar los flujos y probar permisos, reinicios, fallos y contratos entre procesos.'),(304,'03','EVOLUCIÓN','Medir y aprender','Decidir el papel del broker; medir accesibilidad y desempeño; acordar responsables, objetivos y fechas.')]:
 panel(40,y,515,108);circle(75,y+57,20,'#ead6f2',1);txt(65,y+53,num,9,PURPLE,'DejaVuBold');txt(110,y+82,tag,7.5,ROSE,'DejaVuBold');txt(110,y+61,heading,11,INK,'DejaVuBold');para(110,y+50,425,body,8.5,13,MUTED)
panel(40,114,515,166);txt(58,254,'PARA SEGUIR EXPLORANDO  ↗',8,ROSE,'DejaVuBold')
para(58,235,472,'<b>Auditoría técnica completa:</b> evidencia, escenarios y criterios de priorización. <br/><b>Fuentes:</b> ISO/IEC 25010:2023 y Software Architecture in Practice (Bass, Clements y Kazman, 2021).',8.5,14,MUTED)
txt(58,164,'ABRIR AUDITORÍA',8,PURPLE,'DejaVuBold');link(58,157,142,20,'https://github.com/HinaraSM12/vivu/blob/dev-audit/docs/auditoria-arquitectura.md')
txt(238,164,'ISO / IEC 25010',8,PURPLE,'DejaVuBold');link(238,157,120,20,'https://www.iso.org/standard/78176.html')
txt(390,164,'LIBRO · SEI',8,PURPLE,'DejaVuBold');link(390,157,130,20,'https://insights.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/')
para(58,139,475,'La auditoría completa está en la rama de trabajo; el enlace al documento puede no estar disponible hasta publicar esa rama.',7,10,MUTED)
c.save()
