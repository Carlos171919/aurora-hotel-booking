import { Directive, ElementRef, OnInit, inject } from '@angular/core';

/**
 * Anima el elemento al entrar en pantalla (scroll-reveal). Uso: <section reveal>...</section>
 */
@Directive({
  selector: '[reveal]',
  standalone: true,
})
export class RevealDirective implements OnInit {
  private el = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal');

    if (!('IntersectionObserver' in window)) {
      node.classList.add('reveal-in');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add('reveal-in');
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
  }
}
