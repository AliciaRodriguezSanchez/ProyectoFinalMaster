import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiLogoComponent } from '../../ui/logo/ui-logo.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, UiLogoComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {}
