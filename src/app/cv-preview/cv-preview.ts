import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cv-preview',
  imports: [],
  templateUrl: './cv-preview.html',
  styleUrl: './cv-preview.css',
})
export class CvPreview {
  // הוספת ה-Input שמאפשר לקבל את displayData מהאבא
  @Input() displayData: any = {};
}
