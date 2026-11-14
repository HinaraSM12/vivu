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
bg(1,'Panorama');txt(42,H-102,'UNA MIRADA A VIVU',9,ROSE,'DejaVuBold')
txt(40,H-154,'Cuidar la base,',29,INK,'DejaVuBold');txt(40,H-193,'acompañar mejor.',29,INK,'DejaVuBold')
para(43,H-214,470,'Una guía sencilla sobre cómo funciona Vivu, qué necesita cuidado y cómo podemos mejorarlo paso a paso.',12,19,MUTED)
panel(40,345,515,151);txt(60,468,'LA IDEA PRINCIPAL',8,ROSE,'DejaVuBold');para(60,449,475,'Vivu ya tiene funciones útiles. Sin embargo, parte de la información se guarda solo mientras el sistema está encendido. Antes de usar datos reales, debemos proteger los accesos y guardar los cambios de forma duradera.',11,18)
card(40,209,245,112,'LO QUE YA HAY','Una buena base','Ya hay misiones, perfiles, recursos, encuestas y recomendaciones, junto con pruebas de varias de estas funciones.')
card(300,209,255,112,'LO QUE NECESITA CUIDADO','Conexión y cuidado','Todavía falta comprobar que todas las partes de Vivu compartan información y trabajen juntas.')
para(44,174,500,'<b>Alcance:</b> revisamos los archivos del proyecto. No es una certificación ni una prueba completa en uso real.',8,13,MUTED);footer_source();c.showPage()
# 2
bg(2,'Mapa del sistema');title('01 · Cómo funciona','Un mapa para orientarnos','Vivu tiene varias partes. Aún debemos comprobar que trabajen juntas durante todo el recorrido de una persona.')
panel(40,515,515,160)
for x,label in [(57,'PERSONA'),(174,'WEB'),(291,'ENTRADA'),(408,'FUNCIONES')]:
 c.setFillColor(HexColor('#f0e6f8'));c.roundRect(x,580,94,48,13,fill=1,stroke=0);txt(x+11,599,label,8,INK,'DejaVuBold')
for x in [151,268,385]: txt(x+4,599,'· · ·',10,ROSE,'DejaVuBold')
para(60,565,475,'Los puntos indican conexiones por comprobar. Algunas partes de la web guardan información por su cuenta; otras partes también tienen sus propias reglas y datos.',8.5,13,MUTED)
card(40,354,245,135,'CONFIGURADO','Herramientas de apoyo','Hay herramientas preparadas para guardar e intercambiar información. Todavía no se ha demostrado que todas las funciones las utilicen.')
card(300,354,255,135,'EN EL CÓDIGO','Funciones disponibles','Hay funciones para identidad, perfiles, misiones, recursos, encuestas y recomendaciones. Apoyo y análisis aún están en una etapa inicial.')
panel(40,184,515,145);txt(58,303,'UNA DISTINCIÓN IMPORTANTE',8,ROSE,'DejaVuBold');para(58,282,475,'<b>Que una parte responda no significa que todo funcione.</b> Las comprobaciones revisadas indican que esa parte está encendida, pero no revisan si puede guardar o intercambiar información.',10,16)
para(58,215,475,'La auditoría técnica explica qué archivos se revisaron y dónde encontrar la evidencia de cada hallazgo.',8,12,MUTED)
footer_source();c.showPage()
# 3
bg(3,'Hallazgos');title('02 · Riesgos','Lo más importante primero','Encontramos siete puntos que conviene atender. Son riesgos observados, no problemas confirmados en uso real.')
panel(40,547,515,120);txt(58,642,'CUÁNDO CONVIENE ACTUAR',8,ROSE,'DejaVuBold')
for x,label,count,col in [(62,'Primero · datos reales',2,'#d88ab7'),(232,'Después · ampliar piloto',4,'#a889d2'),(414,'Luego · mejorar',1,'#cbb5e5')]:
 txt(x,613,str(count),21,HexColor(col),'DejaVuBold');txt(x,590,label,7.2,MUTED);c.setFillColor(HexColor('#f0e9f5'));c.roundRect(x,573,120,6,3,fill=1,stroke=0);c.setFillColor(HexColor(col));c.roundRect(x,573,120*count/4,6,3,fill=1,stroke=0)
items=[('A1  ·  P0','Información temporal','Al reiniciar, se podrían perder datos, sesiones y el control de acciones repetidas.'),('A2  ·  P0','Accesos de prueba','Hay contraseñas de ejemplo y ajustes de acceso que necesitan aclararse.'),('A3  ·  P1','Reglas repetidas','Las partes de Vivu podrían terminar dando respuestas diferentes.'),('A4  ·  P1','Revisión incompleta','Saber que una parte está encendida no confirma que todo funcione.'),('A5  ·  P1','Privacidad','Falta comprobar que se guarde y respete el retiro del consentimiento.'),('A6  ·  P1','Funciones pendientes','Las áreas de acompañamiento y análisis aún están en una etapa inicial.'),('A7  ·  P2','Intercambio pendiente','Todavía falta probar que las partes intercambien la información esperada.')]
y=528
for key,heading,body in items:
 panel(40,y-48,515,43);txt(54,y-22,key,7.6,ROSE,'DejaVuBold');txt(132,y-22,heading,9,INK,'DejaVuBold');para(132,y-25,406,body,7.8,10,MUTED);y-=51
