import type { CSSProperties } from "react";

export interface VehiclePrintData {
  title?: string;
  year?: number;
  make?: string;
  model?: string;
  price?: number;
  originalPrice?: number;
  condition?: string;
  warranty?: boolean;
  inspected?: boolean;
  miles?: string;
  drivetrain?: string;
  mpg?: string;
  stock?: string;
  vin?: string;
  exterior?: string;
  exteriorColorCode?: string;
  interior?: string;
  interiorColorCode?: string;
  dealer?: string;
  location?: string;
  distance?: string;
  images?: string[];
  features?: string[];
}

// ─── Shared inline styles (needed because this renders in a standalone print window) ──

const badgeStyle: CSSProperties = {
  padding: "4px 14px",
  borderRadius: 20,
  fontSize: 13,
  fontWeight: 600,
  border: "1px solid #d1d5db",
};

const sectionStyle: CSSProperties = {
  margin: "24px 0",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: "1px solid #e5e7eb",
};

const specLabelStyle: CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 600,
  textTransform: "uppercase",
  margin: 0,
};

const specValueStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  marginTop: 2,
  margin: 0,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PrintHeader({ title, vehicle }: { title: string; vehicle: VehiclePrintData }) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: "2px solid #e5e7eb",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, margin: 0 }}>{title}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 26, fontWeight: 700, color: "#1d4ed8" }}>
          ${(vehicle.price ?? 0).toLocaleString()}
        </span>
        {vehicle.originalPrice ? (
          <>
            <span>was</span>
            <span
              style={{
                fontSize: 16,
                color: "#6b7280",
                textDecoration: "line-through",
              }}
            >
              ${vehicle.originalPrice.toLocaleString()}
            </span>
          </>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {vehicle.condition ? <span style={badgeStyle}>{vehicle.condition}</span> : null}
        {vehicle.warranty ? <span style={badgeStyle}>Warranty</span> : null}
        {vehicle.inspected ? <span style={badgeStyle}>Inspected</span> : null}
      </div>
    </div>
  );
}

function PrintImages({ images }: { images: string[] }) {
  if (images.length === 0) {
    return null;
  }
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Vehicle Photo</div>
      {/* biome-ignore lint/performance/noImgElement: Renders in a standalone print window without Next.js */}
      <img
        alt="Vehicle"
        height={400}
        src={images[0]}
        style={{
          width: "100%",
          borderRadius: 8,
          objectFit: "cover",
          maxHeight: 400,
        }}
        width={800}
      />
    </div>
  );
}

function PrintSpecs({ vehicle }: { vehicle: VehiclePrintData }) {
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Specifications</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        <div>
          <div style={specLabelStyle}>Miles</div>
          <p style={specValueStyle}>{vehicle.miles ?? "—"}</p>
        </div>
        <div>
          <div style={specLabelStyle}>Drivetrain</div>
          <p style={specValueStyle}>{vehicle.drivetrain ?? "—"}</p>
        </div>
        <div>
          <div style={specLabelStyle}>MPG</div>
          <p style={specValueStyle}>{vehicle.mpg ?? "—"}</p>
        </div>
        <div>
          <div style={specLabelStyle}>Stock #</div>
          <p style={specValueStyle}>{vehicle.stock ?? "—"}</p>
        </div>
        <div>
          <div style={specLabelStyle}>VIN</div>
          <p style={specValueStyle}>{vehicle.vin ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function PrintColors({ vehicle }: { vehicle: VehiclePrintData }) {
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Colors</div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid #d1d5db",
              backgroundColor: vehicle.exteriorColorCode ?? "#ccc",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Exterior</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{vehicle.exterior ?? "—"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: "1px solid #d1d5db",
              backgroundColor: vehicle.interiorColorCode ?? "#ccc",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          />
          <div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Interior</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{vehicle.interior ?? "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintFeatures({ features }: { features: string[] }) {
  if (features.length === 0) {
    return null;
  }
  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>Key Features</div>
      <ul
        style={{
          columns: 2,
          columnGap: 24,
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {features.map((f) => (
          <li key={f} style={{ padding: "4px 0", fontSize: 14 }}>
            <span style={{ color: "#16a34a", fontWeight: 700, marginRight: 4 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PrintDealer({ vehicle }: { vehicle: VehiclePrintData }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 0",
        borderTop: "1px solid #e5e7eb",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{vehicle.dealer ?? "—"}</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>{vehicle.location ?? ""}</div>
      </div>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{vehicle.distance ?? ""}</div>
    </div>
  );
}

// ─── Print CSS — declared as a React component so no imperative injection needed ──

const PRINT_CSS = `
  @media print {
    body > *:not([data-print-portal]) { display: none !important; }
    [data-print-portal] {
      display: block !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    [data-print-portal] * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
  }
`;

// ─── Main component ───────────────────────────────────────────────────────────

export function VehiclePrintSheet({ vehicle }: { vehicle: VehiclePrintData }) {
  const title = vehicle.title ?? "";

  return (
    <>
      <style precedence="print">{PRINT_CSS}</style>
      <div
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#1a1a1a",
          padding: 40,
        }}
      >
        <PrintHeader title={title} vehicle={vehicle} />
        <PrintImages images={vehicle.images ?? []} />
        <PrintSpecs vehicle={vehicle} />
        <PrintColors vehicle={vehicle} />
        <PrintFeatures features={vehicle.features ?? []} />
        <PrintDealer vehicle={vehicle} />
        <div
          style={{
            textAlign: "center",
            marginTop: 30,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          Printed on {new Date().toLocaleDateString()}
        </div>
      </div>
    </>
  );
}
