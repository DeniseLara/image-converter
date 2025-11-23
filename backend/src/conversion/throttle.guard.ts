import { Injectable, CanActivate, ExecutionContext, BadRequestException, Inject, Scope } from "@nestjs/common";
import { Request } from "express";

export const CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB máximo
  MAX_DIMENSION: 1600, // 1600px máximo
  TIMEOUT_MS: 10000, 
  MAX_CONCURRENT_JOBS: 1, // SOLO 1 a la vez
  MAX_REQUESTS_PER_MINUTE: 8
};


@Injectable()
export class ThrottleGuard implements CanActivate {
    private activeJobs = 0;
    private requestCounts = new Map<string, number[]>();
    
    public get ActiveJobs(): number {
        return this.activeJobs;
    }

    public incrementActiveJobs(): void {
        this.activeJobs++;
    }

    public decrementActiveJobs(): void {
        this.activeJobs--;
    }


    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const clientIp = request.ip || 'unknown';

        // validar jobs activos 
        if (this.activeJobs >= CONFIG.MAX_CONCURRENT_JOBS) {
            throw new BadRequestException("Servidor ocupado. Espera un momento.")
        }

        // rate limiting
        this.checkRateLimit(clientIp);

        // si pasa ambas validaciones, la solicitud puede continuar
        return true
    }


    private checkRateLimit(clientIp: string): void {
        const now = Date.now();
        const userRequests = this.requestCounts.get(clientIp) || [];

        // filtrar requests del último minuto 
        const recentRequests = userRequests.filter(time => now - time < 60000);

        if (recentRequests.length >= CONFIG.MAX_REQUESTS_PER_MINUTE) {
            throw new BadRequestException("Demasiadas solicitudes. Espero un minuto.");
        }

        // agregar nuevo request 
        recentRequests.push(now);
        this.requestCounts.set(clientIp, recentRequests);

        // limpiar datos antiguos ocasionalmente
        if (Math.random() < 0.1) {
            this.cleanupOldRequests();
        }
    }
    
    private cleanupOldRequests(): void {
        const now = Date.now();
        for (const [key, times] of this.requestCounts.entries()) {
          const recent = times.filter(time => now - time < 120000);
          if (recent.length === 0) {
            this.requestCounts.delete(key);
          } else {
            this.requestCounts.set(key, recent);
          }
        }
    }
}