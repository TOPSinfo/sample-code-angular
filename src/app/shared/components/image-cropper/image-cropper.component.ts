import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImageFile: any = '';
  valToLower: String;
  validFileType = true;
  regex: any;
  regexTest: any;
  openPopUp = false;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.openPopUp = true;
    if (this.imageChangedEvent.target && this.imageChangedEvent.target.files.length > 0) {
      this.validFileType = this.checkExtension(this.imageChangedEvent.target.files[0].name);
    }
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  imageLoaded() {
    console.log('file');
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  imageCroppedFile(file) {
    const imageFile = new File([file], 'profile.png', { type: file.type, lastModified: Date.now() });
    this.croppedImageFile = imageFile;
  }
  respond() {
    if (this.croppedImage && this.croppedImage.length > 0) {
      this.activeModal.close({ file: this.croppedImageFile, image: this.croppedImage });
    } else {
      this.validFileType = false;
    }

  }

  close() {
    this.activeModal.close({ file: null, image: null });
  }

  checkExtension(file) {
    this.valToLower = file.toLowerCase();
    this.regex = new RegExp('(.*?)\.(jpg|png|jpeg)$');
    this.regexTest = this.regex.test(this.valToLower);
    return !this.regexTest ? false : true;
  }

}
