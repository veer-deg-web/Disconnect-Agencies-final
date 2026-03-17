"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import "./macbook-scroll.css";
import { MotionValue, motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons-react";
import { IconSearch } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";
import { IconCommand } from "@tabler/icons-react";
import { IconCaretLeftFilled } from "@tabler/icons-react";
import { IconCaretDownFilled } from "@tabler/icons-react";

const KeySoundContext = createContext<() => void>(() => {});

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
  className,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5],
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5],
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/sound.ogg");
    audio.preload = "auto";
    audio.volume = 0.1;
    audioRef.current = audio;
  }, []);

  const playKeySound = useCallback(() => {
    const base = audioRef.current;
    if (!base) return;
    try {
      const click = base.cloneNode(true) as HTMLAudioElement;
      click.volume = 0.1;
      click.currentTime = 0;
      click.play().catch(() => {});
      window.setTimeout(() => {
        click.pause();
        click.src = "";
      }, 120);
    } catch {
      // no-op
    }
  }, []);

  return (
    <KeySoundContext.Provider value={playKeySound}>
      <div
        ref={ref}
        className={cn("macbook-scroll-root", className)}
      >
        <motion.h2
          style={{
            translateY: textTransform,
            opacity: textOpacity,
          }}
          className="macbook-scroll-title"
        >
          {title || (
            <span>
              This Macbook is built with Tailwindcss. <br /> No kidding.
            </span>
          )}
        </motion.h2>
        {/* Lid */}
        <Lid
          src={src}
          scaleX={scaleX}
          scaleY={scaleY}
          rotate={rotate}
          translate={translate}
        />
        {/* Base area */}
        <div className="mbs-base">
          {/* above keyboard bar */}
          <div className="mbs-base-top">
            <div className="mbs-base-notch" />
          </div>
          <div className="mbs-base-mid">
            <div className="mbs-speaker-col">
              <SpeakerGrid />
            </div>
            <div className="mbs-keypad-col">
              <Keypad />
            </div>
            <div className="mbs-speaker-col">
              <SpeakerGrid />
            </div>
          </div>
          <Trackpad />
          <div className="mbs-base-hinge" />
          {showGradient && (
            <div className="mbs-base-gradient"></div>
          )}
          {badge && <div className="mbs-badge">{badge}</div>}
        </div>
      </div>
    </KeySoundContext.Provider>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="mbs-lid-wrap">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="mbs-lid"
      >
        <div
          style={{
            boxShadow: "0px 2px 0px 2px #171717 inset",
          }}
          className="mbs-lid-inner"
        >
          <span className="mbs-white">
            <AceternityLogo />
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="mbs-screen-shell"
      >
        <div className="mbs-screen-bg" />
        <Image
          src={src as string}
          alt="aceternity logo"
          fill
          className="mbs-screen-image"
          priority
        />
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div
      className="mbs-trackpad"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};

