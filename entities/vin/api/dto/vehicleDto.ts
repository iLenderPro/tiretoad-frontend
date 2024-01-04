import { ModelDto, TrimDto } from '@/entities/tires/api/dto';
import { TireDto } from '@/entities/tires/api/dto/tireDto';

export type VehicleDto = {
  year: number;
  make: string;
  model: string;
  trim: string | null;
  models: ModelDto[];
  trims: TrimDto[];
  tires: TireDto[] | null;
};
