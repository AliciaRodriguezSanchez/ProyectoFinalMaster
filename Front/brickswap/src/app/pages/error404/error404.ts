import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleComponent } from '../../shared/ui/titles/title.component';
import { DescriptionsComponent } from '../../shared/ui/descriptions/descriptions.component';

@Component({
  selector: 'app-error404',
  imports: [RouterLink, TitleComponent, DescriptionsComponent],
  templateUrl: './error404.html',
  styleUrl: './error404.css',
})
export class Error404 {

}
