from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from pathlib import Path

out = Path('output/pdf/Ahmed_Alawlaqi_Reservations_Agent.pdf')
styles = getSampleStyleSheet()
navy = colors.HexColor('#203b55')
styles.add(ParagraphStyle(name='NameCV', fontName='Helvetica-Bold', fontSize=23, leading=27, textColor=navy, spaceAfter=5))
styles.add(ParagraphStyle(name='TargetCV', fontName='Helvetica', fontSize=11, leading=15, textColor=navy, spaceAfter=7))
styles.add(ParagraphStyle(name='BodyCV', fontName='Helvetica', fontSize=10, leading=14, spaceAfter=4))
styles.add(ParagraphStyle(name='SmallCV', fontName='Helvetica', fontSize=9, leading=12, spaceAfter=4))
styles.add(ParagraphStyle(name='SectionCV', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=navy, spaceBefore=13, spaceAfter=7))
styles.add(ParagraphStyle(name='BulletCV', fontName='Helvetica', fontSize=10, leading=14, leftIndent=10, firstLineIndent=-8, spaceAfter=4))
story = []
def p(text, style='BodyCV'):
    story.append(Paragraph(text, styles[style]))
def section(text):
    p(text.upper(), 'SectionCV')
def job(title, dates, org):
    row = Table([[Paragraph('<b>'+title+'</b>', styles['BodyCV']), Paragraph(dates, styles['SmallCV'])]], colWidths=[365, 134])
    row.setStyle(TableStyle([('LEFTPADDING',(0,0),(-1,-1),0), ('RIGHTPADDING',(0,0),(-1,-1),0), ('TOPPADDING',(0,0),(-1,-1),0), ('BOTTOMPADDING',(0,0),(-1,-1),0), ('VALIGN',(0,0),(-1,-1),'TOP')]))
    story.append(row)
    p(org, 'SmallCV')
def bullet(text):
    p('- '+text, 'BulletCV')

p('AHMED ALAWLAQI', 'NameCV')
p('Client Service &amp; Coordination | Target Role: Reservations Agent', 'TargetCV')
p('Jeddah, Saudi Arabia | +966 54 728 9546 | <link href="mailto:ahmed.alawlaqi25@gmail.com">ahmed.alawlaqi25@gmail.com</link>', 'SmallCV')
p('<link href="https://www.linkedin.com/in/ahmed-alawlaqi-dev/" color="#203b55">LinkedIn</link> | Arabic: Native | English: Fluent | Transferable Iqama | Available immediately', 'SmallCV')

section('Professional summary')
p('Client service and coordination professional with experience handling client requests, organizing student accommodation and airport transfers, and maintaining application documents. Fluent in Arabic and English, with skills in telephone communication, data entry, and follow-up. Seeking a Reservations Agent role to apply these skills to guest enquiries and accurate reservation processing.')

section('Relevant skills')
p('<b>Client service:</b> Client communication, telephone handling, email correspondence, request follow-up, problem solving')
p('<b>Coordination:</b> Accommodation and travel arrangements, scheduling, service provider communication, task tracking')
p('<b>Records and systems:</b> Data entry, document organization, Microsoft Excel, Word, Outlook, Google Workspace, web systems'.replace(', Outlook', ''))
p('<b>Work habits:</b> Attention to detail, time management, confidentiality, teamwork')

section('Professional experience')
job('Web Developer | Freelance', 'Jun 2026 - Aug 2026', 'Kafaat Alriyada | Riyadh, Saudi Arabia')
bullet('Communicated with the client to gather requirements, share progress, and follow up on revisions through launch.')
bullet('Built and deployed a responsive corporate website and provided ongoing technical support.')
bullet('Guided the client on using AI tools to support day-to-day productivity.')
story.append(Spacer(1, 6))
job('International Student Admissions Consultant', 'Jan 2022 - Jun 2023', 'Self-employed | Bengaluru, India')
bullet('Responded to student requests and communicated with universities and service providers throughout the admissions process.')
bullet('Coordinated student housing and airport transfers, working with colleges and service providers on arrangements.')
bullet('Organized client documents and followed up on university enrollment requirements.')
bullet('Followed up on outstanding requests and resolved issues throughout the process.')

section('Education & training')
p('<b>Bachelor of Computer Applications</b> | Bangalore University, India | Jun 2024')
p('Full-Stack Web Development Diploma | Kenpro Learning | Aug 2022', 'SmallCV')
p('AWS Cloud Practitioner Essentials | AWS Skill Builder | Oct 2026', 'SmallCV')

section('Selected project')
p('<b>MasarPro</b> | Job Application Tracker &amp; CV Builder | Aug 2026')
p('Developed and deployed a web application for tracking job applications and preparing CVs and cover letters. Integrated authentication, database storage, and AI writing assistance. <link href="https://masarpro.app/" color="#203b55">masarpro.app</link>', 'SmallCV')

doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=38, bottomMargin=38, title='Ahmed Alawlaqi - Reservations Agent', author='Ahmed Alawlaqi')
doc.build(story)
print(out.resolve())
