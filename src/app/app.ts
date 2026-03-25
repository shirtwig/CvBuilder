import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CvPreview } from './cv-preview/cv-preview';
import { Education } from './education/education';
import { PersonalDetails } from './personal-details/personal-details';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PersonalDetails, Education, CvPreview],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  currentCVData: any = {
    fullname: '',
    email: '',
    phone: '',
    description: '',
    educations: [] // חשוב לאתחל כמערך ריק
  };

  updateCVData(newData: any) {
    // אם newData הוא מערך, זה הגיע מההשכלה. אם הוא אובייקט, זה פרטים אישיים.
    if (Array.isArray(newData)) {
      this.currentCVData = { ...this.currentCVData, educations: newData };
    } else {
      this.currentCVData = { ...this.currentCVData, ...newData };
    }
  }
}
