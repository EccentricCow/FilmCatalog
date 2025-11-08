import { inject, Injectable } from '@angular/core';
import { BackdropSize, PosterSize } from '../../types/image-sizes';
import { environment } from '../../environments/environment';
import { GetConnectionTypeService } from './get-connection-type.service';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly _getConnectionType = inject(GetConnectionTypeService).getConnectionType;

  public getPosterUrl(path: string): string {
    const size = this._choosePosterSize();
    return `${environment.tmdbApiImgBaseUrl}${size}${path}`;
  }

  // backdrop will only w300
  public getBackdropUrl(path: string): string {
    const size = BackdropSize.W300;
    return `https://image.tmdb.org/t/p${size}${path}`;
  }

  private _choosePosterSize(): string {
    const connectionType = this._getConnectionType();
    let size = PosterSize.W500;

    if (connectionType === 'slow-2g' || connectionType === '2g') size = PosterSize.W154;
    else if (connectionType === '3g') size = PosterSize.W342;
    return size;
  }
}
