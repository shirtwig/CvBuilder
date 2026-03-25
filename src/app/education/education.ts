import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
/**
 * כאן בחרתי ב-ReactiveFormsModule.
 * למה כי יש לנו כאן צורך ב FormArray דינמי (הוספת/הסרת השכלה וקורסים).
 * זה נותן לי שליטה מלאה על ולידציות מורכבות בזמן אמת,
 *וגם לשנות חובת מילוי של תאריך סיום בהתאם לסטטוס הלימודים.
 */

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education implements OnInit {
  // Output לשליחת הנתונים לאבא לעדכון התצוגה בזמן אמת
  @Output() educationDataChanged = new EventEmitter<any>();

  // שימוש ב-Reactive Forms מאפשר ניהול דינמי של רשימות
  educationForm = new FormGroup({
    educations: new FormArray([
      this.createEducationItem()
    ])
  });

  ngOnInit(): void {
    // שליחת נתונים ראשונית
    this.educationDataChanged.emit(this.educations.value);

    // הרשמה לשינויים בטופס - כל הקלדה מעדכנת את האבא מיידית
    this.educationForm.valueChanges.subscribe(value => {
      this.educationDataChanged.emit(value.educations);
    });
  }

  /**
   * יצירת קבוצת טפסים עבור פריט השכלה בודד
   */
  createEducationItem(): FormGroup {
    const group = new FormGroup({
      institution: new FormControl('', Validators.required),
      degree: new FormControl('', Validators.required),
      fieldOfStudy: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      status: new FormControl('סיימתי', Validators.required),
      gradeAverage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      // FormArray פנימי עבור רשימת קורסים בכל השכלה
      courses: new FormArray([new FormControl('', Validators.required)]),
      isExcellence: new FormControl(false),
      description: new FormControl('', Validators.required)
    }, { validators: (control) => this.validateDates(control) });

    /**
     * לוגיקה דינמית:שינוי בסטטוס הלימודים.
     * אם המשתמש לומד כרגע, תאריך הסיום הופך ללא רלוונטי ולכן מסירים את חובת המילוי.
     */
    group.get('status')?.valueChanges.subscribe(status => {
      const endDateControl = group.get('endDate');
      if (status === 'לומדת כרגע') {
        endDateControl?.clearValidators(); // הסרת ולידציה
        endDateControl?.setErrors(null);   // ניקוי שגיאות קיימות
        endDateControl?.setValue(null);    // איפוס הערך
      } else {
        endDateControl?.setValidators([Validators.required]); // החזרת חובה
      }
      endDateControl?.updateValueAndValidity(); // ריענון מצב הטופס
    });

    return group;
  }

  // Getter נוח לגישה למערך ההשכלה
  get educations(): FormArray {
    return this.educationForm.get('educations') as FormArray;
  }

  /**
   * הוספת השכלה חדשה למערך.
   * מתבצעת בדיקה שהטופס הנוכחי תקין כדי לשמור על איכות הנתונים.
   */
  addEducation(): void {
    if (this.educationForm.valid) {
      this.educations.push(this.createEducationItem());
    } else {
      // חשיפת שגיאות למשתמש במידה והטופס לא תקין
      this.educationForm.markAllAsTouched();
      alert("יש למלא את כל השדות חובה בהשכלה הנוכחית לפני הוספת השכלה חדשה");
    }
  }

  // הסרת פריט מהרשימה (בתנאי שזה לא הפריט האחרון)
  removeEducation(index: number): void {
    if (this.educations.length > 1) {
      this.educations.removeAt(index);
    }
  }

  // עזרה בגישה למערך הקורסים בתוך השכלה ספציפית
  getCourses(educationIndex: number): FormArray {
    return this.educations.at(educationIndex).get('courses') as FormArray;
  }

  // הוספת שדה קורס נוסף
  addCourse(educationIndex: number): void {
    this.getCourses(educationIndex).push(new FormControl('', Validators.required));
  }

  // הסרת קורס ספציפי
  removeCourse(educationIndex: number, courseIndex: number): void {
    const courses = this.getCourses(educationIndex);
    if (courses.length > 1) {
      courses.removeAt(courseIndex);
    }
  }

  /**
   * ולידטור מותאם אישית ה-Group.
   * בודק שתאריך הסיום אינו מוקדם מתאריך ההתחלה.
   */
  validateDates(group: any) {
    const status = group.get('status')?.value;
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    // אם לומדת כרגע, אין צורך בבדיקת תאריך סיום
    if (status === 'לומדת כרגע') return null;

    // בדיקת היגיון כרונולוגי
    if (start && end && new Date(start) > new Date(end)) {
      return { invalidDateOrder: true };
    }

    return null;
  }
}
