import { Component, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {
  @Input() activeSection: string = 'dashboard';
  @Output() sectionChange = new EventEmitter<string>();
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.setActiveSectionFromUrl(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.setActiveSectionFromUrl(event.urlAfterRedirects);
    });
  }

  private setActiveSectionFromUrl(url: string) {
    const pathSegment = url.split('/')[2];
    console.log(pathSegment);
    this.activeSection = pathSegment || 'summary';
  }

  changeSection(section: string) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
}
