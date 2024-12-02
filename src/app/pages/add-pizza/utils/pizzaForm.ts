import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export const fb = () => {
  const fb = inject(FormBuilder);

  return fb.group({
    nombre: fb.control('', [Validators.required]),
    descripcion: fb.control('', [Validators.required]),
    masa: fb.control('artesanal', [Validators.required]),
    descuento: fb.control('0.0', [Validators.required]),

    tipoPizza: fb.control('sencilla'),

    opciones: fb.group({
      tipo: fb.control('salada', [Validators.required]),
    }),

    duo: fb.group({
      mitad1: fb.control<string | null>(null),
      mitad2: fb.control<string | null>(null),
    }),

    cuatroEstaciones: fb.group({
      cuarto1: fb.control<string | null>(null),
      cuarto2: fb.control<string | null>(null),
      cuarto3: fb.control<string | null>(null),
      cuarto4: fb.control<string | null>(null),
    }),

    tamanosPrecios: fb.group({
      familiar: fb.control<number | null>(null, Validators.required),
      mediana: fb.control<number | null>(null, Validators.required),
      personal: fb.control<number | null>(null, Validators.required),
    }),
  });
};

export const fb2 = () => {
  const fb = inject(FormBuilder);

  return fb.group({
    nombre: fb.control('', [Validators.required]),
    descripcion: fb.control('', [Validators.required]),
    descuento: fb.control('0.0', [Validators.required]),
    tamanosPrecios: fb.group({
      familiar: fb.control(null, Validators.required),
      mediana: fb.control(null, Validators.required),
      personal: fb.control(null, Validators.required),
    }),
    opciones: fb.group({
      cambioDeMasa: fb.control(true),
      cambioSabor: fb.control(true),
      esEntero: fb.control(true),
      esDuo: fb.control(false),
      esCuatroEstaciones: fb.control(false),
    }),
  });
};
