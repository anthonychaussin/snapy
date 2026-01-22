import {Component, ComponentRef, inject, OnInit, ViewContainerRef} from '@angular/core';

@Component({
             selector: 'app-menu-loader',
             standalone: true,
             template: ``,
             imports: []
           })
export class MenuLoaderComponent implements OnInit {
  private readonly vcr = inject(ViewContainerRef);
  private menuComponentRef?: ComponentRef<any>;

  async ngOnInit() {
    // Lazy load menu component only when this component is created
    const {MenuComponent} = await import('../menu/menu.component');
    this.menuComponentRef = this.vcr.createComponent(MenuComponent);
  }

  ngOnDestroy() {
    this.menuComponentRef?.destroy();
  }
}

