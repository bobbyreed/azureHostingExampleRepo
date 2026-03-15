import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, required, email, minLength, maxLength } from '@angular/forms/signals';

interface RegistrationModel {
  username: string;
  email:    string;
  password: string;
  age:      string;
}

@Component({
  selector: 'app-signal-forms',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './signal-forms.component.html'
})
export class SignalFormsComponent {
  // The model is a WritableSignal — the source of truth for Signal Forms
  model = signal<RegistrationModel>({ username: '', email: '', password: '', age: '' });

  // form() wraps the model signal and adds reactive validation via schema function
  myForm = form(this.model, (p) => {
    required(p.username);
    minLength(p.username, 3);
    maxLength(p.username, 20);

    required(p.email);
    email(p.email);

    required(p.password);
    minLength(p.password, 8);

    required(p.age);
  });

  // Track which fields the user has touched (for deferred error display)
  touched: Record<keyof RegistrationModel, boolean> = {
    username: false, email: false, password: false, age: false
  };

  submitted = false;
  result: RegistrationModel | null = null;

  /** Update a field in the model signal */
  setField<K extends keyof RegistrationModel>(key: K, value: RegistrationModel[K]) {
    this.model.update(m => ({ ...m, [key]: value }));
  }

  touch(key: keyof RegistrationModel) {
    this.touched[key] = true;
  }

  showError(key: keyof RegistrationModel): boolean {
    return (this.touched[key] || this.submitted) && (this.myForm as any)[key]().invalid();
  }

  firstError(key: keyof RegistrationModel): string {
    const errs: any[] = (this.myForm as any)[key]().errors();
    if (!errs?.length) return '';
    const e = errs[0];
    switch (e.kind) {
      case 'required':   return 'This field is required.';
      case 'email':      return 'Enter a valid email address.';
      case 'minLength':  return `Minimum ${e.minLength} characters (got ${e.actualLength}).`;
      case 'maxLength':  return `Maximum ${e.maxLength} characters.`;
      default:           return 'Invalid value.';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.touched = { username: true, email: true, password: true, age: true };
    if (this.myForm().valid()) {
      this.result = { ...this.model() };
    }
  }

  reset() {
    this.model.set({ username: '', email: '', password: '', age: '' });
    this.touched = { username: false, email: false, password: false, age: false };
    this.submitted = false;
    this.result = null;
  }

  readonly code = `import { form, required, email, minLength } from '@angular/forms/signals';

interface UserModel { name: string; email: string; password: string; }

// The model is a WritableSignal — Signal Forms wraps it, not the other way
model = signal<UserModel>({ name: '', email: '', password: '' });

// form(WritableSignal, schemaFn) — schema fn receives SchemaPathTree
myForm = form(this.model, (p) => {
  required(p.name);
  minLength(p.name, 3);
  required(p.email);
  email(p.email);          // validates email format
  required(p.password);
  minLength(p.password, 8);
});

// Access reactive field state (all are Signals):
myForm.name.valid()         // Signal<boolean>
myForm.name.invalid()       // Signal<boolean>
myForm.name.errors()        // Signal<ValidationError[]>
myForm.valid()              // Signal<boolean> — entire form

// Each ValidationError has a .kind property:
// 'required', 'email', 'minLength', 'maxLength', 'pattern'

// Update the model to trigger validation:
this.model.update(m => ({ ...m, name: 'Alice' }));

// Or bind via events in the template:
// (input)="model.update(m => ({ ...m, name: $event.target.value }))"`;
}
