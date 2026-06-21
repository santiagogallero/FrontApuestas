export interface CatalogoItem {
  itemId: number;
  productoId: number | null;
  titulo: string | null;
  descripcion: string | null;
  categoria: string | null;
  precioBase: number | null;
  moneda: string;
  tieneSeguro: boolean;
  duenioNombre: string | null;
}

export interface CatalogoSubasta {
  subastaId: number;
  catalogoId: number;
  descripcion: string;
  moneda: string;
  items: CatalogoItem[];
}
