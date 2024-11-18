import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: int(process.env.APP_PORT, 8080),
  activarSwagger: bool(process.env.ACTIVAR_SWAGGER, false),
}));

const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;
const bool = (val: string | undefined, variable: boolean): boolean =>
  val == null ? variable : val == 'true';
