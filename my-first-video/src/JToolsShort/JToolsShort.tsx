import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// --- Brand palette (J Tools: red on black) ---
const RED = "#ED1C24";
const RED_BRIGHT = "#FF2A30";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
// NOTE: placeholder font. Swap for the real brand font later via @remotion/google-fonts.
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const GLOW = "0 0 40px rgba(237,28,36,0.55)";

// Simplified recreation of the J Tools logo mark (two red bars forming the "J").
const JToolsLogo: React.FC<{ size?: number }> = ({ size = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <svg width={150 * size} height={190 * size} viewBox="0 0 150 190">
      <rect x={18} y={86} width={46} height={92} rx={10} fill={RED} />
      <rect x={82} y={12} width={50} height={166} rx={10} fill={RED} />
    </svg>
    <div
      style={{
        color: RED,
        fontWeight: 900,
        fontSize: 40 * size,
        letterSpacing: 6 * size,
        fontFamily: FONT,
        marginTop: 6 * size,
      }}
    >
      TOOLS
    </div>
  </div>
);

// Animated black background with a soft pulsing red glow.
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = interpolate(Math.sin(frame / 16), [-1, 1], [0.16, 0.4]);
  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, rgba(237,28,36,${pulse}) 0%, rgba(0,0,0,0) 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", padding: 80, textAlign: "center" }}
  >
    {children}
  </AbsoluteFill>
);

// Spring-based entrance, relative to each Sequence's local frame.
const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 16, mass: 0.7 } });
};

// Scene 1 — hook
const Hook: React.FC = () => {
  const logo = useEnter(0);
  const t = useEnter(12);
  return (
    <Center>
      <div style={{ transform: `scale(${logo})`, opacity: logo, marginBottom: 70 }}>
        <JToolsLogo size={0.7} />
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: WHITE,
          fontWeight: 900,
          fontSize: 100,
          lineHeight: 1.05,
          opacity: t,
          transform: `translateY(${interpolate(t, [0, 1], [40, 0])}px)`,
        }}
      >
        DID YOU
        <br />
        KNOW?
      </div>
    </Center>
  );
};

// Scene 2 — the claim
const Burn: React.FC = () => {
  const t1 = useEnter(0);
  const t2 = useEnter(18);
  return (
    <Center>
      <div style={{ fontFamily: FONT, color: WHITE, fontWeight: 700, fontSize: 72, opacity: t1 }}>
        On Solana, tokens
        <br /> can be
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: RED_BRIGHT,
          fontWeight: 900,
          fontSize: 160,
          marginTop: 30,
          textShadow: GLOW,
          opacity: t2,
          transform: `scale(${interpolate(t2, [0, 1], [0.6, 1])})`,
        }}
      >
        BURNED
      </div>
    </Center>
  );
};

// Scene 3 — explanation + live supply counter
const Explain: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useEnter(0);
  const n = Math.round(
    interpolate(frame, [25, 95], [1_000_000_000, 920_000_000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  return (
    <Center>
      <div
        style={{
          fontFamily: FONT,
          color: WHITE,
          fontWeight: 700,
          fontSize: 58,
          opacity: t,
          marginBottom: 70,
          lineHeight: 1.25,
        }}
      >
        Burned tokens leave
        <br /> the supply — forever.
      </div>
      <div style={{ fontFamily: FONT, color: RED, fontWeight: 900, fontSize: 84, textShadow: GLOW, opacity: t }}>
        {n.toLocaleString("en-US")}
      </div>
      <div style={{ fontFamily: FONT, color: "#9a9a9a", fontWeight: 600, fontSize: 34, marginTop: 12, opacity: t }}>
        total supply ↓
      </div>
    </Center>
  );
};

// Scene 4 — brand tie-in
const Brand: React.FC = () => {
  const t = useEnter(0);
  const logo = useEnter(15);
  return (
    <Center>
      <div style={{ fontFamily: FONT, color: WHITE, fontWeight: 700, fontSize: 56, opacity: t, marginBottom: 70 }}>
        Track burns &amp; supply with
      </div>
      <div style={{ transform: `scale(${logo})`, opacity: logo }}>
        <JToolsLogo size={1.15} />
      </div>
    </Center>
  );
};

// Scene 5 — call to action
const CTA: React.FC = () => {
  const t = useEnter(0);
  return (
    <Center>
      <div
        style={{
          fontFamily: FONT,
          color: WHITE,
          fontWeight: 900,
          fontSize: 120,
          textShadow: GLOW,
          opacity: t,
          transform: `scale(${interpolate(t, [0, 1], [0.8, 1])})`,
        }}
      >
        j.tools
      </div>
      <div
        style={{
          fontFamily: FONT,
          color: RED,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 3,
          marginTop: 22,
          opacity: t,
        }}
      >
        FREE CRYPTO TOOLS
      </div>
    </Center>
  );
};

// Cross-fade wrapper for each scene.
const Fade: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// 450 frames @ 30fps = 15s vertical Short.
export const JToolsShort: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Sequence from={0} durationInFrames={80}>
      <Fade durationInFrames={80}>
        <Hook />
      </Fade>
    </Sequence>
    <Sequence from={80} durationInFrames={100}>
      <Fade durationInFrames={100}>
        <Burn />
      </Fade>
    </Sequence>
    <Sequence from={180} durationInFrames={120}>
      <Fade durationInFrames={120}>
        <Explain />
      </Fade>
    </Sequence>
    <Sequence from={300} durationInFrames={90}>
      <Fade durationInFrames={90}>
        <Brand />
      </Fade>
    </Sequence>
    <Sequence from={390} durationInFrames={60}>
      <Fade durationInFrames={60}>
        <CTA />
      </Fade>
    </Sequence>
  </AbsoluteFill>
);
