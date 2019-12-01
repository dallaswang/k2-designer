import { Injectable } from '@angular/core';

import { joinUrl } from '../shared/utils';

export abstract class ServiceConfig {
  baseUrl: string;
  directLineSecret: string;
  chatbotId: string;
}

@Injectable()
export class ConfigService {
  baseUrl = '/';
  directLineSecret = '';
  chatbotId = '';

  constructor(config?: ServiceConfig) {
    Object.keys(config).forEach((key) => {
      if (typeof config[key] === 'undefined') {
        return;
      }

      this[key] = config[key];
    });
  }

  getUrl(url): string {
    return joinUrl(this.baseUrl, url);
  }

  getFileUrl(file): string {
    file = this.isGuid(file) ? joinUrl('files', file) : file;
    return this.getUrl(file);
  }

  getImageUrl(file): string {
    return `${this.getFileUrl(file)}?maxPixel=1024`
  }

  private isGuid(file) {
    return /^[A-F0-9]{8}(-[A-F0-9]{4}){3}-[A-F0-9]{12}$/i.test(file);
  }
}
