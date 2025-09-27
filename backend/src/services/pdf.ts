import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";
import path from "path";

export type PrescriptionPayload = {
  patientName: string;
  drug1Name: string;
  drug1Timing: string;
  drug2Name?: string;
  drug2Timing?: string;
  notes?: string;
};

// Adjust these to match your actual AcroForm field names in the template
const FIELD_MAP = {
  patient_name: (p: PrescriptionPayload) => p.patientName ?? "",
  drug1_name:   (p: PrescriptionPayload) => p.drug1Name ?? "",
  drug1_timing: (p: PrescriptionPayload) => p.drug1Timing ?? "",
  drug2_name:   (p: PrescriptionPayload) => p.drug2Name ?? "",
  drug2_timing: (p: PrescriptionPayload) => p.drug2Timing ?? "",
  notes:        (p: PrescriptionPayload) => p.notes ?? "",
};

export async function renderPrescriptionPDF(
  payload: PrescriptionPayload,
  outFileAbsPath: string
) {
  const templatePath = path.resolve(__dirname, "..", "..", "templates", "prescription.pdf");
  const tpl = await fs.readFile(templatePath);

  const pdfDoc = await PDFDocument.load(tpl);
  const form = pdfDoc.getForm();

  // Fill each mapped field if it exists
  for (const [fieldName, getter] of Object.entries(FIELD_MAP)) {
    const v = getter(payload) || "";
    const maybeField =
      form.getFields().find(f => f.getName() === fieldName) ?? null;

    if (maybeField && "setText" in (maybeField as any)) {
      (maybeField as any).setText(v);
    }
  }

  // Flatten so the values become regular PDF content (non-editable)
  form.flatten();

  const bytes = await pdfDoc.save();
  await fs.mkdir(path.dirname(outFileAbsPath), { recursive: true });
  await fs.writeFile(outFileAbsPath, bytes);
}
