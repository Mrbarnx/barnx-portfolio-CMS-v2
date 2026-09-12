import { PageMotion } from '@/components/MotionReveal';

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
