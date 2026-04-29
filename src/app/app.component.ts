import { Component, OnInit, AfterViewInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  isMenuOpen = false;
  typedText = '';
  fullHeroText = 'نحن لا نكتفي بالبرمجة، نحن شريكك الاستراتيجي لتحسين أداء شركتك وتطوير منتجاتك للوصول إلى أقصى إمكانياتها في السوق.';

  contactForm = {
    name: '',
    project: '',
    message: ''
  };

  chartsAnimated = false;

  reveals: { [key: string]: boolean } = {
    services: false,
    svc1: false, svc2: false, svc3: false, svc4: false, svc5: false, svc6: false,
    stats: false,
    productsHeader: false,
    prod1: false, prod2: false, prod3: false, prod4: false,
    processHeader: false,
    step1: false, step2: false, step3: false, step4: false,
    whyHeader: false,
    trust1: false, trust2: false, trust3: false, trust4: false, trust5: false, trust6: false,
    cta: false
  };

  stats = {
    devs: { current: 0, target: 10, prefix: '+', suffix: '' },
    countries: { current: 0, target: 5, prefix: '', suffix: '' },
    satisfaction: { current: 0, target: 99, prefix: '', suffix: '٪' },
    years: { current: 0, target: 4, prefix: '', suffix: '+' },
    gridDevs: { current: 0, target: 15 },
    gridSatisfaction: { current: 0, target: 99 },
    gridSpeed: { current: 0, target: 3 },
    gridSavings: { current: 0, target: 25 }
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTyping();
      setTimeout(() => {
        this.animateHeroStats();
        this.chartsAnimated = true;
      }, 500);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      // Fallback: Show everything after 3 seconds if observer fails
      setTimeout(() => {
        Object.keys(this.reveals).forEach(key => this.reveals[key] = true);
      }, 3000);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  sendToWhatsApp() {
    const phone = '201125411335';
    const text = `أهلاً، أنا ${this.contactForm.name}. أريد البدء في مشروع: ${this.contactForm.project}.%0A%0Aرسالتي: ${this.contactForm.message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
    }
  }

  startTyping() {
    if (!this.fullHeroText) return;
    let i = 0;
    const interval = setInterval(() => {
      this.typedText = this.fullHeroText.slice(0, i++);
      if (i > this.fullHeroText.length) {
        clearInterval(interval);
      }
    }, 30);
  }

  animateHeroStats() {
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);

      this.stats.devs.current = Math.round(ease * this.stats.devs.target);
      this.stats.countries.current = Math.round(ease * this.stats.countries.target);
      this.stats.satisfaction.current = Math.round(ease * this.stats.satisfaction.target);
      this.stats.years.current = Math.round(ease * this.stats.years.target);

      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  runCounter(key: keyof typeof this.stats) {
    const stat = this.stats[key] as any;
    if (stat.current > 0) return; // Already run

    const target = stat.target;
    const duration = 1600;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      stat.current = Math.round(ease * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-reveal-id');
          if (id && this.reveals[id] !== undefined) {
            this.reveals[id] = true;

            // Special triggers
            if (id === 'stats') {
              this.runCounter('gridDevs');
              this.runCounter('gridSatisfaction');
              this.runCounter('gridSpeed');
              this.runCounter('gridSavings');
            }
          }
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('[data-reveal-id]').forEach((el) => {
      observer.observe(el);
    });
  }
}
