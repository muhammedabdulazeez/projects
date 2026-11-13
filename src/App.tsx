/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, Download, Maximize2, X } from 'lucide-react';

import rawPart1Readme from '../web-hack-diaries-part-1/README.md?raw';
import rawPart2Readme from '../web-hack-diaries-part-2/README.md?raw';
import rawDay3Readme from '../README.md?raw';
import rawPart4Readme from '../web-hack-diaries-part-4/README.md?raw';
import rawAuthShieldReadme from '../authshield-360/README.md?raw';
import rawVpcFirewallProjectReadme from '../vpc-firewall-rules-project/README.md?raw';
import rawIamProjectReadme from '../iam-least-privilege-project/README.md?raw';
import rawFirewall01Readme from '../default-firewall-rules/README.md?raw';
import rawFirewall02Readme from '../create-rule-basic-settings/README.md?raw';
import rawFirewall03Readme from '../03-create-rule-ports-protocols/README.md?raw';
import rawFirewall04Readme from '../04-rule-created-confirmation/README.md?raw';
import rawFirewall05Readme from '../05-logs-explorer-vpc-flow-logs/README.md?raw';
import rawFirewall07Readme from '../07-firewall-denied-logs/README.md?raw';

type ViewMode = 'preview' | 'raw';
type CategoryFilter = 'all' | 'web-hack' | 'projects' | 'captures';

interface PostItem {
  id: string;
  title: string;
  subtitle: string;
  filePath: string;
  category: Exclude<CategoryFilter, 'all'>;
  raw: string;
}

interface LightboxImage {
  src: string;
  alt: string;
}

const POSTS: PostItem[] = [
  {
    id: 'part-1',
    title: 'Web Hack Diaries: Part 1',
    subtitle: 'Web Cache Deception (WCD)',
    filePath: 'web-hack-diaries-part-1/README.md',
    category: 'web-hack',
    raw: rawPart1Readme,
  },
  {
    id: 'part-2',
    title: 'Web Hack Diaries: Part 2',
    subtitle: 'WebSocket Security & Exploitation',
    filePath: 'web-hack-diaries-part-2/README.md',
    category: 'web-hack',
    raw: rawPart2Readme,
  },
  {
    id: 'day-3',
    title: 'Web Hack Diaries: Day 3',
    subtitle: 'The Authentication Frontier',
    filePath: 'README.md',
    category: 'web-hack',
    raw: rawDay3Readme,
  },
  {
    id: 'part-4',
    title: 'WebHackDiaries: Part 4',
    subtitle: 'SSRF (Server-Side Request Forgery)',
    filePath: 'web-hack-diaries-part-4/README.md',
    category: 'web-hack',
    raw: rawPart4Readme,
  },
  {
    id: 'authshield-360',
    title: 'AuthShield 360',
    subtitle: 'IAM & OIDC Academic Portal Report',
    filePath: 'authshield-360/README.md',
    category: 'projects',
    raw: rawAuthShieldReadme,
  },
  {
    id: 'vpc-firewall-project',
    title: 'VPC Firewall Rules Project',
    subtitle: 'Configuring & Verifying in Google Cloud',
    filePath: 'vpc-firewall-rules-project/README.md',
    category: 'projects',
    raw: rawVpcFirewallProjectReadme,
  },
  {
    id: 'iam-least-privilege',
    title: 'IAM Custom Roles Project',
    subtitle: 'Least-Privilege Access Control',
    filePath: 'iam-least-privilege-project/README.md',
    category: 'projects',
    raw: rawIamProjectReadme,
  },
  {
    id: 'fw-01',
    title: '01: Default Firewall Rules',
    subtitle: 'Google Cloud VPC Firewall Posture',
    filePath: 'default-firewall-rules/README.md',
    category: 'captures',
    raw: rawFirewall01Readme,
  },
  {
    id: 'fw-02',
    title: '02: Create Rule Basic Settings',
    subtitle: 'allow-http-ssh Rule Configuration',
    filePath: 'create-rule-basic-settings/README.md',
    category: 'captures',
    raw: rawFirewall02Readme,
  },
  {
    id: 'fw-03',
    title: '03: Ports & Protocols',
    subtitle: 'TCP Ports 80, 22 & 0.0.0.0/0',
    filePath: '03-create-rule-ports-protocols/README.md',
    category: 'captures',
    raw: rawFirewall03Readme,
  },
  {
    id: 'fw-04',
    title: '04: Rule Created Confirmation',
    subtitle: 'Firewall Policies Table Updated',
    filePath: '04-rule-created-confirmation/README.md',
    category: 'captures',
    raw: rawFirewall04Readme,
  },
  {
    id: 'fw-05',
    title: '05: VPC Flow Logs',
    subtitle: 'Logs Explorer Traffic Verification',
    filePath: '05-logs-explorer-vpc-flow-logs/README.md',
    category: 'captures',
    raw: rawFirewall05Readme,
  },
  {
    id: 'fw-07',
    title: '07: Firewall Denied Logs',
    subtitle: 'LQL Filter & DENIED Dispositions',
    filePath: '07-firewall-denied-logs/README.md',
    category: 'captures',
    raw: rawFirewall07Readme,
  },
];

