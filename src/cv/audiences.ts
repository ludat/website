import type { Lang } from '../i18n/ui';

/**
 * CV variants. Each one gets its own static route (/{lang}/cv/{id}/) built from
 * the same MDX source; content is filtered with the <For> component and the
 * `for` fields of <Highlights> / <Tags>.
 */
export const audiences = {
  devops: {
    label: { en: 'DevOps / SRE', es: 'DevOps / SRE' },
  },
  backend: {
    label: { en: 'FP Backend', es: 'Backend FP' },
  },
} as const;

export type Audience = keyof typeof audiences;

/** Sentinel for the unfiltered CV, so filters can treat it as one more value. */
export const FULL = 'full' as const;

export type AudienceOrFull = Audience | typeof FULL;

export const fullLabel: Record<Lang, string> = {
  en: 'Full CV',
  es: 'CV completo',
};

export const audienceLabel = (audience: AudienceOrFull, lang: Lang): string =>
  audience === FULL ? fullLabel[lang] : audiences[audience].label[lang];

export const audienceIds = Object.keys(audiences) as Audience[];

/** Current variant, readable from any component rendered inside the CV page. */
export function currentAudience(params: Record<string, string | undefined>): AudienceOrFull {
  const audience = params.audience;
  return audience && audience in audiences ? (audience as Audience) : FULL;
}

/**
 * Shared visibility rule for <For>, <Highlights> and <Tags>.
 *
 * Prefer `not` for filtering: it narrows the variants while keeping the item on
 * the full CV, which is meant to be the superset of everything. Reach for `only`
 * just when a piece of content is exclusive to some variants — an intro
 * paragraph or an entry rewritten per audience, where the full CV has its own.
 */
export function isVisible(
  current: AudienceOrFull,
  only?: readonly AudienceOrFull[],
  not?: readonly AudienceOrFull[],
): boolean {
  if (only) return only.includes(current);
  if (not) return !not.includes(current);
  return true;
}
