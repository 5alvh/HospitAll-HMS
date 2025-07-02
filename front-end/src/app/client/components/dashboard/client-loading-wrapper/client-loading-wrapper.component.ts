import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-client-loading-wrapper',
  imports: [NgIf],
  templateUrl: './client-loading-wrapper.component.html',
  styleUrl: './client-loading-wrapper.component.scss'
})
export class ClientLoadingWrapperComponent {

  @Input({required: true}) isLoading!: boolean;

}