footer_source();c.showPage()
# 4
bg(4,'Calidad');title('03 · Calidad','Calidad que se puede comprobar','Estas situaciones ayudan a imaginar qué deberíamos probar. Sus resultados aún no se han medido.')
card(40,494,245,160,'CONTINUIDAD','Que el progreso permanezca','Una misión completada debería seguir visible después de reiniciar, sin aparecer dos veces.')
card(300,494,255,160,'SEGURIDAD','Que los datos estén protegidos','Las personas sin permiso no deberían entrar. Las contraseñas de prueba no deben usarse en espacios compartidos.')
card(40,310,245,160,'CONEXIÓN','Que las piezas se entiendan','Cuando una parte cambie, debemos comprobar que las demás sigan entendiéndola.')
card(300,310,255,160,'INTERACCIÓN','Que sea fácil de usar','Probar tareas importantes con teclado y herramientas de apoyo, y escuchar a las personas que usan Vivu.')
panel(40,163,515,120);txt(58,258,'TAMBIÉN QUEREMOS SABER',8,ROSE,'DejaVuBold');para(58,240,477,'¿Vivu responde con rapidez? ¿Es fácil de mejorar e instalar? ¿Se pueden rechazar recomendaciones inadecuadas? Estas preguntas necesitan pruebas y objetivos acordados.',8.6,14,MUTED)
footer_source();c.showPage()
# 5
bg(5,'Ideas adicionales');title('04 · Ideas adicionales','Cuatro decisiones que importan','Estas ideas nacen de lo que encontramos y pueden ayudar al equipo a decidir qué hacer después.')
card(40,488,245,158,'IDEA 01','¿Quién cuida cada regla?','Una misma función aparece en varios lugares. Decidir dónde se cuida cada regla ayuda a evitar diferencias y facilita los cambios.')
card(300,488,255,158,'IDEA 02','Uso sin conexión','Hay que decidir qué puede hacerse sin internet, cómo se guardan los cambios después y cómo se respeta el consentimiento.')
card(40,307,245,158,'IDEA 03','Seguridad desde el arranque','Las contraseñas y cuentas de prueba deben quedarse en el espacio de pruebas y no pasar a lugares compartidos.')
card(300,307,255,158,'IDEA 04','Saber qué está pasando','Necesitamos señales claras para saber si Vivu puede completar sus tareas y para entender qué ocurrió cuando algo falla.')
panel(40,160,515,120);txt(58,255,'EL EQUILIBRIO',8,ROSE,'DejaVuBold');para(58,235,475,'Compartir reglas y guardar datos en un lugar confiable ayuda a mantener el orden. También debemos preparar qué hacer si se pierde la conexión o algo deja de responder.',9,15,MUTED)
footer_source();c.showPage()
# 6
bg(6,'Plan y fuentes');title('05 · Ruta de mejora','Pequeños pasos, impacto real','Un camino sugerido para cuidar la información, conectar las partes y aprender de las pruebas.')
for y,num,tag,heading,body in [(558,'01','ANTES DE DATOS REALES','Proteger y conservar','Retirar contraseñas de ejemplo y decidir cómo guardar, recuperar y eliminar la información con respeto al consentimiento.'),(431,'02','ANTES DE AMPLIAR EL PILOTO','Conectar y comprobar','Acordar quién cuida cada función y comprobar que las partes trabajen juntas, incluso cuando algo falle.'),(304,'03','EVOLUCIÓN','Medir y aprender','Definir cómo se comparte la información; probar la facilidad de uso y la rapidez; acordar responsables y fechas.')]:
 panel(40,y,515,108);circle(75,y+57,20,'#ead6f2',1);txt(65,y+53,num,9,PURPLE,'DejaVuBold');txt(110,y+82,tag,7.5,ROSE,'DejaVuBold');txt(110,y+61,heading,11,INK,'DejaVuBold');para(110,y+50,425,body,8.5,13,MUTED)
panel(40,114,515,166);txt(58,254,'PARA SEGUIR EXPLORANDO  ↗',8,ROSE,'DejaVuBold')
para(58,235,472,'<b>Para quien quiera profundizar:</b> la auditoría completa explica la evidencia y las prioridades. <br/><b>Fuentes:</b> ISO/IEC 25010:2023 y Software Architecture in Practice (Bass, Clements y Kazman, 2021).',8.5,14,MUTED)
txt(58,164,'ABRIR AUDITORÍA',8,PURPLE,'DejaVuBold');link(58,157,142,20,'https://github.com/HinaraSM12/vivu/blob/dev-audit/docs/auditoria-arquitectura.md')
txt(238,164,'ISO / IEC 25010',8,PURPLE,'DejaVuBold');link(238,157,120,20,'https://www.iso.org/standard/78176.html')
txt(390,164,'LIBRO · SEI',8,PURPLE,'DejaVuBold');link(390,157,130,20,'https://insights.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/')
para(58,139,475,'La auditoría completa está en la rama de trabajo; el enlace al documento puede no estar disponible hasta publicar esa rama.',7,10,MUTED)
c.save()
