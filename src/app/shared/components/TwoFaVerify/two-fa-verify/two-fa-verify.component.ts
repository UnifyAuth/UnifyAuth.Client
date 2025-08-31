import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { stopVerify } from '../../../../core/store/TwoFA/two-fa.actions';

@Component({
  selector: 'app-two-fa-verify',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './two-fa-verify.component.html',
})
export class TwoFaVerifyComponent implements AfterViewInit {
  private router = inject(Router);
  private store = inject(Store);

  verifyForm: FormGroup;
  @Output() codeVerified = new EventEmitter<string>();
  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder) {
    this.verifyForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit5: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit6: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngAfterViewInit() {
    this.digitInputs.first.nativeElement.focus();
  }

  onKeyUp(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    const key = event.key;

    if (key >= '0' && key <= '9') {
      if (input.value.length === 1 && index < this.digitInputs.length - 1) {
        this.digitInputs.toArray()[index + 1].nativeElement.focus();
      }
    } else if (key === 'Backspace') {
      if (input.value.length === 0 && index > 0) {
        this.digitInputs.toArray()[index - 1].nativeElement.focus();
      }
    }

    if (this.verifyForm.valid) {
      const code = Object.values(this.verifyForm.value).join('');
      this.codeVerified.emit(code);
    }
  }
  onCancel() {
    this.router.navigate(['/settings']);
    this.store.dispatch(stopVerify());
  }
}
