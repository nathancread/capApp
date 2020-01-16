import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { RealFileLoaderService } from './real-file-loader.service';

@Injectable()
export class ImageManagementService {
  private readonly baseUrl = 'http://localhost:3000';

 private options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE 
    };

  constructor(
    private httpClient: HttpClient,
    private camera: Camera,
    private realFileLoaderService: RealFileLoaderService) {}

  async uploadFromCamera() {
    const imagePath: string = await this.camera.getPicture(this.options);
    const imageFile = await this.realFileLoaderService.getSingleFile(imagePath);
    return imageFile;
  }

  uploadImages(formData: FormData): Promise<any[]> {
    return this.httpClient.post<any[]>(`${this.baseUrl}/upload-photos`, formData).toPromise();
  }

  async listImagesOnServer(): Promise<string[]> {
    const imageNames = await this.httpClient.get<string[]>(`${this.baseUrl}/list-images`).toPromise();
    return imageNames.map(imageName => `${this.baseUrl}/images/${imageName}`);
  }
}
