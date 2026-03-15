import { Component } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-forms',
    imports: [ReactiveFormsModule, JsonPipe],
    templateUrl: './forms.component.html'
})
export class FormsComponent {
  submitted = false;
  submittedData: any = null;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(3)]],
      email:    ['', [Validators.required, Validators.email]],
      age:      ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      role:     ['developer', Validators.required],
      skills:   this.fb.array([
        this.fb.control('Angular', Validators.required)
      ]),
      newsletter: [false]
    });
  }

  get name()  { return this.form.get('name')!; }
  get email() { return this.form.get('email')!; }
  get age()   { return this.form.get('age')!; }
  get skills(): FormArray { return this.form.get('skills') as FormArray; }

  addSkill()           { this.skills.push(this.fb.control('', Validators.required)); }
  removeSkill(i: number) { this.skills.removeAt(i); }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.submittedData = this.form.value;
    }
  }

  reset() {
    this.submitted = false;
    this.submittedData = null;
    this.form.reset({ role: 'developer', newsletter: false });
    while (this.skills.length > 1) this.skills.removeAt(1);
    this.skills.at(0).setValue('Angular');
  }

  fieldError(ctrl: AbstractControl | null, error: string): boolean {
    return !!(ctrl?.hasError(error) && (ctrl.dirty || ctrl.touched || this.submitted));
  }

  readonly code = `// forms.component.ts
constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    name:  ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    skills: this.fb.array([
      this.fb.control('Angular', Validators.required)
    ])
  });
}

get skills(): FormArray {
  return this.form.get('skills') as FormArray;
}

addSkill() {
  this.skills.push(this.fb.control('', Validators.required));
}

onSubmit() {
  if (this.form.valid) {
    console.log(this.form.value);
  }
}

<!-- forms.component.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="name" class="form-control">
  <div *ngIf="name.invalid && name.touched" class="error-msg">
    Name is required (min 3 chars)
  </div>

  <div formArrayName="skills">
    <div *ngFor="let skill of skills.controls; let i = index">
      <input [formControlName]="i" class="form-control">
      <button (click)="removeSkill(i)">Remove</button>
    </div>
    <button (click)="addSkill()">Add Skill</button>
  </div>

  <button type="submit" [disabled]="form.invalid">Submit</button>
</form>`;
}
