import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class QrCodeServiceService {
  async generateQrDataUrl(url: string): Promise<string> {
    try {
      return await QRCode.toDataURL(url, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'M',
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
