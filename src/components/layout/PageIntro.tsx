import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';
import { SectionHeading } from '@/components/ui/Bits';

type Props = {
  crumbs: Crumb[];
  title: string;
  desc?: string;
  align?: 'left' | 'center';
  /** 右侧「下一步」主推进按钮：每屏只允许一个主 CTA */
  next?: { label: string; to: string };
};

/**
 * 页面引导头：面包屑（我在哪）+ 标题 + 一句说明 + 唯一的下一步主推进。
 * 页面标题统一走这里，保证全站方向感一致。
 */
export default function PageIntro({ crumbs, title, desc, align = 'left', next }: Props) {
  return (
    <div data-testid="page-intro">
      <Breadcrumbs items={crumbs} className={align === 'center' ? 'justify-center' : ''} />
      <div className={`flex flex-wrap items-end justify-between gap-4 ${align === 'center' ? 'flex-col items-center' : ''}`}>
        <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
          <SectionHeading title={title} desc={desc} align={align} as="h1" />
        </div>
        {next && (
          <Link
            to={next.to}
            data-testid="intro-next"
            className="mb-6 inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 min-h-[44px] text-sm font-medium text-paperink transition-colors hover:bg-bone2"
          >
            下一步 · {next.label} <ArrowRight size={14} aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
