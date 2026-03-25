import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
/**
 * כאן בחרתי ב-FormsModule (Template-driven).
 * למה? כי הפרטים האישיים הם מבנה פשוט.
 * זה מאפשר עבודה מהירה עם ngModel וולידציות רגילות
 * בלי להעמיס בקוד מיותר ב-TypeScript.
 */


@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './personal-details.html',
  styleUrl: './personal-details.css'
})
export class PersonalDetails {
  // 1.  משדר (Output)
  @Output() dataChanged = new EventEmitter<any>();

  PersonalDetails = {
    fullname: '',
    email: '',
    phone: '',
    description: ''
  };

  // 2. הפונקציה שמשדרת את השינוי
  notifyChange() {
    this.dataChanged.emit(this.PersonalDetails);
  }
}
