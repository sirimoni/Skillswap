import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { buttonVariants } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';

const VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';
const ITEMS = ['Guitar', 'Python', 'Photoshop', 'Spanish', 'Yoga', 'Figma'];
const FADE = 0.5; // seconds

export default function Landing() {
  const { user } = useAuth();
  const videoRef = useRef(null);

  // JS-controlled fade loop: 0.5s fade-in, 0.5s fade-out, reset + 100ms pause on end
  useEffect(() => {
    const v = videoRef.current;
    let raf, timer;
    const tick = () => {
      const d = v.duration, t = v.currentTime;
      if (d) {
        let o = 1;
        if (t < FADE) o = t / FADE;
        else if (t > d - FADE) o = (d - t) / FADE;
        v.style.opacity = Math.max(0, Math.min(1, o));
      }
      raf = requestAnimationFrame(tick);
    };
    const onEnded = () => {
      v.style.opacity = 0;
      timer = setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); }, 100);
    };
    v.addEventListener('ended', onEnded);
    v.play().catch(() => {});
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); v.removeEventListener('ended', onEnded); };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <video ref={videoRef} src={VIDEO} muted playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0 }} />

      <div className="relative z-10">
        <section className="relative min-h-screen flex flex-col overflow-visible">
          {/* blurred overlay shape */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] opacity-90 bg-gray-950 blur-[82px]" />

          <Navbar hero />

          <div className="relative flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center text-center px-6">
              <h1 className="font-heading font-normal leading-[1.02] tracking-[-0.024em] text-[56px] sm:text-[120px] lg:text-[180px] 2xl:text-[220px]">
                <span className="text-foreground">Swap </span>
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)' }}>Skills</span>
              </h1>
              <p className="text-hero-sub text-lg leading-8 max-w-md mt-[9px] opacity-80">
                Teach what you know. Learn what you love.<br />Matched with people who need exactly that.
              </p>
              <Link to={user ? '/dashboard' : '/register'} className={`${buttonVariants({ variant: 'heroSecondary', size: 'lg' })} mt-[25px]`}>
                Find My Match
              </Link>
            </div>
          </div>

          {/* logo marquee */}
          <div className="relative pb-10 px-6">
            <div className="max-w-5xl mx-auto flex items-center gap-12">
              <p className="hidden sm:block shrink-0 text-foreground/50 text-sm">Skills swapped by learners<br />across the globe</p>
              <div className="flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee">
                  {[0, 1].map((copy) => (
                    <div key={copy} className="flex shrink-0 gap-16 pr-16" aria-hidden={copy === 1}>
                      {ITEMS.map((name) => (
                        <div key={name} className="flex items-center gap-3">
                          <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-xs font-semibold">{name[0]}</div>
                          <span className="text-base font-semibold text-foreground">{name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
