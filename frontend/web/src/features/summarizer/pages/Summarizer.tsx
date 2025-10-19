import { Spinner } from '@/assets/animations/Spinner';
import { QuillPen } from '@/assets/icons/Ai';
import { Button, Slider } from '@/components/ui';
import { Error, Loader, NoContent } from '@/features/app';
import {
  useSummarizeMutation,
  type SummarizerRequest,
  type SummaryStyle,
} from '@/features/summarizer';
import { cn } from '@/lib/utils';
import { normalizeCapitalization } from '@/utils/format';
import { Check, Clipboard, Copy } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import count from 'word-count';

export const Summarizer: React.FC = () => {
  const [length, setLength] = React.useState<number>(200);
  const [style, setStyle] = React.useState<SummaryStyle>('formal');
  const [text, setText] = React.useState<string>('');
  const [summary, setSummary] = React.useState<string>('');
  const [summarize, { isLoading, isError }] = useSummarizeMutation();
  const [copied, setCopied] = React.useState(false);

  const summaryRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isLoading]);

  const handleSummary = async () => {
    if (!text) {
      toast.error('Please enter or paste text to summarize');
      return;
    }
    setSummary('');
    const req: SummarizerRequest = {
      style,
      summary_length: length,
      lecture_text: text,
    };
    const data = await summarize(req).unwrap();
    setSummary(data.summary);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      toast.error('Failed to read from clipboard');
    }
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Failed to copy summary');
    }
  };

  return (
    <main className="space-y-5">
      <article className="text-center p-5">
        <h1 className="font-semibold text-lg md:text-2xl">
          Summarize Smarter, Not Harder
        </h1>
        <p>
          Instantly condense any text while keeping all key insights intact.
        </p>
      </article>

      <div className="mx-auto max-w-6xl md:p-2.5">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-5 px-5 py-2.5">
          <section className="flex items-center gap-2.5">
            <span>Modes:</span>
            <div className="flex items-center gap-2.5">
              <Button
                variant={style === 'formal' ? 'primary' : 'outline'}
                onClick={() => setStyle('formal')}
              >
                Formal
              </Button>
              <Button
                variant={style === 'creative' ? 'primary' : 'outline'}
                onClick={() => setStyle('creative')}
              >
                Creative
              </Button>
            </div>
          </section>
          <div className="flex items-center gap-2.5 w-full md:w-90">
            <span className="whitespace-nowrap">Summary Length:</span>
            <span className="text-[var(--color-text-muted)]">Short</span>

            <Slider
              value={[length]}
              onValueChange={(val) => setLength(val[0])}
              max={600}
              min={75}
              step={10}
            />
            <span className="text-[var(--color-text-muted)]">Long</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 outline outline-[var(--color-border)] md:rounded-2xl">
          <section className="relative h-96 border-b md:border-r md:border-b-0 border-[var(--color-border)] pb-15">
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter or paste your text and press summarize"
              className="w-full h-full resize-none p-5 outline-0"
            />
            {!text && (
              <Button
                variant="outline"
                onClick={handlePaste}
                className="absolute top-2/6 left-1/2 -translate-x-1/2 outline-2 outline-[var(--color-text-primary)]"
              >
                <Clipboard className="size-5" /> Paste Text
              </Button>
            )}
            <Button
              className="absolute bottom-2.5 right-2.5 w-30 h-9"
              onClick={handleSummary}
              disabled={isLoading || count(text) > 600}
            >
              {isLoading ? <Spinner className="size-4" /> : 'Summarize'}
            </Button>
            {text && (
              <Button
                variant="ghost"
                className={cn(
                  'absolute bottom-2.5 left-2.5',
                  count(text) > 600 && 'text-[var(--color-error)]'
                )}
              >
                <span className="font-bold">
                  {count(text)}
                  {count(text) > 600 ? '/600' : ''}
                </span>{' '}
                word
                {count(text) > 1 ? 's' : ''}
              </Button>
            )}
          </section>

          <section className="relative h-[80dvh] md:h-96 pb-15">
            <textarea
              id="summary"
              ref={summaryRef}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full h-full resize-none p-5 outline-0"
              disabled={!summary}
            />

            <Button variant="ghost" className="absolute bottom-2.5 left-2.5">
              {summary && `${normalizeCapitalization(style)} `}Summary •{' '}
              <span className="font-bold">{count(summary)}</span> word
              {count(summary) > 1 ? 's' : ''}
            </Button>

            {summary && (
              <Button
                variant="icon"
                className="absolute bottom-2.5 right-2.5"
                onClick={handleCopy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            )}

            {!summary && !isLoading && !isError && (
              <NoContent
                icon={<QuillPen className="size-8 opacity-80" />}
                message="Summary will appear here"
              />
            )}

            {isLoading && <Loader message="Summarizing Text" />}
            {isError && (
              <Error
                message={{
                  main: 'Failed to summarize the text',
                  sub: 'Please check your internet connection or try again later.',
                }}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
