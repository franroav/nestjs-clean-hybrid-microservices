import { PartialType } from '@nestjs/mapped-types';
import { CreatePrometheusDto } from './create-prometheus.dto';

export class UpdatePrometheusDto extends PartialType(CreatePrometheusDto) {}
