export interface SeguroPoliza {
  productoId: number;
  productoTitulo: string;
  nroPoliza: string;
  compania: string;
  importeAsegurado: number;
  polizaCombinada: boolean;
  contactoTelefono: string | null;
  contactoEmail: string | null;
}
