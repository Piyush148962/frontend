import React from "react";
import jsPDF from "jspdf";

export default function FashionDNA({ setScreen }) {
  function generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Fashion DNA Report", 20, 20);

    doc.setFontSize(14);
    doc.text("Body Type: Slim", 20, 40);
    doc.text("Skin Tone: Wheatish", 20, 50);
    doc.text("Suggested Colors: Beige, Navy, Olive", 20, 60);
    doc.text("Occasion Fit: Casual / Office", 20, 70);

    doc.text("Recommended Outfit:", 20, 90);
    doc.text("- Linen Beige Shirt", 20, 100);
    doc.text("- Navy Chinos", 20, 110);
    doc.text("- Brown Loafers", 20, 120);

    doc.save("Fashion-DNA-Report.pdf");
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <button className="btn-ghost" onClick={() => setScreen("home")}>
        ← Back
      </button>

      <h1>Fashion DNA Report</h1>

      <div className="card">
        <p>Generate your personalized style DNA PDF for judges.</p>
        <button className="btn-primary" onClick={generatePDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}
