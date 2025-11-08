import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GetConnectionTypeService {
  public getConnectionType(): string {
    if (typeof navigator === 'undefined') return '4g';

    const nav = navigator as any;
    if (nav.connection && nav.connection.effectiveType) {
      return nav.connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
    }
    return '4g';
  }
}
