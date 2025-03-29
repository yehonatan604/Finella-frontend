import { pdf } from "@react-pdf/renderer";
import { ReactElement } from "react";
import { DocumentProps } from "@react-pdf/renderer";

export const exportDataToPDF = async (
  pdfDoc: ReactElement<DocumentProps>,
  fileName: string = "salaries"
) => {
  const blob = await pdf(pdfDoc).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
