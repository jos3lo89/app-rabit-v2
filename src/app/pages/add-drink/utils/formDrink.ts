import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

export const formBuilder = () => {
  const fb = inject(FormBuilder);

  return fb.group({
    nombre: fb.control('', [Validators.required, Validators.minLength(1)]),
    descripcion: fb.control('', [Validators.required, Validators.minLength(1)]),
    precio: fb.control<number | null>(null, [Validators.required]),
  });
};
