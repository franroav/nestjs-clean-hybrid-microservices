import { Inject, Injectable, Scope } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TokenHelper {
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly jwtServ: JwtService,
  ) { }

  async getRequestTokenAsync(): Promise<string> {
    return this.request.headers.authorization;
  }

  getRequestToken(): string {
    return this.request.headers.authorization;
  }

  async getUserDniToken(): Promise<string> {
    const tokenObj = this.jwtServ.decode(
      this.request.headers.authorization.replace('Bearer', '').trim(),
    );
    return (
      tokenObj[process.env.USERID_TOKEN_KEY] +
      this.getDvDni(tokenObj[process.env.USERID_TOKEN_KEY])
    );
  }

  async getUserDniTokenWithGuionPointYDv(): Promise<string> {
    const tokenObj = this.jwtServ.decode(
      this.request.headers.authorization.replace('Bearer', '').trim(),
    );

    return (
      this.formatDniWithPoint(tokenObj[process.env.USERID_TOKEN_KEY]) + '-' +
      this.getDvDni(tokenObj[process.env.USERID_TOKEN_KEY])
    );
  }

  async getUserDniTokenWithGuionYDv(): Promise<string> {
    const tokenObj = this.jwtServ.decode(
      this.request.headers.authorization.replace('Bearer', '').trim(),
    );
    return (
      tokenObj[process.env.USERID_TOKEN_KEY] + '-' +
      this.getDvDni(tokenObj[process.env.USERID_TOKEN_KEY])
    );
  }

  async getDniUserTokenWithOutDv(): Promise<string> {
    const tokenObj = this.jwtServ.decode(
      this.request.headers.authorization.replace('Bearer', '').trim(),
    );
    return (
      tokenObj[process.env.USERID_TOKEN_KEY]
    );
  }

  //Mover a otra funcion
  formatDniWithPoint(rut: string): string{
    
    const rutSeparado = rut.split('').reverse();
    const rutSeparadoFinal = []
    
    rutSeparado.forEach( (elem, index, array) =>{
      
      rutSeparadoFinal.push(elem);
      const posicion = index + 1;
      if(posicion % 3 === 0 && posicion !== array.length)
        rutSeparadoFinal.push('.');
      
    });

    return rutSeparadoFinal.reverse().join('');

  }

  getDvDni(rut: number): string {
    let M = 0;
    let S = 1;
    for (; rut; rut = Math.floor(rut / 10))
      S = (S + (rut % 10) * (9 - (M++ % 6))) % 11;
    return (S ? S - 1 : 'k').toString().toUpperCase();
  }
}