export const Keypad = () => {
  return (
    <div className="mbs-keypad">
      {/* First Row */}
      <div className="mbs-key-row">
        <KBtn
          className="mbs-key-w-10 mbs-key-label-left"
          childrenClassName="mbs-kc-start"
        >
          esc
        </KBtn>
        <KBtn>
          <IconBrightnessDown className="mbs-icon-6" />
          <span className="mbs-fkey-label">F1</span>
        </KBtn>
        <KBtn>
          <IconBrightnessUp className="mbs-icon-6" />
          <span className="mbs-fkey-label">F2</span>
        </KBtn>
        <KBtn>
          <IconTable className="mbs-icon-6" />
          <span className="mbs-fkey-label">F3</span>
        </KBtn>
        <KBtn>
          <IconSearch className="mbs-icon-6" />
          <span className="mbs-fkey-label">F4</span>
        </KBtn>
        <KBtn>
          <IconMicrophone className="mbs-icon-6" />
          <span className="mbs-fkey-label">F5</span>
        </KBtn>
        <KBtn>
          <IconMoon className="mbs-icon-6" />
          <span className="mbs-fkey-label">F6</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackPrev className="mbs-icon-6" />
          <span className="mbs-fkey-label">F7</span>
        </KBtn>
        <KBtn>
          <IconPlayerSkipForward className="mbs-icon-6" />
          <span className="mbs-fkey-label">F8</span>
        </KBtn>
        <KBtn>
          <IconPlayerTrackNext className="mbs-icon-6" />
          <span className="mbs-fkey-label">F8</span>
        </KBtn>
        <KBtn>
          <IconVolume3 className="mbs-icon-6" />
          <span className="mbs-fkey-label">F10</span>
        </KBtn>
        <KBtn>
          <IconVolume2 className="mbs-icon-6" />
          <span className="mbs-fkey-label">F11</span>
        </KBtn>
        <KBtn>
          <IconVolume className="mbs-icon-6" />
          <span className="mbs-fkey-label">F12</span>
        </KBtn>
        <KBtn>
          <div className="mbs-power-outer">
            <div className="mbs-power-inner" />
          </div>
        </KBtn>
      </div>

      {/* Second row */}
      <div className="mbs-key-row">
        <KBtn>
          <span className="mbs-block">~</span>
          <span className="mbs-block mbs-mt-1">`</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">!</span>
          <span className="mbs-block">1</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">@</span>
          <span className="mbs-block">2</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">#</span>
          <span className="mbs-block">3</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">$</span>
          <span className="mbs-block">4</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">%</span>
          <span className="mbs-block">5</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">^</span>
          <span className="mbs-block">6</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">&</span>
          <span className="mbs-block">7</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">*</span>
          <span className="mbs-block">8</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">(</span>
          <span className="mbs-block">9</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">)</span>
          <span className="mbs-block">0</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">&mdash;</span>
          <span className="mbs-block">_</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">+</span>
          <span className="mbs-block"> = </span>
        </KBtn>
        <KBtn
          className="mbs-key-w-10 mbs-key-label-right"
          childrenClassName="mbs-kc-end"
        >
          delete
        </KBtn>
      </div>

      {/* Third row */}
      <div className="mbs-key-row">
        <KBtn
          className="mbs-key-w-10 mbs-key-label-left"
          childrenClassName="mbs-kc-start"
        >
          tab
        </KBtn>
        <KBtn>
          <span className="mbs-block">Q</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">W</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">E</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">R</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">T</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">Y</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">U</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">I</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">O</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">P</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`{`}</span>
          <span className="mbs-block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`}`}</span>
          <span className="mbs-block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`|`}</span>
          <span className="mbs-block">{`\\`}</span>
        </KBtn>
      </div>

      {/* Fourth Row */}
      <div className="mbs-key-row">
        <KBtn
          className="mbs-key-w-caps mbs-key-label-left"
          childrenClassName="mbs-kc-start"
        >
          caps lock
        </KBtn>
        <KBtn>
          <span className="mbs-block">A</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">S</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">D</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">F</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">G</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">H</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">J</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">K</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">L</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`:`}</span>
          <span className="mbs-block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`"`}</span>
          <span className="mbs-block">{`'`}</span>
        </KBtn>
        <KBtn
          className="mbs-key-w-enter mbs-key-label-right"
          childrenClassName="mbs-kc-end"
        >
          return
        </KBtn>
      </div>

      {/* Fifth Row */}
      <div className="mbs-key-row">
        <KBtn
          className="mbs-key-w-shift mbs-key-label-left"
          childrenClassName="mbs-kc-start"
        >
          shift
        </KBtn>
        <KBtn>
          <span className="mbs-block">Z</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">X</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">C</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">V</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">B</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">N</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">M</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`<`}</span>
          <span className="mbs-block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`>`}</span>
          <span className="mbs-block">{`.`}</span>
        </KBtn>
        <KBtn>
          <span className="mbs-block">{`?`}</span>
          <span className="mbs-block">{`/`}</span>
        </KBtn>
        <KBtn
          className="mbs-key-w-shift mbs-key-label-right"
          childrenClassName="mbs-kc-end"
        >
          shift
        </KBtn>
      </div>

      {/* sixth Row */}
      <div className="mbs-key-row">
        <KBtn className="mbs-key-default" childrenClassName="mbs-kc-mod">
          <div className="mbs-mod-line-end">
            <span className="mbs-block">fn</span>
          </div>
          <div className="mbs-mod-line-start">
            <IconWorld className="mbs-icon-6" />
          </div>
        </KBtn>
        <KBtn className="mbs-key-default" childrenClassName="mbs-kc-mod">
          <div className="mbs-mod-line-end">
            <IconChevronUp className="mbs-icon-6" />
          </div>
          <div className="mbs-mod-line-start">
            <span className="mbs-block">control</span>
          </div>
        </KBtn>
        <KBtn className="mbs-key-default" childrenClassName="mbs-kc-mod">
          <div className="mbs-mod-line-end">
            <OptionKey className="mbs-icon-6" />
          </div>
          <div className="mbs-mod-line-start">
            <span className="mbs-block">option</span>
          </div>
        </KBtn>
        <KBtn
          className="mbs-key-w-8"
          childrenClassName="mbs-kc-mod"
        >
          <div className="mbs-mod-line-end">
            <IconCommand className="mbs-icon-6" />
          </div>
          <div className="mbs-mod-line-start">
            <span className="mbs-block">command</span>
          </div>
        </KBtn>
        <KBtn className="mbs-key-space"></KBtn>
        <KBtn
          className="mbs-key-w-8"
          childrenClassName="mbs-kc-mod"
        >
          <div className="mbs-mod-line-start">
            <IconCommand className="mbs-icon-6" />
          </div>
          <div className="mbs-mod-line-start">
            <span className="mbs-block">command</span>
          </div>
        </KBtn>
        <KBtn className="mbs-key-default" childrenClassName="mbs-kc-mod">
          <div className="mbs-mod-line-start">
            <OptionKey className="mbs-icon-6" />
          </div>
          <div className="mbs-mod-line-start">
            <span className="mbs-block">option</span>
          </div>
        </KBtn>
        <div className="mbs-arrow-wrap">
          <KBtn className="mbs-key-arrow">
            <IconCaretUpFilled className="mbs-icon-6" />
          </KBtn>
          <div className="mbs-flex">
            <KBtn className="mbs-key-arrow">
              <IconCaretLeftFilled className="mbs-icon-6" />
            </KBtn>
            <KBtn className="mbs-key-arrow">
              <IconCaretDownFilled className="mbs-icon-6" />
            </KBtn>
            <KBtn className="mbs-key-arrow">
              <IconCaretRightFilled className="mbs-icon-6" />
            </KBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  const playKeySound = useContext(KeySoundContext);
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = () => {
    setIsPressed(true);
    playKeySound();
  };
  const handlePointerUp = () => setIsPressed(false);

  return (
    <div
      className={cn(
        "mbs-kbtn-wrap",
        backlit && "mbs-kbtn-backlit",
      )}
    >
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "mbs-kbtn",
          isPressed && "mbs-kbtn-pressed",
          className,
        )}
        style={{
          boxShadow:
            "0px -0.5px 2px 0 #0D0D0F inset, -0.5px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "mbs-kbtn-content",
            childrenClassName,
            backlit && "mbs-kbtn-backlit-text",
          )}
        >
          {children}
        </div>
      </button>
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div
      className="mbs-speaker-grid"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.5px, transparent 0.5px)",
        backgroundSize: "3px 3px",
      }}
    ></div>
  );
};

export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="mbs-transparent-rect"
        width="32"
        height="32"
        stroke="none"
      />
    </svg>
  );
};

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mbs-logo-icon"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
};