function resolveLocalImageSrc(src?: string): string {
  if (!src) return '';
  return src.replace(/^(\.\.?\/)+public\//, '/');
}

export default function App() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [activePostId, setActivePostId] = useState<string>('part-1');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  const visiblePosts =
    categoryFilter === 'all' ? POSTS : POSTS.filter((p) => p.category === categoryFilter);

  const currentPost = POSTS.find((p) => p.id === activePostId) ?? POSTS[0];
  const rawReadme = currentPost.raw;
  const rawLines = rawReadme.split('\n');

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  const handleSelectCategory = (cat: CategoryFilter) => {
    setCategoryFilter(cat);
    const matching = cat === 'all' ? POSTS : POSTS.filter((p) => p.category === cat);
    if (matching.length > 0 && !matching.some((p) => p.id === activePostId)) {
      setActivePostId(matching[0].id);
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawReadme);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = rawReadme;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rawReadme], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#1f2328]">
      {/* Top Bar Contract: 3-zone header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#d0d7de]">
        <div className="max-w-[1360px] mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          <a
            href="#readme-viewer"
            className="text-base font-bold tracking-tight text-[#1f2328] whitespace-nowrap shrink-0"
          >
            GitHub README Showcase
          </a>

          <nav
            aria-label="Collection filter"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#59636e]"
          >
            <button
              type="button"
              onClick={() => handleSelectCategory('all')}
              className={`hover:text-[#1f2328] hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'all' ? 'text-[#1f2328] underline' : ''
              }`}
            >
              All Posts
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('web-hack')}
              className={`hover:text-[#1f2328] hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'web-hack' ? 'text-[#1f2328] underline' : ''
              }`}
            >
              Web Hack Diaries
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('projects')}
              className={`hover:text-[#1f2328] hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'projects' ? 'text-[#1f2328] underline' : ''
              }`}
            >
              Project Reports
            </button>
            <button
              type="button"
              onClick={() => handleSelectCategory('captures')}
              className={`hover:text-[#1f2328] hover:underline underline-offset-4 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === 'captures' ? 'text-[#1f2328] underline' : ''
              }`}
            >
              Firewall Captures
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1f2328] rounded-lg hover:bg-[#32383f] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969da]"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              Download README.md
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar Index + GitHub README Viewer */}
      <main
        id="readme-viewer"
        className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-6 items-start"
      >
        {/* Mobile Selector */}
        <div className="lg:hidden bg-white border border-[#d0d7de] rounded-xl p-4">
          <label
            htmlFor="mobile-post-select"
            className="block text-xs font-semibold text-[#59636e] mb-2"
          >
            Select README ({visiblePosts.length})
          </label>
          <select
            id="mobile-post-select"
            value={currentPost.id}
            onChange={(e) => {
              setActivePostId(e.target.value);
              setCopied(false);
            }}
            className="w-full px-3 py-2 text-sm bg-[#f6f8fa] border border-[#d0d7de] rounded-lg text-[#1f2328]"
          >
            {visiblePosts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title} — {post.subtitle}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block sticky top-20 bg-white border border-[#d0d7de] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#f6f8fa] border-b border-[#d0d7de] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1f2328]">README Collection</span>
            <span className="text-xs text-[#59636e] tabular-nums">{visiblePosts.length} files</span>
          </div>
          <nav aria-label="README files" className="divide-y divide-[#eaeef2] max-h-[calc(100vh-140px)] overflow-y-auto">
            {visiblePosts.map((post) => {
              const isActive = post.id === currentPost.id;
              return (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => {
                    setActivePostId(post.id);
                    setCopied(false);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors cursor-pointer block ${
                    isActive ? 'bg-[#f6f8fa]' : 'hover:bg-[#f6f8fa]/60'
                  }`}
                >
                  <div className="text-sm font-semibold text-[#1f2328] truncate">
                    {post.title}
                  </div>
                  <div className="text-xs text-[#59636e] truncate mt-0.5">{post.subtitle}</div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active README Document Panel */}
        <section className="bg-white border border-[#d0d7de] rounded-xl overflow-hidden min-w-0">
          {/* File Header / Toolbar */}
          <div className="px-4 sm:px-6 py-3 bg-[#f6f8fa] border-b border-[#d0d7de] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm min-w-0">
              <span className="font-mono font-semibold text-[#1f2328] truncate">
                {currentPost.filePath}
              </span>
              <span className="text-[#d0d7de]" aria-hidden="true">
                /
              </span>
              <span className="text-xs text-[#59636e] tabular-nums whitespace-nowrap">
                {rawLines.length} lines
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                role="tablist"
                aria-label="README view mode"
                className="inline-flex items-center p-0.5 bg-[#eaeef2] rounded-lg border border-[#d0d7de]"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'preview'}
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'preview'
                      ? 'bg-white text-[#1f2328] shadow-xs'
                      : 'text-[#59636e] hover:text-[#1f2328]'
                  }`}
                >
                  Preview
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={viewMode === 'raw'}
                  onClick={() => setViewMode('raw')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    viewMode === 'raw'
                      ? 'bg-white text-[#1f2328] shadow-xs'
                      : 'text-[#59636e] hover:text-[#1f2328]'
                  }`}
                >
                  Raw Markdown
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1f2328] bg-white border border-[#d0d7de] rounded-lg hover:bg-[#f3f4f6] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969da]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#1a7f37]" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#59636e]" aria-hidden="true" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {viewMode === 'raw' ? (
            <div className="overflow-x-auto bg-white">
              <table className="w-full border-collapse font-mono text-[13px] leading-6">
                <tbody>
                  {rawLines.map((line, index) => (
                    <tr key={index} className="hover:bg-[#f6f8fa]">
                      <td className="w-12 select-none px-4 py-0 text-right text-[#8c959f] tabular-nums align-top">
                        {index + 1}
                      </td>
                      <td className="px-4 py-0 whitespace-pre text-[#1f2328]">{line || ' '}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <article className="px-6 sm:px-10 md:px-12 py-10 max-w-[920px] mx-auto text-[15px] leading-[1.65] text-[#1f2328]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#1f2328] pb-3 mb-5 border-b border-[#d8dee4] [text-wrap:balance]">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1f2328] pb-2 mt-8 mb-4 border-b border-[#d8dee4]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg sm:text-xl font-semibold text-[#1f2328] mt-6 mb-3">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-semibold text-[#1f2328] mt-4 mb-2">{children}</h4>
                  ),
                  p: ({ children }) => <p className="my-3.5">{children}</p>,
                  hr: () => <hr className="my-8 border-[#d8dee4]" />,
                  ul: ({ children }) => (
                    <ul className="my-3 list-disc pl-6 space-y-1.5">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-3 list-decimal pl-6 space-y-1.5">{children}</ol>
                  ),
                  li: ({ children }) => <li className="leading-[1.6]">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 p-4 rounded-lg border border-[#d0d7de] bg-[#f6f8fa] text-[#59636e]">
                      {children}
                    </blockquote>
                  ),
                  pre: ({ children }) => (
                    <pre className="my-4 p-4 overflow-x-auto rounded-lg border border-[#d0d7de] bg-[#f6f8fa] font-mono text-[13px] leading-6 text-[#1f2328]">
                      {children}
                    </pre>
                  ),
                  code: ({ className, children }) => {
                    const isBlock =
                      Boolean(className?.startsWith('language-')) ||
                      String(children).includes('\n');
                    if (isBlock) {
                      return <code className="font-mono text-[13px]">{children}</code>;
                    }
                    return (
                      <code className="px-1.5 py-0.5 text-[0.875em] font-mono bg-[#eff1f3] text-[#1f2328] rounded-md">
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }) => (
                    <div className="my-5 overflow-x-auto border border-[#d0d7de] rounded-lg">
                      <table className="w-full border-collapse text-left text-[13px]">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#1f2328]">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-[#d0d7de]">{children}</tbody>
                  ),
                  tr: ({ children }) => <tr className="hover:bg-[#f6f8fa]">{children}</tr>,
                  th: ({ children }) => (
                    <th className="px-3.5 py-2.5 font-semibold whitespace-nowrap">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3.5 py-2.5 align-top tabular-nums">{children}</td>
                  ),
                  img: ({ src, alt }) => {
                    const resolved = resolveLocalImageSrc(src);
                    const altText = alt || currentPost.title;
                    return (
                      <span className="my-5 block">
                        <button
                          type="button"
                          onClick={() => setLightbox({ src: resolved, alt: altText })}
                          className="group relative block w-full overflow-hidden rounded-lg border border-[#d0d7de] bg-[#f6f8fa] cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969da]"
                        >
                          <img
                            src={resolved}
                            alt={altText}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto block"
                          />
                          <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-[#1f2328]/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 className="w-3 h-3" aria-hidden="true" />
                            Expand
                          </span>
                        </button>
                      </span>
                    );
                  },
                }}
              >
                {rawReadme}
              </ReactMarkdown>
            </article>
          )}
        </section>
      </main>

      {/* Fullscreen Lightbox for Screenshots */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close image preview"
            className="fixed top-4 right-4 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#1f2328] hover:bg-[#eaeef2] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-white/10"
          />
        </div>
      )}
    </div>
  );
}
