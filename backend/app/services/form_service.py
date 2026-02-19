from fpdf import FPDF
import os
from datetime import datetime

class PDFService:
    def generate_pwdva_form(self, victim_name: str, respondent_name: str, incident_details: str, date: str = None) -> str:
        """
        Generates a filled PWDVA Form I (Domestic Incident Report) PDF.
        Returns the file path.
        """
        if not date:
            date = datetime.now().strftime("%d-%m-%Y")

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Title
        pdf.set_font("Arial", style="B", size=16)
        pdf.cell(200, 10, txt="FORM I", ln=True, align='C')
        pdf.set_font("Arial", style="B", size=12)
        pdf.cell(200, 10, txt="DOMESTIC INCIDENT REPORT", ln=True, align='C')
        pdf.cell(200, 10, txt="(Under Sections 9(b) and 37(2)(c) of the PWDVA, 2005)", ln=True, align='C')
        pdf.ln(10)

        # Content
        pdf.set_font("Arial", size=12)
        
        # 1. Details of Aggrieved Person
        pdf.set_font("Arial", style="B", size=12)
        pdf.cell(0, 10, txt="1. Details of Aggrieved Person / Petitioner:", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(50, 10, txt="Name:", border=0)
        pdf.cell(0, 10, txt=victim_name, border=1, ln=True)
        
        pdf.cell(50, 10, txt="Date of Report:", border=0)
        pdf.cell(0, 10, txt=date, border=1, ln=True)
        pdf.ln(5)

        # 2. Details of Respondent
        pdf.set_font("Arial", style="B", size=12)
        pdf.cell(0, 10, txt="2. Details of Respondent (Abuser):", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(50, 10, txt="Name:", border=0)
        pdf.cell(0, 10, txt=respondent_name, border=1, ln=True)
        pdf.ln(5)

        # 3. Incident Details
        pdf.set_font("Arial", style="B", size=12)
        pdf.cell(0, 10, txt="3. Incident Details (Cruelty/Violence):", ln=True)
        pdf.set_font("Arial", size=12)
        
        # Multi-line text for description
        pdf.multi_cell(0, 10, txt=incident_details, border=1)
        pdf.ln(10)

        # 4. Prayers / Relief Sought
        pdf.set_font("Arial", style="B", size=12)
        pdf.cell(0, 10, txt="4. Relief Sought:", ln=True)
        pdf.set_font("Arial", size=10)
        pdf.cell(0, 8, txt="[ ] Protection Order (Section 18)", ln=True)
        pdf.cell(0, 8, txt="[ ] Residence Order (Section 19)", ln=True)
        pdf.cell(0, 8, txt="[ ] Monetary Relief (Section 20)", ln=True)
        pdf.cell(0, 8, txt="[ ] Custody Order (Section 21)", ln=True)
        pdf.ln(20)

        # Signatures
        pdf.line(10, pdf.get_y(), 80, pdf.get_y())
        pdf.cell(100, 10, txt="Signature of Aggrieved Person", ln=False)
        
        pdf.line(120, pdf.get_y(), 190, pdf.get_y())
        pdf.cell(0, 10, txt="Signature of Service Provider", ln=True)

        # Save
        output_dir = "backend/generated_forms"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        filename = f"DIR_{victim_name.replace(' ', '_')}_{int(datetime.now().timestamp())}.pdf"
        file_path = os.path.join(output_dir, filename)
        pdf.output(file_path)
        
        return file_path

pdf_service = PDFService()
